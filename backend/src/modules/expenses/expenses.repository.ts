import pool from "../../config/db.js"
import type {
    ExpensesDayRow,
    ExpensesPeriodRow,
    ReportDayData,
    ReportPeriodData
} from "../../types/report.types.js"

export async function findExpensesByPeriod(data: ReportPeriodData): Promise<ExpensesPeriodRow[]> {
    const { storeId, offset, period } = data

    const result = await pool.query<ExpensesPeriodRow>(`
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
                FROM orders
                CROSS JOIN range_period r
                WHERE store_id = $1
                AND state = 'paid'
                AND ordered_at::date < r.start_date

                UNION ALL

                SELECT 1
                FROM staff
                CROSS JOIN range_period r
                WHERE store_id = $1
                AND state = 'paid'
                AND created_at::date < r.start_date
            ) AS has_older
        )
        SELECT
            movement.day,
            COALESCE(SUM(movement.total_orders), 0) AS total_orders,
            COALESCE(SUM(movement.total_staff), 0) AS total_staff,
            COALESCE(SUM(movement.total_orders), 0) + COALESCE(SUM(movement.total_staff), 0) AS total,
            r.start_date,
            r.end_date,
            o.has_older
        FROM (
            SELECT
                ordered_at::date AS day,
                SUM(cost_price * quantity) AS total_orders,
                0::numeric AS total_staff
            FROM orders
            CROSS JOIN range_period r
            WHERE store_id = $1
            AND state = 'paid'
            AND ordered_at::date BETWEEN r.start_date AND r.end_date
            GROUP BY ordered_at::date

            UNION ALL

            SELECT
                created_at::date AS day,
                0::numeric AS total_orders,
                SUM(salary) AS total_staff
            FROM staff
            CROSS JOIN range_period r
            WHERE store_id = $1
            AND state = 'paid'
            AND created_at::date BETWEEN r.start_date AND r.end_date
            GROUP BY created_at::date
        ) AS movement
        CROSS JOIN range_period r
        CROSS JOIN older o
        GROUP BY movement.day, r.start_date, r.end_date, o.has_older
        ORDER BY movement.day ASC;
    `, [storeId, offset, period])

    return result.rows
}

export async function findExpensesByDay(data: ReportDayData): Promise<ExpensesDayRow | null> {
    const { storeId, date } = data

    const result = await pool.query<ExpensesDayRow>(`
        SELECT
            COALESCE(SUM(total_orders), 0) AS total_orders,
            COALESCE(SUM(total_staff), 0) AS total_staff,
            COALESCE(SUM(total_orders), 0) + COALESCE(SUM(total_staff), 0) AS total
        FROM (
            SELECT
                SUM(cost_price * quantity) AS total_orders,
                0::numeric AS total_staff
            FROM orders
            WHERE store_id = $1
            AND state = 'paid'
            AND ordered_at::date = $2

            UNION ALL

            SELECT
                0::numeric AS total_orders,
                SUM(salary) AS total_staff
            FROM staff
            WHERE store_id = $1
            AND state = 'paid'
            AND created_at::date = $2
        ) AS movement;
    `, [storeId, date])

    return result.rows[0] ?? null
}