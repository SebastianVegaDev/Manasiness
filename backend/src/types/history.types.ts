import type { SortDirection } from "../shared/validators/query.validators.js"

export type StoreScopedData = {
    storeId: number
}

export type IdScopedData = StoreScopedData & {
    id: number
}

export type HistoryWindowQuery = IdScopedData & {
    orderDirection: SortDirection
    limit: number
    rowOffset: number
    dayOffset: number
    period: "day"
}

export type TotalRowsRow = {
    total_rows: string | number
}

export type WindowInfoRow = {
    start_date: Date | string | null
    end_date: Date | string | null
    has_older: boolean
    has_newer: boolean
}