import type { EntityId, EntityStatus, UserRole } from "@shared/types/common.types"
import type { FormValues } from "@shared/types/form.types"

export type PeopleStatus = EntityStatus | string
export type PeopleRole = UserRole | string

export type Person = {
    id: EntityId
    name: string
    email?: string
    phone?: string | null
    image?: string | null
    role?: PeopleRole
    status?: PeopleStatus
    is_active?: boolean
    isActive?: boolean
    total_sales?: number | string
    total_orders?: number | string
    total_staff_payments?: number | string
    movements_count?: number | string
    created_at?: string
    updated_at?: string
    [key: string]: unknown
}

export type User = Person

export type PeopleCardItem = {
    id: EntityId
    name: string
    image: string
    status?: string
    details: string[]
}

export type PeopleListParams = {
    search?: string
    status?: string
    role?: string
}

export type UserCreatePayload = {
    name: string
    email: string
    phone?: string | null
    role: PeopleRole
    image?: string | null
    status?: PeopleStatus
}

export type UserUpdatePayload = UserCreatePayload

export type UserFormValues = FormValues & {
    name: string
    email: string
    phone: string
    role: string
    image: string
    status: string
}




