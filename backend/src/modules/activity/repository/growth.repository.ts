import pool from "../../../config/db.js"
import type { ActivityBaseData, GrowthRateRow } from "../../../types/activity.types.js"

export async function findGrowthRate(data: ActivityBaseData): Promise<GrowthRateRow | null> {
    const { storeId, offset, activityDateFilter } = data

    const result = await pool.query<GrowthRateRow>(`
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
        previous_range_date AS (
            SELECT
                CASE
                    WHEN $3 = 'month' THEN date_trunc('month', (r.start_date - INTERVAL '1 day'))::date
                    ELSE (r.start_date - 7)
                END AS start_date,
                (r.start_date - 1) AS end_date
            FROM range_date r
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
        current_period AS (
            SELECT COALESCE(SUM(s.sale_price * s.quantity), 0) AS total
            FROM sales s
            CROSS JOIN range_date r
            WHERE s.store_id = $1
            AND s.state = 'paid'
            AND s.sold_at::date BETWEEN r.start_date AND r.end_date
        ),
        previous_period AS (
            SELECT COALESCE(SUM(s.sale_price * s.quantity), 0) AS total
            FROM sales s
            CROSS JOIN previous_range_date r
            WHERE s.store_id = $1
            AND s.state = 'paid'
            AND s.sold_at::date BETWEEN r.start_date AND r.end_date
        )
        SELECT
            r.start_date,
            r.end_date,
            o.has_older,
            CASE
                WHEN pp.total = 0 AND cp.total = 0 THEN 0
                WHEN pp.total = 0 THEN 100
                ELSE ROUND(((cp.total - pp.total) / pp.total) * 100, 2)
            END AS growth_rate
        FROM range_date r
        CROSS JOIN older o
        CROSS JOIN current_period cp
        CROSS JOIN previous_period pp;
    `, [storeId, offset, activityDateFilter])

    return result.rows[0] ?? null
}