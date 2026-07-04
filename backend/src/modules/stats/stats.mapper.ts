import type { StatsSummary, StatsSummaryRow } from "../../types/stats.types.js"

export function mapStatsSummary(row: StatsSummaryRow | null): StatsSummary {
    return {
        dayTotal: Number(row?.day_total ?? 0),
        dayCount: Number(row?.day_count ?? 0),
        weekTotal: Number(row?.week_total ?? 0),
        weekCount: Number(row?.week_count ?? 0),
        monthTotal: Number(row?.month_total ?? 0),
        monthCount: Number(row?.month_count ?? 0)
    }
}