import type { StatusFilter, UserRoleFilter } from "../shared/validators/filters.validators.js"
import type { HistoryWindowQuery, StoreScopedData } from "./history.types.js"

export type UserRole = "customer" | "supplier" | "worker"

export type PeopleFilterData = StoreScopedData & {
    search: string
    status: StatusFilter
}

export type UsersFilterData = PeopleFilterData & {
    role: UserRoleFilter
}

export type UserRow = {
    id: number
    name: string
    image: string | null
    phone: string | null
    role: UserRole
    is_default?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    is_active: boolean
}

export type UserOptionRow = {
    id: number
    name: string
    is_default: boolean
}

export type UserPayload = {
    name: string
    image: string
    phone: string
    role: UserRole
}

export type UserMutationData = StoreScopedData & UserPayload

export type UserUpdateData = UserMutationData & {
    id: number
}

export type UserStatusData = StoreScopedData & {
    id: number
    isActive: boolean
}

export type PersonBaseRow = {
    id: number
    name: string
}

export type PersonHistoryRow = {
    id: number
    date: Date | string
    product?: string
    price?: string | number
    quantity?: string | number
    salary?: string | number
    state: string
}

export type PersonDetailData = HistoryWindowQuery