import type { EntityId, EntityStatus } from "@shared/types/common.types"
import type { FormValues, SelectOption } from "@shared/types/form.types"

export type CatalogStatus = EntityStatus | string

export type Category = {
    id: EntityId
    name: string
    image?: string | null
    status?: CatalogStatus
    is_active?: boolean
    isActive?: boolean
    product_count?: number | string
    products_count?: number | string
    total_products?: number | string
    created_at?: string
    updated_at?: string
    [key: string]: unknown
}

export type Product = {
    id: EntityId
    name: string
    image?: string | null
    status?: CatalogStatus
    is_active?: boolean
    isActive?: boolean

    category_id?: EntityId
    categoryId?: EntityId
    category_name?: string
    categoryName?: string
    category?: Category | null

    cost_price?: number | string
    costPrice?: number | string
    sale_price?: number | string
    salePrice?: number | string
    stock?: number | string

    created_at?: string
    updated_at?: string
    [key: string]: unknown
}

export type CatalogCardItem = {
    id: EntityId
    name: string
    image: string
    status?: string
    details: string[]
}

export type CatalogListParams = {
    search?: string
    status?: string
    categoryId?: EntityId
    category_id?: EntityId
}

export type CategoryCreatePayload = {
    name: string
    image?: string | null
    status?: CatalogStatus
}

export type CategoryUpdatePayload = {
    name: string
    image?: string | null
    status?: CatalogStatus
}

export type ProductCreatePayload = {
    name: string
    category_id: EntityId
    cost_price: number
    sale_price: number
    stock: number
    image?: string | null
    status?: CatalogStatus
}

export type ProductUpdatePayload = ProductCreatePayload

export type CategoryFormValues = FormValues & {
    name: string
    image: string
    status: string
}

export type ProductFormValues = FormValues & {
    name: string
    category_id: string
    cost_price: string | number
    sale_price: string | number
    stock: string | number
    image: string
    status: string
}

export type CatalogOptions = {
    categoryOptions?: SelectOption[]
}





