import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    createNewCategory,
    disableCategory,
    enableCategory,
    getActiveCategoryOptions,
    getAllCategories,
    getCategoryDetail,
    updateCategory
} from "./categories.service.js"
import {
    validateCategoryFilters,
    validateCategoryId,
    validateCategoryPayload
} from "./categories.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getCategories: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const filters = validateCategoryFilters(req.query)
        const categories = await getAllCategories({ storeId, ...filters })

        res.json(categories)
    } catch (error) {
        next(error)
    }
}

export const getCategoryById: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateCategoryId(req.params)
        const category = await getCategoryDetail({ id, storeId })

        res.json(category)
    } catch (error) {
        next(error)
    }
}

export const createCategory: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const payload = validateCategoryPayload(req.body)
        const category = await createNewCategory({ storeId, ...payload })

        res.status(201).json({
            message: "Create successfully",
            category
        })
    } catch (error) {
        next(error)
    }
}

export const editCategory: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateCategoryId(req.params)
        const payload = validateCategoryPayload(req.body)
        const category = await updateCategory({ id, storeId, ...payload })

        res.status(200).json({
            message: "Edit successfully",
            category
        })
    } catch (error) {
        next(error)
    }
}

export const deactivateCategory: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateCategoryId(req.params)
        const category = await disableCategory({ id, storeId, isActive: false })

        res.status(200).json({
            message: "Category deactivated successfully",
            category
        })
    } catch (error) {
        next(error)
    }
}

export const activateCategory: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateCategoryId(req.params)
        const category = await enableCategory({ id, storeId, isActive: true })

        res.status(200).json({
            message: "Category activated successfully",
            category
        })
    } catch (error) {
        next(error)
    }
}

export const getCategoryOptions: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const categories = await getActiveCategoryOptions({ storeId })

        res.json(categories)
    } catch (error) {
        next(error)
    }
}