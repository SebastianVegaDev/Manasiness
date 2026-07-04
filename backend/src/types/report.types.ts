import type { PeriodFilter } from "../shared/validators/filters.validators.js"
import type { StoreScopedData } from "./history.types.js"

export type ReportPeriodData = StoreScopedData & {
    offset: number
    period: PeriodFilter
}

export type ReportDayData = StoreScopedData & {
    date: string
    period: PeriodFilter
}

export type IncomePeriodRow = {
    day: Date | string
    total: string | number
    start_date: Date | string
    end_date: Date | string
    has_older: boolean
}

export type IncomeDayRow = {
    total_sold: string | number
    total_spent: string | number
    net_income: string | number
}

export type ExpensesPeriodRow = {
    day: Date | string
    total_orders: string | number
    total_staff: string | number
    total: string | number
    start_date: Date | string
    end_date: Date | string
    has_older: boolean
}

export type ExpensesDayRow = {
    total_orders: string | number
    total_staff: string | number
    total: string | number
}