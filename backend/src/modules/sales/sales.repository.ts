import type { PoolClient } from "pg"

import pool from "../../config/db.js"
import type {
    CreateSaleData,
    ProductMovementLookupRow,
    SaleRow,
    UserMovementLookupRow
} from "../../types/movement.types.js"
import type { IdScopedData, StoreScopedData } from "../../types/history.types.js"

export async function findAllSales(data: {
    storeId: number
    limit: number
    rowOffset: number
    dayOffset: number
    orderDirection: "ASC" | "DESC"
}): Promise<SaleRow[]> {
    const result = await pool.query<SaleRow>(`
        WITH target_window AS (
            SELECT
                (CURRENT_DATE - ($4 * INTERVAL '1 day'))::date AS start_date,
                (CURRENT_DATE - ($4 * INTERVAL '1 day'))::date AS end_date
        ),
        filtered_sales AS (
            SELECT
                sales.id,
                sales.sold_at AS date,
                products.name AS product,
                users.name AS customer,
                sales.sale_price AS price,
                sales.quantity,
                sales.state,
                target_window.start_date,
                target_window.end_date
            FROM sales
            JOIN products ON products.id = sales.product_id
                AND products.store_id = sales.store_id
            JOIN users ON users.id = sales.user_id
                AND users.store_id = sales.store_id
            CROSS JOIN target_window
            WHERE sales.store_id = $1
                AND sales.sold_at >= target_window.start_date
                AND sales.sold_at < target_window.start_date + INTERVAL '1 day'
        ),
        counted_sales AS (
            SELECT COUNT(*) AS total_rows
            FROM filtered_sales
        ),
        window_info AS (
            SELECT
                EXISTS (
                    SELECT 1
                    FROM sales
                    CROSS JOIN target_window
                    WHERE sales.store_id = $1
                        AND sales.sold_at < target_window.start_date
                ) AS has_older,
                ($4 > 0) AS has_newer
        )
        SELECT
            filtered_sales.*,
            counted_sales.total_rows,
            window_info.has_older,
            window_info.has_newer
        FROM filtered_sales
        CROSS JOIN counted_sales
        CROSS JOIN window_info
        ORDER BY filtered_sales.date ${data.orderDirection}
        LIMIT $2 OFFSET $3
    `, [
        data.storeId,
        data.limit,
        data.rowOffset,
        data.dayOffset
    ])

    return result.rows
}

export async function findSaleProductById(data: IdScopedData): Promise<ProductMovementLookupRow | null> {
    const result = await pool.query<ProductMovementLookupRow>(`
        SELECT id, name, cost_price, sale_price, stock, is_active
        FROM products
        WHERE id = $1 AND store_id = $2
    `, [data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findSaleCustomerById(data: IdScopedData): Promise<UserMovementLookupRow | null> {
    const result = await pool.query<UserMovementLookupRow>(`
        SELECT id, name, role, is_default, is_active
        FROM users
        WHERE id = $1 AND store_id = $2
    `, [data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function insertSale(
    client: PoolClient,
    data: CreateSaleData & { salePrice: number }
): Promise<SaleRow | null> {
    const result = await client.query<SaleRow>(`
        WITH inserted_sale AS (
            INSERT INTO sales (
                store_id,
                product_id,
                user_id,
                sale_price,
                quantity,
                state
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        )
        SELECT
            inserted_sale.id,
            inserted_sale.sold_at AS date,
            products.name AS product,
            users.name AS customer,
            inserted_sale.sale_price AS price,
            inserted_sale.quantity,
            inserted_sale.state
        FROM inserted_sale
        JOIN products ON products.id = inserted_sale.product_id
            AND products.store_id = inserted_sale.store_id
        JOIN users ON users.id = inserted_sale.user_id
            AND users.store_id = inserted_sale.store_id
    `, [
        data.storeId,
        data.productId,
        data.userId,
        data.salePrice,
        data.quantity,
        data.state
    ])

    return result.rows[0] ?? null
}

export async function findProductForUpdate(
    client: PoolClient,
    data: IdScopedData
): Promise<ProductMovementLookupRow | null> {
    const result = await client.query<ProductMovementLookupRow>(`
        SELECT id, name, cost_price, sale_price, stock, is_active
        FROM products
        WHERE id = $1 AND store_id = $2
        FOR UPDATE
    `, [data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findUserForSale(
    client: PoolClient,
    data: StoreScopedData & { userId: number }
): Promise<UserMovementLookupRow | null> {
    const result = await client.query<UserMovementLookupRow>(`
        SELECT id, name, role, is_default, is_active
        FROM users
        WHERE id = $1 AND store_id = $2
    `, [data.userId, data.storeId])

    return result.rows[0] ?? null
}