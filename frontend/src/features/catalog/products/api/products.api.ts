import { apiGet, apiPatch, apiPost, apiPut } from "@shared/api/client"

import type {
    CatalogListParams,
    Product,
    ProductCreatePayload,
    ProductUpdatePayload
} from "../../shared/types/catalog.types"
import type { EntityId } from "@shared/types/common.types"
import type { QueryParamValue } from "@shared/types/api.types"

type ProductListResponse =
    | Product[]
    | {
        rows?: Product[]
        data?: Product[]
        products?: Product[]
    }

type ProductResponse =
    | Product
    | {
        data?: Product
        product?: Product
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

function unwrapProductList(response: ProductListResponse): Product[] {
    if (Array.isArray(response)) {
        return response
    }

    const responseRecord = toRecord(response)

    if (Array.isArray(responseRecord.rows)) {
        return responseRecord.rows as Product[]
    }

    if (Array.isArray(responseRecord.data)) {
        return responseRecord.data as Product[]
    }

    if (Array.isArray(responseRecord.products)) {
        return responseRecord.products as Product[]
    }

    return []
}

function unwrapProduct(response: ProductResponse): Product {
    const responseRecord = toRecord(response)

    return (
        (responseRecord.product as Product | undefined) ??
        (responseRecord.data as Product | undefined) ??
        response as Product
    )
}

export async function getProducts(params: CatalogListParams = {}): Promise<Product[]> {
    const response = await apiGet<ProductListResponse>("/products", {
        params: sanitizeParams(params)
    })

    return unwrapProductList(response)
}

export async function getProductById(id: EntityId): Promise<Product> {
    const response = await apiGet<ProductResponse>(`/products/${id}`)
    return unwrapProduct(response)
}

export async function createProduct(payload: ProductCreatePayload): Promise<Product> {
    const response = await apiPost<ProductResponse, ProductCreatePayload>("/products", payload)
    return unwrapProduct(response)
}

export async function updateProduct(id: EntityId, payload: ProductUpdatePayload): Promise<Product> {
    const response = await apiPut<ProductResponse, ProductUpdatePayload>(`/products/${id}`, payload)
    return unwrapProduct(response)
}

export async function deactivateProduct(id: EntityId): Promise<Product> {
    const response = await apiPatch<ProductResponse>(`/products/${id}/deactivate`)
    return unwrapProduct(response)
}

export async function activateProduct(id: EntityId): Promise<Product> {
    const response = await apiPatch<ProductResponse>(`/products/${id}/activate`)
    return unwrapProduct(response)
}



