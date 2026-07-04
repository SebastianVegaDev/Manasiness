import type {
    CatalogCardItem,
    Category,
    CategoryFormValues,
    CategoryUpdatePayload
} from "../../shared/types/catalog.types"
import type { FormValues, SelectOption } from "@shared/types/form.types"

const FALLBACK_IMAGE = "https://i.postimg.cc/KYydTs9w/noimage.png"

function getCategoryStatus(category: Category): string {
    if (typeof category.status === "string") {
        return category.status
    }

    if (typeof category.is_active === "boolean") {
        return category.is_active ? "active" : "inactive"
    }

    if (typeof category.isActive === "boolean") {
        return category.isActive ? "active" : "inactive"
    }

    return "active"
}

function getProductCount(category: Category): number {
    return Number(
        category.product_count ??
        category.products_count ??
        category.total_products ??
        0
    )
}

export function mapCategoriesToCards(categories: Category[] | null | undefined): CatalogCardItem[] {
    const safeCategories = Array.isArray(categories) ? categories : []

    return safeCategories.map((category) => {
        const productCount = getProductCount(category)

        return {
            id: category.id,
            name: category.name,
            image: category.image || FALLBACK_IMAGE,
            status: getCategoryStatus(category),
            details: [
                `Products: ${productCount}`
            ]
        }
    })
}

export function mapCategoryOptions(categories: Category[] | null | undefined): SelectOption[] {
    const safeCategories = Array.isArray(categories) ? categories : []

    return safeCategories
        .filter((category) => getCategoryStatus(category) === "active")
        .map((category) => ({
            value: String(category.id),
            label: category.name
        }))
}

export function mapCategoryToFormValues(category: Category | null | undefined): CategoryFormValues {
    return {
        name: category?.name ?? "",
        image: category?.image ?? "",
        status: category ? getCategoryStatus(category) : "active"
    }
}

export function mapCategoryUpdatePayload(formData: FormValues): CategoryUpdatePayload {
    return {
        name: String(formData.name ?? ""),
        image: formData.image ? String(formData.image) : null,
        status: String(formData.status ?? "active")
    }
}




