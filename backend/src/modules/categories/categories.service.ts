import { conflict, notFound } from "../../errors/http-errors.js"
import type {
    CatalogFilterData,
    CategoryMutationData,
    CategoryOptionRow,
    CategoryRow,
    CategoryStatusData,
    CategoryUpdateData
} from "../../types/catalog.types.js"
import type { IdScopedData, StoreScopedData } from "../../types/history.types.js"
import { mapCategories, mapCategory, mapCategoryOptions } from "./categories.mapper.js"
import {
    findActiveCategoryOptions,
    findAllCategories,
    findCategoryById,
    findCategoryByName,
    insertCategory,
    updateCategoryById,
    updateCategoryStatus
} from "./categories.repository.js"

export async function getAllCategories(data: CatalogFilterData): Promise<CategoryRow[]> {
    return mapCategories(await findAllCategories(data))
}

export async function getCategoryDetail(data: IdScopedData): Promise<CategoryRow> {
    const category = await findCategoryById(data)

    if (!category) {
        throw notFound("Category not found")
    }

    return mapCategory(category)
}

export async function createNewCategory(data: CategoryMutationData): Promise<CategoryRow> {
    const existingCategory = await findCategoryByName({
        name: data.name,
        storeId: data.storeId
    })

    if (existingCategory) {
        throw conflict("Category already exists")
    }

    const category = await insertCategory(data)

    if (!category) {
        throw conflict("Category could not be created")
    }

    return mapCategory(category)
}

export async function updateCategory(data: CategoryUpdateData): Promise<CategoryRow> {
    const category = await findCategoryById({
        id: data.id,
        storeId: data.storeId
    })

    if (!category) {
        throw notFound("Category not found")
    }

    const existingCategory = await findCategoryByName({
        name: data.name,
        storeId: data.storeId
    })

    if (existingCategory && existingCategory.id !== data.id) {
        throw conflict("Category already exists")
    }

    const updatedCategory = await updateCategoryById(data)

    if (!updatedCategory) {
        throw notFound("Category not found")
    }

    return mapCategory(updatedCategory)
}

export async function disableCategory(data: CategoryStatusData): Promise<CategoryRow> {
    return updateCategoryAvailability(data)
}

export async function enableCategory(data: CategoryStatusData): Promise<CategoryRow> {
    return updateCategoryAvailability(data)
}

async function updateCategoryAvailability(data: CategoryStatusData): Promise<CategoryRow> {
    const category = await findCategoryById({
        id: data.id,
        storeId: data.storeId
    })

    if (!category) {
        throw notFound("Category not found")
    }

    const updatedCategory = await updateCategoryStatus(data)

    if (!updatedCategory) {
        throw notFound("Category not found")
    }

    return mapCategory(updatedCategory)
}

export async function getActiveCategoryOptions(data: StoreScopedData): Promise<CategoryOptionRow[]> {
    return mapCategoryOptions(await findActiveCategoryOptions(data))
}