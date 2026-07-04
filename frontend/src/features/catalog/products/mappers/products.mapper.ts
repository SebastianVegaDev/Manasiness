import { formatCurrency } from "@shared/utils/currency"

import type {
    CatalogCardItem,
    Product,
    ProductFormValues,
    ProductUpdatePayload
} from "../../shared/types/catalog.types"
import type { CurrencyCode, EntityId } from "@shared/types/common.types"
import type { FormValues } from "@shared/types/form.types"

const FALLBACK_IMAGE = "https://i.postimg.cc/KYydTs9w/noimage.png"

function toNumber(value: unknown): number {
    const numberValue = Number(value ?? 0)
    return Number.isFinite(numberValue) ? numberValue : 0
}

function getProductStatus(product: Product): string {
    if (typeof product.status === "string") {
        return product.status
    }

    if (typeof product.is_active === "boolean") {
        return product.is_active ? "active" : "inactive"
    }

    if (typeof product.isActive === "boolean") {
        return product.isActive ? "active" : "inactive"
    }

    return "active"
}

function getCategoryName(product: Product): string {
    return (
        product.category_name ??
        product.categoryName ??
        product.category?.name ??
        "No category"
    )
}

function getCategoryId(product: Product): EntityId | "" {
    return (
        product.category_id ??
        product.categoryId ??
        product.category?.id ??
        ""
    )
}

function getCostPrice(product: Product): number {
    return toNumber(product.cost_price ?? product.costPrice)
}

function getSalePrice(product: Product): number {
    return toNumber(product.sale_price ?? product.salePrice)
}

export function mapProductsToCards(
    products: Product[] | null | undefined,
    currencyCode: CurrencyCode | string = "PEN"
): CatalogCardItem[] {
    const safeProducts = Array.isArray(products) ? products : []

    return safeProducts.map((product) => {
        const stock = toNumber(product.stock)
        const salePrice = getSalePrice(product)

        return {
            id: product.id,
            name: product.name,
            image: product.image || FALLBACK_IMAGE,
            status: getProductStatus(product),
            details: [
                `Category: ${getCategoryName(product)}`,
                `Sale price: ${formatCurrency(salePrice, currencyCode)}`,
                `Stock: ${stock}`
            ]
        }
    })
}

export function mapProductToFormValues(product: Product | null | undefined): ProductFormValues {
    return {
        name: product?.name ?? "",
        category_id: String(product ? getCategoryId(product) : ""),
        cost_price: product ? getCostPrice(product) : "",
        sale_price: product ? getSalePrice(product) : "",
        stock: product?.stock ?? "",
        image: product?.image ?? "",
        status: product ? getProductStatus(product) : "active"
    }
}

export function mapProductUpdatePayload(formData: FormValues): ProductUpdatePayload {
    return {
        name: String(formData.name ?? ""),
        category_id: String(formData.category_id ?? ""),
        cost_price: toNumber(formData.cost_price),
        sale_price: toNumber(formData.sale_price),
        stock: toNumber(formData.stock),
        image: formData.image ? String(formData.image) : null,
        status: String(formData.status ?? "active")
    }
}





export function mapProductOptions(products: Product[] | null | undefined) {
    const safeProducts = Array.isArray(products) ? products : []

    return safeProducts
        .filter((product) => getProductStatus(product) === "active")
        .map((product) => ({
            value: String(product.id),
            label: product.name
        }))
}
