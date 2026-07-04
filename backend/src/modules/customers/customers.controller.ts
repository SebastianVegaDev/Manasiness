import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    getActiveCustomersOptions,
    getAllCustomers,
    getCustomerDetail
} from "./customers.service.js"
import {
    validateCustomerDetailParams,
    validateCustomerDetailQuery,
    validateCustomerFilters
} from "./customers.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getCustomers: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const filters = validateCustomerFilters(req.query)
        const customers = await getAllCustomers({ storeId, ...filters })

        res.json(customers)
    } catch (error) {
        next(error)
    }
}

export const getCustomerById: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateCustomerDetailParams(req.params)
        const query = validateCustomerDetailQuery(req.query)

        const customer = await getCustomerDetail({
            id,
            storeId,
            ...query
        })

        res.json(customer)
    } catch (error) {
        next(error)
    }
}

export const getCustomerOptions: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const customers = await getActiveCustomersOptions({ storeId })

        res.json(customers)
    } catch (error) {
        next(error)
    }
}