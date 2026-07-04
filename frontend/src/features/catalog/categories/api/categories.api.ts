import { apiGet, apiPatch, apiPost, apiPut } from "@shared/api/client"

import type {
    CatalogListParams,
    Category,
    CategoryCreatePayload,
    CategoryUpdatePayload
} from "../../shared/types/catalog.types"
import type { EntityId } from "@shared/types/common.types"
import type { QueryParamValue } from "@shared/types/api.types"

type CategoryListResponse =
    | Category[]
    | {
        rows?: Category[]
        data?: Category[]
        categories?: Category[]
    }

type CategoryResponse =
    | Category
    | {
        data?: Category
        category?: Category
    }

function toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function sanitizeParams(params: CatalogListParams = {}): Record<string, QueryParamValue> {
    const sanitizedParams: Record<string, QueryParamValue> = {}

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
            sanitizedParams[key] = value
        }
    }

    return sanitizedParams
}

function unwrapCategoryList(response: CategoryListResponse): Category[] {
    if (Array.isArray(response)) {
        return response
    }

    const responseRecord = toRecord(response)

    if (Array.isArray(responseRecord.rows)) {
        return responseRecord.rows as Category[]
    }

    if (Array.isArray(responseRecord.data)) {
        return responseRecord.data as Category[]
    }

    if (Array.isArray(responseRecord.categories)) {
        return responseRecord.categories as Category[]
    }

    return []
}

function unwrapCategory(response: CategoryResponse): Category {
    const responseRecord = toRecord(response)

    return (
        (responseRecord.category as Category | undefined) ??
        (responseRecord.data as Category | undefined) ??
        response as Category
    )
}

export async function getCategories(params: CatalogListParams = {}): Promise<Category[]> {
    const response = await apiGet<CategoryListResponse>("/categories", {
        params: sanitizeParams(params)
    })

    return unwrapCategoryList(response)
}

export async function getCategoryById(id: EntityId): Promise<Category> {
    const response = await apiGet<CategoryResponse>(`/categories/${id}`)
    return unwrapCategory(response)
}

export async function createCategory(payload: CategoryCreatePayload): Promise<Category> {
    const response = await apiPost<CategoryResponse, CategoryCreatePayload>("/categories", payload)
    return unwrapCategory(response)
}

export async function updateCategory(id: EntityId, payload: CategoryUpdatePayload): Promise<Category> {
    const response = await apiPut<CategoryResponse, CategoryUpdatePayload>(`/categories/${id}`, payload)
    return unwrapCategory(response)
}

export async function deactivateCategory(id: EntityId): Promise<Category> {
    const response = await apiPatch<CategoryResponse>(`/categories/${id}/deactivate`)
    return unwrapCategory(response)
}

export async function activateCategory(id: EntityId): Promise<Category> {
    const response = await apiPatch<CategoryResponse>(`/categories/${id}/activate`)
    return unwrapCategory(response)
}



