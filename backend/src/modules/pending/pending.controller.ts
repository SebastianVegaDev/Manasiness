import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    getPendingSummaryData,
    getUsersPending,
    resolvePendingItem
} from "./pending.service.js"
import {
    validatePendingParams,
    validatePendingStatePayload
} from "./pending.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getPendingSummary: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const summary = await getPendingSummaryData({ storeId })

        res.json(summary)
    } catch (error) {
        next(error)
    }
}

export const getCustomersPending: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const customers = await getUsersPending({ storeId, scope: "customers" })

        res.json(customers)
    } catch (error) {
        next(error)
    }
}

export const getSuppliersPending: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const suppliers = await getUsersPending({ storeId, scope: "suppliers" })

        res.json(suppliers)
    } catch (error) {
        next(error)
    }
}

export const getWorkersPending: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const workers = await getUsersPending({ storeId, scope: "workers" })

        res.json(workers)
    } catch (error) {
        next(error)
    }
}

export const updatePendingState: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const params = validatePendingParams(req.params)
        const payload = validatePendingStatePayload(req.body)

        const record = await resolvePendingItem({
            storeId,
            ...params,
            ...payload
        })

        res.json({
            message: "Update successfully",
            record
        })
    } catch (error) {
        next(error)
    }
}