import pool from "../../config/db.js"
import type {
    IncomeDayRow,
    IncomePeriodRow,
    ReportDayData,
    ReportPeriodData
} from "../../types/report.types.js"

export async function findIncomeByPeriod(data: ReportPeriodData): Promise<IncomePeriodRow[]> {
    const { storeId, offset, period } = data

    const result = await pool.query<IncomePeriodRow>(`
        WITH base AS (
            SELECT
                CASE
                    WHEN $3 = 'month' THEN (date_trunc('month', CURRENT_DATE)::date - 1)
                    ELSE (date_trunc('week', CURRENT_DATE)::date - 1)
                END AS base_end
        ),
        range_period AS (
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
                CROSS JOIN range_period r
                WHERE store_id = $1
                AND state = 'paid'
                AND sold_at::date < r.start_date

                UNION ALL

                SELECT 1
                FROM orders
                CROSS JOIN range_period r
                WHERE store_id = $1
                AND state = 'paid'
                AND ordered_at::date < r.start_date
            ) AS has_older
        )
        SELECT
            movement.day,
            COALESCE(SUM(movement.total_sold), 0) - COALESCE(SUM(movement.total_spent), 0) AS total,
            r.start_date,
            r.end_date,
            o.has_older
        FROM (
            SELECT
                sold_at::date AS day,
                SUM(sale_price * quantity) AS total_sold,
                0::numeric AS total_spent
            FROM sales
            CROSS JOIN range_period r
            WHERE store_id = $1
            AND state = 'paid'
            AND sold_at::date BETWEEN r.start_date AND r.end_date
            GROUP BY sold_at::date

            UNION ALL

            SELECT
                ordered_at::date AS day,
                0::numeric AS total_sold,
                SUM(cost_price * quantity) AS total_spent
            FROM orders
            CROSS JOIN range_period r
            WHERE store_id = $1
            AND state = 'paid'
            AND ordered_at::date BETWEEN r.start_date AND r.end_date
            GROUP BY ordered_at::date
        ) AS movement
        CROSS JOIN range_period r
        CROSS JOIN older o
        GROUP BY movement.day, r.start_date, r.end_date, o.has_older
        ORDER BY movement.day ASC;
    `, [storeId, offset, period])

    return result.rows
}

export async function findIncomeByDay(data: ReportDayData): Promise<IncomeDayRow | null> {
    const { storeId, date } = data

    const result = await pool.query<IncomeDayRow>(`
        SELECT
            COALESCE(SUM(total_sold), 0) AS total_sold,
            COALESCE(SUM(total_spent), 0) AS total_spent,
            COALESCE(SUM(total_sold), 0) - COALESCE(SUM(total_spent), 0) AS net_income
        FROM (
            SELECT
                SUM(sale_price * quantity) AS total_sold,
                0::numeric AS total_spent
            FROM sales
            WHERE store_id = $1
            AND state = 'paid'
            AND sold_at::date = $2

            UNION ALL

            SELECT
                0::numeric AS total_sold,
                SUM(cost_price * quantity) AS total_spent
            FROM orders
            WHERE store_id = $1
            AND state = 'paid'
            AND ordered_at::date = $2
        ) AS movement;
    `, [storeId, date])

    return result.rows[0] ?? null
}