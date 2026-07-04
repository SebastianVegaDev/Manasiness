import type { PoolClient } from "pg"

import pool from "../../config/db.js"
import type { IdScopedData, StoreScopedData } from "../../types/history.types.js"
import type {
    CreateOrderData,
    OrderRow,
    ProductMovementLookupRow,
    UserMovementLookupRow
} from "../../types/movement.types.js"

export async function findAllOrders(data: {
    storeId: number
    limit: number
    rowOffset: number
    dayOffset: number
    orderDirection: "ASC" | "DESC"
}): Promise<OrderRow[]> {
    const result = await pool.query<OrderRow>(`
        WITH target_window AS (
            SELECT
                (CURRENT_DATE - ($4 * INTERVAL '1 day'))::date AS start_date,
                (CURRENT_DATE - ($4 * INTERVAL '1 day'))::date AS end_date
        ),
        filtered_orders AS (
            SELECT
                orders.id,
                orders.ordered_at AS date,
                products.name AS product,
                users.name AS supplier,
                orders.cost_price AS price,
                orders.quantity,
                orders.state,
                target_window.start_date,
                target_window.end_date
            FROM orders
            JOIN products ON products.id = orders.product_id
                AND products.store_id = orders.store_id
            JOIN users ON users.id = orders.user_id
                AND users.store_id = orders.store_id
            CROSS JOIN target_window
            WHERE orders.store_id = $1
                AND orders.ordered_at >= target_window.start_date
                AND orders.ordered_at < target_window.start_date + INTERVAL '1 day'
        ),
        counted_orders AS (
            SELECT COUNT(*) AS total_rows
            FROM filtered_orders
        ),
        window_info AS (
            SELECT
                EXISTS (
                    SELECT 1
                    FROM orders
                    CROSS JOIN target_window
                    WHERE orders.store_id = $1
                        AND orders.ordered_at < target_window.start_date
                ) AS has_older,
                ($4 > 0) AS has_newer
        )
        SELECT
            filtered_orders.*,
            counted_orders.total_rows,
            window_info.has_older,
            window_info.has_newer
        FROM filtered_orders
        CROSS JOIN counted_orders
        CROSS JOIN window_info
        ORDER BY filtered_orders.date ${data.orderDirection}
        LIMIT $2 OFFSET $3
    `, [
        data.storeId,
        data.limit,
        data.rowOffset,
        data.dayOffset
    ])

    return result.rows
}

export async function findOrderProductForUpdate(
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

export async function findUserForOrder(
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

export async function insertOrder(
    client: PoolClient,
    data: CreateOrderData & { costPrice: number }
): Promise<OrderRow | null> {
    const result = await client.query<OrderRow>(`
        WITH inserted_order AS (
            INSERT INTO orders (
                store_id,
                product_id,
                user_id,
                cost_price,
                quantity,
                state
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        )
        SELECT
            inserted_order.id,
            inserted_order.ordered_at AS date,
            products.name AS product,
            users.name AS supplier,
            inserted_order.cost_price AS price,
            inserted_order.quantity,
            inserted_order.state
        FROM inserted_order
        JOIN products ON products.id = inserted_order.product_id
            AND products.store_id = inserted_order.store_id
        JOIN users ON users.id = inserted_order.user_id
            AND users.store_id = inserted_order.store_id
    `, [
        data.storeId,
        data.productId,
        data.userId,
        data.costPrice,
        data.quantity,
        data.state
    ])

    return result.rows[0] ?? null
}