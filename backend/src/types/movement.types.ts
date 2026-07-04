import type { HistorySort, SortDirection } from "../shared/validators/query.validators.js"
import type { StoreScopedData } from "./history.types.js"
import type { UserRole } from "./person.types.js"

export type MovementState = "paid" | "pending" | "canceled"

export type MovementWindowData = StoreScopedData & {
    page: number
    sort: HistorySort
    period: "day"
    limit: number
    dayOffset: number
    rowOffset: number
    orderDirection: SortDirection
}

export type MovementWindowRow = {
    total_rows?: string | number
    start_date?: Date | string | null
    end_date?: Date | string | null
    has_older?: boolean
    has_newer?: boolean
}

export type ProductMovementLookupRow = {
    id: number
    name: string
    cost_price: string | number
    sale_price: string | number
    stock: string | number
    is_active: boolean
}

export type UserMovementLookupRow = {
    id: number
    name: string
    role: UserRole
    is_default: boolean
    is_active: boolean
}

export type SaleRow = MovementWindowRow & {
    id: number
    date: Date | string
    product: string
    customer: string
    price: string | number
    quantity: string | number
    state: MovementState
}

export type OrderRow = MovementWindowRow & {
    id: number
    date: Date | string
    product: string
    supplier: string
    price: string | number
    quantity: string | number
    state: MovementState
}

export type StaffRow = MovementWindowRow & {
    id: number
    date: Date | string
    worker: string
    salary: string | number
    state: MovementState
}

export type SalePayload = {
    productId: number
    userId: number
    quantity: number
    state: MovementState
}

export type OrderPayload = {
    productId: number
    userId: number
    quantity: number
    state: MovementState
}

export type StaffPayload = {
    userId: number
    salary: number
    state: MovementState
}

export type CreateSaleData = StoreScopedData & SalePayload

export type CreateOrderData = StoreScopedData & OrderPayload

export type CreateStaffData = StoreScopedData & StaffPayload