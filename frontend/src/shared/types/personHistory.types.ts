import type { ReactNode } from "react"
import type {
    CurrencyCode,
    EntityId,
    HistorySort
} from "@shared/types/common.types"

export type PersonHistoryCell = ReactNode

export type PersonHistoryRow = PersonHistoryCell[]

export type PersonHistoryDetail = {
    id?: EntityId
    name: string
    details: PersonHistoryRow[]
    windowLabel: string
    hasOlder: boolean
    hasNewer: boolean
}

export type PersonHistoryApiParams = {
    sort?: HistorySort | string
    page?: number
    offset?: number
    period?: "day" | string
    limit?: number
}

export type PersonHistoryApiResponse = {
    id?: EntityId
    name?: string
    rows?: unknown[]
    data?: unknown[]
    details?: unknown[]
    records?: unknown[]
    history?: unknown[]
    total_rows?: number | string
    totalRows?: number | string
    total_pages?: number | string
    totalPages?: number | string
    start_date?: string | null
    startDate?: string | null
    end_date?: string | null
    endDate?: string | null
    has_older?: boolean
    hasOlder?: boolean
    has_newer?: boolean
    hasNewer?: boolean
    [key: string]: unknown
}

export type PersonHistoryMapper = (
    response: PersonHistoryApiResponse,
    currencyCode: CurrencyCode | string
) => PersonHistoryDetail

export type PersonHistoryTotalPageMapper = (
    response: PersonHistoryApiResponse
) => number

export type PersonHistorySortChangeEvent = {
    target: {
        value: string
    }
}

export type PersonHistoryScreenProps = {
    title: string
    name: string
    rows: PersonHistoryRow[]
    columns: string[]
    sectionTitle: string
    sortValue: HistorySort | string
    onSortChange: (event: PersonHistorySortChangeEvent) => void
    windowLabel?: string
    hasOlder?: boolean
    hasNewer?: boolean
    onOlder?: () => void
    onNewer?: () => void
    currentPage: number
    totalPage: number
    onPrevPage?: () => void
    onNextPage?: () => void
    isLoading?: boolean
    emptyMessage?: string
}
