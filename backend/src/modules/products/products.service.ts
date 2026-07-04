import { conflict, notFound } from "../../errors/http-errors.js"
import type {
    ProductFilterData,
    ProductMutationData,
    ProductOptionRow,
    ProductRow,
    ProductStatusData,
    ProductUpdateData
} from "../../types/catalog.types.js"
import type { IdScopedData, StoreScopedData } from "../../types/history.types.js"
import { findCategoryById } from "../categories/categories.repository.js"
import { mapProduct, mapProductOptions, mapProducts } from "./products.mapper.js"
import {
    findActiveProductOptions,
    findAllProducts,
    findProductById,
    findProductByName,
    insertProduct,
    updateProductById,
    updateProductStatus
} from "./products.repository.js"

export async function getAllProducts(data: ProductFilterData): Promise<ProductRow[]> {
    return mapProducts(await findAllProducts(data))
}

export async function getProductDetail(data: IdScopedData): Promise<ProductRow> {
    const product = await findProductById(data)

    if (!product) {
        throw notFound("Product not found")
    }

    return mapProduct(product)
}

export async function createNewProduct(data: ProductMutationData): Promise<ProductRow> {
    const category = await findCategoryById({
        id: data.categoryId,
        storeId: data.storeId
    })

    if (!category) {
        throw notFound("Category not found")
    }

    if (!category.is_active) {
        throw conflict("Category unavailable")
    }

    const existingProduct = await findProductByName({
        name: data.name,
        storeId: data.storeId
    })

    if (existingProduct) {
        throw conflict("Product already exists")
    }

    const product = await insertProduct(data)

    if (!product) {
        throw conflict("Product could not be created")
    }

    return mapProduct(product)
}

export async function updateProduct(data: ProductUpdateData): Promise<ProductRow> {
    const product = await findProductById({
        id: data.id,
        storeId: data.storeId
    })

    if (!product) {
        throw notFound("Product not found")
    }

    const category = await findCategoryById({
        id: data.categoryId,
        storeId: data.storeId
    })

    if (!category) {
        throw notFound("Category not found")
    }

    const existingProduct = await findProductByName({
        name: data.name,
        storeId: data.storeId
    })

    if (existingProduct && existingProduct.id !== data.id) {
        throw conflict("Product already exists")
    }

    const isChangingCategory = Number(product.category_id) !== Number(data.categoryId)

    if (!category.is_active && isChangingCategory) {
        throw conflict("Category unavailable")
    }

    const updatedProduct = await updateProductById(data)

    if (!updatedProduct) {
        throw notFound("Product not found")
    }

    return mapProduct(updatedProduct)
}

export async function disableProduct(data: ProductStatusData): Promise<ProductRow> {
    return updateProductAvailability(data)
}

export async function enableProduct(data: ProductStatusData): Promise<ProductRow> {
    return updateProductAvailability(data)
}

async function updateProductAvailability(data: ProductStatusData): Promise<ProductRow> {
    const product = await findProductById({
        id: data.id,
        storeId: data.storeId
    })

    if (!product) {
        throw notFound("Product not found")
    }

    const updatedProduct = await updateProductStatus(data)

    if (!updatedProduct) {
        throw notFound("Product not found")
    }

    return mapProduct(updatedProduct)
}

export async function getActiveProductOptions(data: StoreScopedData): Promise<ProductOptionRow[]> {
    return mapProductOptions(await findActiveProductOptions(data))
}