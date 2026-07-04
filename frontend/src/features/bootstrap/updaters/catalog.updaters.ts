import {
    removeById,
    safeBootstrapData,
    upsertActiveOption,
    upsertById
} from "./shared/bootstrapUpdater.utils"

import type {
    BootstrapCatalogItem,
    BootstrapData
} from "../shared/types/bootstrap.types"
import type { EntityId } from "@shared/types/common.types"

export function upsertBootstrapCategory(
    currentData: BootstrapData | null,
    category: BootstrapCatalogItem | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!category?.id) {
        return data
    }

    return {
        ...data,
        options: {
            ...data.options,
            categories: upsertActiveOption(data.options?.categories, category)
        },
        catalog: {
            ...data.catalog,
            categories: upsertById(data.catalog?.categories, category)
        }
    }
}

export function removeBootstrapCategory(
    currentData: BootstrapData | null,
    categoryId: EntityId
): BootstrapData {
    const data = safeBootstrapData(currentData)

    return {
        ...data,
        options: {
            ...data.options,
            categories: removeById(data.options?.categories, categoryId)
        },
        catalog: {
            ...data.catalog,
            categories: removeById(data.catalog?.categories, categoryId)
        }
    }
}

export function upsertBootstrapProduct(
    currentData: BootstrapData | null,
    product: BootstrapCatalogItem | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!product?.id) {
        return data
    }

    return {
        ...data,
        options: {
            ...data.options,
            products: upsertActiveOption(data.options?.products, product)
        },
        catalog: {
            ...data.catalog,
            products: upsertById(data.catalog?.products, product)
        }
    }
}

export function removeBootstrapProduct(
    currentData: BootstrapData | null,
    productId: EntityId
): BootstrapData {
    const data = safeBootstrapData(currentData)

    return {
        ...data,
        options: {
            ...data.options,
            products: removeById(data.options?.products, productId)
        },
        catalog: {
            ...data.catalog,
            products: removeById(data.catalog?.products, productId)
        }
    }
}





