import type { CatalogOption, PeriodFilter } from "../shared/validators/filters.validators.js"
import type { StoreScopedData } from "./history.types.js"

export type ActivityBaseData = StoreScopedData & {
    offset: number
    activityDateFilter: PeriodFilter
}

export type ActivityCatalogData = ActivityBaseData & {
    catalogOption: CatalogOption
}

export type GrowthRateRow = {
    start_date: Date | string
    end_date: Date | string
    has_older: boolean
    growth_rate: string | number
}

export type DayPerformanceRow = {
    start_date: Date | string
    end_date: Date | string
    has_older: boolean
    best_day_date: Date | string | null
    best_day_total: string | number | null
    worst_day_date: Date | string | null
    worst_day_total: string | number | null
}

export type CatalogPerformanceRow = {
    start_date: Date | string
    end_date: Date | string
    has_older: boolean
    product_id: number | null
    product_name: string | null
    product_image: string | null
    product_total_quantity: string | number | null
    category_id: number | null
    category_name: string | null
    category_image: string | null
    category_total_quantity: string | number | null
}