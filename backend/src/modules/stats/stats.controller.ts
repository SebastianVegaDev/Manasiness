import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    getStatsOrders,
    getStatsSales,
    getStatsStaff
} from "./stats.service.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getSalesStats: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const stats = await getStatsSales({ storeId })

        res.json(stats)
    } catch (error) {
        next(error)
    }
}

export const getOrdersStats: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const stats = await getStatsOrders({ storeId })

        res.json(stats)
    } catch (error) {
        next(error)
    }
}

export const getStaffStats: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const stats = await getStatsStaff({ storeId })

        res.json(stats)
    } catch (error) {
        next(error)
    }
}