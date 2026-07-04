import pool from "../../../config/db.js"
import type { StoreScopedData } from "../../../types/history.types.js"
import type { StatsSummaryRow } from "../../../types/stats.types.js"

export async function findSalesStatsSummary(data: StoreScopedData): Promise<StatsSummaryRow | null> {
    const result = await pool.query<StatsSummaryRow>(`
        SELECT
            COALESCE(SUM(sale_price * quantity) FILTER (
                WHERE sold_at::date = CURRENT_DATE
            ), 0) AS day_total,
            COUNT(*) FILTER (
                WHERE sold_at::date = CURRENT_DATE
            ) AS day_count,

            COALESCE(SUM(sale_price * quantity) FILTER (
                WHERE sold_at >= date_trunc('week', CURRENT_DATE)
            ), 0) AS week_total,
            COUNT(*) FILTER (
                WHERE sold_at >= date_trunc('week', CURRENT_DATE)
            ) AS week_count,

            COALESCE(SUM(sale_price * quantity) FILTER (
                WHERE sold_at >= date_trunc('month', CURRENT_DATE)
            ), 0) AS month_total,
            COUNT(*) FILTER (
                WHERE sold_at >= date_trunc('month', CURRENT_DATE)
            ) AS month_count
        FROM sales
        WHERE store_id = $1
        AND state = 'paid'
    `, [data.storeId])

    return result.rows[0] ?? null
}