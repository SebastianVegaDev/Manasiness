import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    createNewProduct,
    disableProduct,
    enableProduct,
    getActiveProductOptions,
    getAllProducts,
    getProductDetail,
    updateProduct
} from "./products.service.js"
import {
    validateProductFilters,
    validateProductId,
    validateProductPayload
} from "./products.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getProducts: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const filters = validateProductFilters(req.query)
        const products = await getAllProducts({ storeId, ...filters })

        res.json(products)
    } catch (error) {
        next(error)
    }
}

export const getProductById: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateProductId(req.params)
        const product = await getProductDetail({ id, storeId })

        res.json(product)
    } catch (error) {
        next(error)
    }
}

export const createProduct: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const payload = validateProductPayload(req.body)
        const product = await createNewProduct({ storeId, ...payload })

        res.status(201).json({
            message: "Create successfully",
            product
        })
    } catch (error) {
        next(error)
    }
}

export const editProduct: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateProductId(req.params)
        const payload = validateProductPayload(req.body)
        const product = await updateProduct({ id, storeId, ...payload })

        res.status(200).json({
            message: "Edit successfully",
            product
        })
    } catch (error) {
        next(error)
    }
}

export const deactivateProduct: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateProductId(req.params)
        const product = await disableProduct({ id, storeId, isActive: false })

        res.status(200).json({
            message: "Product deactivated successfully",
            product
        })
    } catch (error) {
        next(error)
    }
}

export const activateProduct: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateProductId(req.params)
        const product = await enableProduct({ id, storeId, isActive: true })

        res.status(200).json({
            message: "Product activated successfully",
            product
        })
    } catch (error) {
        next(error)
    }
}

export const getProductOptions: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const products = await getActiveProductOptions({ storeId })

        res.json(products)
    } catch (error) {
        next(error)
    }
}