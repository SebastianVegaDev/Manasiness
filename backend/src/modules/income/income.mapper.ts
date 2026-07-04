import type { IncomeDayRow, IncomePeriodRow } from "../../types/report.types.js"

export function mapIncomePeriod(rows: IncomePeriodRow[]): IncomePeriodRow[] {
    return rows
}

export function mapIncomeDay(row: IncomeDayRow | null): IncomeDayRow {
    return {
        total_sold: Number(row?.total_sold ?? 0),
        total_spent: Number(row?.total_spent ?? 0),
        net_income: Number(row?.net_income ?? 0)
    }
}