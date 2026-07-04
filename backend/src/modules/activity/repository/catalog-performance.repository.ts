import pool from "../../../config/db.js"
import type { ActivityCatalogData, CatalogPerformanceRow } from "../../../types/activity.types.js"

export async function findCatalogPerformance(data: ActivityCatalogData): Promise<CatalogPerformanceRow | null> {
    const { storeId, offset, activityDateFilter, catalogOption } = data

    const result = await pool.query<CatalogPerformanceRow>(`
        WITH base AS (
            SELECT
                CASE
                    WHEN $3 = 'month' THEN (date_trunc('month', CURRENT_DATE)::date - 1)
                    ELSE (date_trunc('week', CURRENT_DATE)::date - 1)
                END AS base_end
        ),
        range_date AS (
            SELECT
                CASE
                    WHEN $3 = 'month' THEN date_trunc('month', (base_end - ($2::int * INTERVAL '1 month')))::date
                    ELSE (base_end - ($2::int * 7) - 6)
                END AS start_date,
                CASE
                    WHEN $3 = 'month' THEN (date_trunc('month', (base_end - ($2::int * INTERVAL '1 month'))) + INTERVAL '1 month' - INTERVAL '1 day')::date
                    ELSE (base_end - ($2::int * 7))
                END AS end_date
            FROM base
        ),
        older AS (
            SELECT EXISTS (
                SELECT 1
                FROM sales
                CROSS JOIN range_date r
                WHERE store_id = $1
                AND state = 'paid'
                AND sold_at::date < r.start_date
            ) AS has_older
        ),
        product_sales AS (
            SELECT
                p.id,
                p.name,
                p.image,
                SUM(s.quantity) AS total_quantity
            FROM sales s
            INNER JOIN products p
                ON p.id = s.product_id
                AND p.store_id = s.store_id
            CROSS JOIN range_date r
            WHERE s.store_id = $1
            AND s.state = 'paid'
            AND s.sold_at::date BETWEEN r.start_date AND r.end_date
            GROUP BY p.id, p.name, p.image
        ),
        category_sales AS (
            SELECT
                c.id,
                c.name,
                c.image,
                SUM(s.quantity) AS total_quantity
            FROM sales s
            INNER JOIN products p
                ON p.id = s.product_id
                AND p.store_id = s.store_id
            INNER JOIN categories c
                ON c.id = p.category_id
                AND c.store_id = p.store_id
            CROSS JOIN range_date r
            WHERE s.store_id = $1
            AND s.state = 'paid'
            AND s.sold_at::date BETWEEN r.start_date AND r.end_date
            GROUP BY c.id, c.name, c.image
        ),
        selected_product AS (
            SELECT
                id,
                name,
                image,
                total_quantity
            FROM product_sales
            ORDER BY
                CASE WHEN $4 = 'leastSold' THEN total_quantity END ASC,
                CASE WHEN $4 = 'topSold' THEN total_quantity END DESC,
                id ASC
            LIMIT 1
        ),
        selected_category AS (
            SELECT
                id,
                name,
                image,
                total_quantity
            FROM category_sales
            ORDER BY
                CASE WHEN $4 = 'leastSold' THEN total_quantity END ASC,
                CASE WHEN $4 = 'topSold' THEN total_quantity END DESC,
                id ASC
            LIMIT 1
        )
        SELECT
            r.start_date,
            r.end_date,
            o.has_older,
            (SELECT id FROM selected_product) AS product_id,
            (SELECT name FROM selected_product) AS product_name,
            (SELECT image FROM selected_product) AS product_image,
            (SELECT total_quantity FROM selected_product) AS product_total_quantity,
            (SELECT id FROM selected_category) AS category_id,
            (SELECT name FROM selected_category) AS category_name,
            (SELECT image FROM selected_category) AS category_image,
            (SELECT total_quantity FROM selected_category) AS category_total_quantity
        FROM range_date r
        CROSS JOIN older o;
    `, [storeId, offset, activityDateFilter, catalogOption])

    return result.rows[0] ?? null
}