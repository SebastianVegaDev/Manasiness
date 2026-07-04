import type { MovementState } from "./movement.types.js"
import type { StoreScopedData } from "./history.types.js"

export type PendingScope = "customers" | "suppliers" | "workers" | "sales" | "orders" | "staff"

export type ResolvePendingState = Extract<MovementState, "paid" | "canceled">

export type PendingSummaryRow = {
    total_count: string | number
    total_amount: string | number
}

export type PendingSummaryItem = {
    count: number
    total: number
}

export type PendingSummary = {
    customers: PendingSummaryItem
    suppliers: PendingSummaryItem
    workers: PendingSummaryItem
    sales: PendingSummaryItem
    orders: PendingSummaryItem
    staff: PendingSummaryItem
    global: PendingSummaryItem
}

export type PendingRow = {
    id: number
    name: string
    person?: string
    customer?: string
    supplier?: string
    worker?: string
    product?: string
    amount: string | number
    date?: Date | string
    day_ago: Date | string
}

export type ResolvePendingData = StoreScopedData & {
    scope: PendingScope
    id: number
    state: ResolvePendingState
}

export type PendingRecordRow = {
    id: number
    product_id?: number
    quantity?: string | number
    state: MovementState
}
