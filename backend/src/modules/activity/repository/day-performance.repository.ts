import pool from "../../../config/db.js"
import type { ActivityBaseData, DayPerformanceRow } from "../../../types/activity.types.js"

export async function findDayPerformance(data: ActivityBaseData): Promise<DayPerformanceRow | null> {
    const { storeId, offset, activityDateFilter } = data

    const result = await pool.query<DayPerformanceRow>(`
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
        sales_by_day AS (
            SELECT
                s.sold_at::date AS day,
                SUM(s.sale_price * s.quantity) AS total
            FROM sales s
            CROSS JOIN range_date r
            WHERE s.store_id = $1
            AND s.state = 'paid'
            AND s.sold_at::date BETWEEN r.start_date AND r.end_date
            GROUP BY s.sold_at::date
        ),
        best_day AS (
            SELECT day, total
            FROM sales_by_day
            ORDER BY total DESC, day ASC
            LIMIT 1
        ),
        worst_day AS (
            SELECT day, total
            FROM sales_by_day
            ORDER BY total ASC, day ASC
            LIMIT 1
        )
        SELECT
            r.start_date,
            r.end_date,
            o.has_older,
            (SELECT day FROM best_day) AS best_day_date,
            (SELECT total FROM best_day) AS best_day_total,
            (SELECT day FROM worst_day) AS worst_day_date,
            (SELECT total FROM worst_day) AS worst_day_total
        FROM range_date r
        CROSS JOIN older o;
    `, [storeId, offset, activityDateFilter])

    return result.rows[0] ?? null
}