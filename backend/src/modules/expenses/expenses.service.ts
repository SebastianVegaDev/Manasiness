import type { ReportDayData, ReportPeriodData } from "../../types/report.types.js"
import { mapExpensesDay, mapExpensesPeriod } from "./expenses.mapper.js"
import { findExpensesByDay, findExpensesByPeriod } from "./expenses.repository.js"

export async function getExpensesByPeriod(data: ReportPeriodData) {
    return mapExpensesPeriod(await findExpensesByPeriod(data))
}

export async function getExpensesByDay(data: ReportDayData) {
    return mapExpensesDay(await findExpensesByDay(data))
}