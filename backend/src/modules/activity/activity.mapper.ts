import type {
    CatalogPerformanceRow,
    DayPerformanceRow,
    GrowthRateRow
} from "../../types/activity.types.js"

export function mapGrowthRate(row: GrowthRateRow | null): GrowthRateRow | null {
    return row
}

export function mapDayPerformance(row: DayPerformanceRow | null): DayPerformanceRow | null {
    return row
}

export function mapCatalogPerformance(row: CatalogPerformanceRow | null): CatalogPerformanceRow | null {
    return row
}