import type { ReactNode } from "react"
import type { EntityId, HistorySort } from "@shared/types/common.types"

export type TableHistoryRow = {
    id: EntityId
    [key: string]: unknown
}

export type TableHistoryColumn = {
    key: string
    label: string
    align?: "left" | "center" | "right"
    render?: (row: TableHistoryRow) => ReactNode
}

export type TableHistorySortChangeEvent = {
    target: {
        value: string
    }
}

export type TableHistoryScreenProps = {
    title: string
    subtitle?: string
    rows: TableHistoryRow[]
    columns?: TableHistoryColumn[]
    sortValue: HistorySort | string
    onSortChange: (event: TableHistorySortChangeEvent) => void
    windowLabel?: string
    hasOlder?: boolean
    hasNewer?: boolean
    onOlder?: () => void
    onNewer?: () => void
    page?: number
    totalPage?: number
    onPrevPage?: () => void
    onNextPage?: () => void
    onRegisterClick?: () => void
    emptyMessage?: string
    isLoading?: boolean
}
