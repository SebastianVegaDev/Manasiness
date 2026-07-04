import type { ReportDayData, ReportPeriodData } from "../../types/report.types.js"
import { mapIncomeDay, mapIncomePeriod } from "./income.mapper.js"
import { findIncomeByDay, findIncomeByPeriod } from "./income.repository.js"

export async function getIncomeByPeriod(data: ReportPeriodData) {
    return mapIncomePeriod(await findIncomeByPeriod(data))
}

export async function getIncomeByDay(data: ReportDayData) {
    return mapIncomeDay(await findIncomeByDay(data))
}