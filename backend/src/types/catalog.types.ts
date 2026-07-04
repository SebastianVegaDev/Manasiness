import type { StatusFilter } from "../shared/validators/filters.validators.js"
import type { IdScopedData, StoreScopedData } from "./history.types.js"

export type CatalogFilterData = StoreScopedData & {
    search: string
    status: StatusFilter
}

export type CategoryRow = {
    id: number
    name: string
    image: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_active: boolean
}

export type CategoryOptionRow = {
    id: number
    name: string
}

export type CategoryPayload = {
    name: string
    image: string
}

export type CategoryMutationData = StoreScopedData & CategoryPayload

export type CategoryUpdateData = IdScopedData & CategoryPayload

export type CategoryStatusData = IdScopedData & {
    isActive: boolean
}

export type ProductFilterData = CatalogFilterData & {
    categoryId: number | null
}

export type ProductRow = {
    id: number
    category_id?: number
    name: string
    image: string | null
    cost_price: string | number
    sale_price: string | number
    stock: string | number
    category?: string
    created_at?: Date | string
    updated_at?: Date | string
    is_active: boolean
}

export type ProductOptionRow = {
    id: number
    name: string
}

export type ProductPayload = {
    categoryId: number
    name: string
    image: string
    costPrice: number
    salePrice: number
    stock: number
}

export type ProductMutationData = StoreScopedData & ProductPayload

export type ProductUpdateData = IdScopedData & ProductPayload

export type ProductStatusData = IdScopedData & {
    isActive: boolean
}