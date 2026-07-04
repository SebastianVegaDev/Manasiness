import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    getActiveSuppliersOptions,
    getAllSuppliers,
    getSupplierDetail
} from "./suppliers.service.js"
import {
    validateSupplierDetailParams,
    validateSupplierDetailQuery,
    validateSupplierFilters
} from "./suppliers.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getSuppliers: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const filters = validateSupplierFilters(req.query)
        const suppliers = await getAllSuppliers({ storeId, ...filters })

        res.json(suppliers)
    } catch (error) {
        next(error)
    }
}

export const getSupplierById: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateSupplierDetailParams(req.params)
        const query = validateSupplierDetailQuery(req.query)

        const supplier = await getSupplierDetail({
            id,
            storeId,
            ...query
        })

        res.json(supplier)
    } catch (error) {
        next(error)
    }
}

export const getSupplierOptions: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const suppliers = await getActiveSuppliersOptions({ storeId })

        res.json(suppliers)
    } catch (error) {
        next(error)
    }
}