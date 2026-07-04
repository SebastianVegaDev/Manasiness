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

export async function findSuppliersPending(data: StoreScopedData): Promise<PendingRow[]> {
    const result = await pool.query<PendingRow>(`
        SELECT
            orders.id,
            users.name,
            users.name AS person,
            users.name AS supplier,
            products.name AS product,
            orders.cost_price * orders.quantity AS amount,
            orders.ordered_at AS date,
            orders.ordered_at AS day_ago
        FROM orders
        JOIN users
            ON users.id = orders.user_id
            AND users.store_id = orders.store_id
        JOIN products
            ON products.id = orders.product_id
            AND products.store_id = orders.store_id
        WHERE orders.store_id = $1
        AND orders.state = 'pending'
        AND users.role = 'supplier'
        ORDER BY orders.ordered_at ASC;
    `, [data.storeId])

    return result.rows
}

export async function findSuppliersPendingSummary(data: StoreScopedData): Promise<PendingSummaryRow | null> {
    const result = await pool.query<PendingSummaryRow>(`
        SELECT
            COUNT(*) AS total_count,
            COALESCE(SUM(orders.cost_price * orders.quantity), 0) AS total_amount
        FROM orders
        JOIN users
            ON users.id = orders.user_id
            AND users.store_id = orders.store_id
        WHERE orders.store_id = $1
        AND orders.state = 'pending'
        AND users.role = 'supplier'
    `, [data.storeId])

    return result.rows[0] ?? null
}

async function resolveSupplierPendingWithClient(
    client: PoolClient,
    data: ResolvePendingData
): Promise<PendingRecordRow> {
    const orderResult = await client.query<PendingRecordRow>(`
        SELECT id, product_id, quantity, state
        FROM orders
        WHERE id = $1 AND store_id = $2
        FOR UPDATE
    `, [data.id, data.storeId])

    const order = orderResult.rows[0]

    if (!order) {
        throw notFound("Record not found")
    }

    if (order.state !== "pending") {
        throw conflict("Action unavailable")
    }

    if (data.state === "paid") {
        const productResult = await client.query<{ id: number; is_active: boolean }>(`
            SELECT id, is_active
            FROM products
            WHERE id = $1 AND store_id = $2
            FOR UPDATE
        `, [order.product_id, data.storeId])

        const product = productResult.rows[0]

        if (!product || !product.is_active) {
            throw conflict("Action unavailable")
        }

        const updateResult = await client.query<PendingRecordRow>(`
            UPDATE orders
            SET state = $1,
                ordered_at = CURRENT_TIMESTAMP
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
        UPDATE orders
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

export async function resolveSupplierPending(data: ResolvePendingData): Promise<PendingRecordRow> {
    return withTransaction((client) => resolveSupplierPendingWithClient(client, data))
}
