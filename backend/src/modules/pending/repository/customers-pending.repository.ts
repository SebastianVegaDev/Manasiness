import type { PoolClient } from "pg"

import pool from "../../../config/db.js"
import { conflict, notFound } from "../../../errors/http-errors.js"
import { withTransaction } from "../../../shared/db/transaction.js"
import type {
    PendingRecordRow,
    PendingRow,
    PendingSummaryRow,
    ResolvePendingData
} from "../../../types/pending.types.js"
import type { StoreScopedData } from "../../../types/history.types.js"

export async function findCustomersPending(data: StoreScopedData): Promise<PendingRow[]> {
    const result = await pool.query<PendingRow>(`
        SELECT
            sales.id,
            users.name,
            users.name AS person,
            users.name AS customer,
            products.name AS product,
            sales.sale_price * sales.quantity AS amount,
            sales.sold_at AS date,
            sales.sold_at AS day_ago
        FROM sales
        JOIN users
            ON users.id = sales.user_id
            AND users.store_id = sales.store_id
        JOIN products
            ON products.id = sales.product_id
            AND products.store_id = sales.store_id
        WHERE sales.store_id = $1
        AND sales.state = 'pending'
        AND users.role = 'customer'
        ORDER BY sales.sold_at ASC;
    `, [data.storeId])

    return result.rows
}

export async function findCustomersPendingSummary(data: StoreScopedData): Promise<PendingSummaryRow | null> {
    const result = await pool.query<PendingSummaryRow>(`
        SELECT
            COUNT(*) AS total_count,
            COALESCE(SUM(sales.sale_price * sales.quantity), 0) AS total_amount
        FROM sales
        JOIN users
            ON users.id = sales.user_id
            AND users.store_id = sales.store_id
        WHERE sales.store_id = $1
        AND sales.state = 'pending'
        AND users.role = 'customer'
    `, [data.storeId])

    return result.rows[0] ?? null
}

async function resolveCustomerPendingWithClient(
    client: PoolClient,
    data: ResolvePendingData
): Promise<PendingRecordRow> {
    const saleResult = await client.query<PendingRecordRow>(`
        SELECT id, product_id, quantity, state
        FROM sales
        WHERE id = $1 AND store_id = $2
        FOR UPDATE
    `, [data.id, data.storeId])

    const sale = saleResult.rows[0]

    if (!sale) {
        throw notFound("Record not found")
    }

    if (sale.state !== "pending") {
        throw conflict("Action unavailable")
    }

    if (data.state === "paid") {
        const productResult = await client.query<{ id: number; stock: string | number; is_active: boolean }>(`
            SELECT id, stock, is_active
            FROM products
            WHERE id = $1 AND store_id = $2
            FOR UPDATE
        `, [sale.product_id, data.storeId])

        const product = productResult.rows[0]

        if (!product || !product.is_active) {
            throw conflict("Action unavailable")
        }

        if (Number(product.stock) < Number(sale.quantity)) {
            throw conflict("Insufficient stock")
        }

        const updateResult = await client.query<PendingRecordRow>(`
            UPDATE sales
            SET state = $1,
                sold_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND store_id = $3
            RETURNING id, product_id, quantity, state
        `, [data.state, data.id, data.storeId])

        const updated = updateResult.rows[0]

        if (!updated) {
            throw notFound("Record not found")
        }

        return updated
    }

    const updateResult = await client.query<PendingRecordRow>(`
        UPDATE sales
        SET state = $1
        WHERE id = $2 AND store_id = $3
        RETURNING id, product_id, quantity, state
    `, [data.state, data.id, data.storeId])

    const updated = updateResult.rows[0]

    if (!updated) {
        throw notFound("Record not found")
    }

    return updated
}

export async function resolveCustomerPending(data: ResolvePendingData): Promise<PendingRecordRow> {
    return withTransaction((client) => resolveCustomerPendingWithClient(client, data))
}
