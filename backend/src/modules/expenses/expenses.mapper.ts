import type { ExpensesDayRow, ExpensesPeriodRow } from "../../types/report.types.js"

export function mapExpensesPeriod(rows: ExpensesPeriodRow[]): ExpensesPeriodRow[] {
    return rows
}

export function mapExpensesDay(row: ExpensesDayRow | null): ExpensesDayRow {
    return {
        total_orders: Number(row?.total_orders ?? 0),
        total_staff: Number(row?.total_staff ?? 0),
        total: Number(row?.total ?? 0)
    }
}