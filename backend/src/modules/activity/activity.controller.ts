import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    getCatalogPerformanceByDate,
    getDayPerformanceByDate,
    getGrowthRateByDate
} from "./activity.service.js"
import {
    validateActivityBaseQuery,
    validateCatalogPerformanceQuery
} from "./activity.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getGrowthRate: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateActivityBaseQuery(req.query)
        const growthRate = await getGrowthRateByDate({ storeId, ...query })

        res.json(growthRate)
    } catch (error) {
        next(error)
    }
}

export const getDayPerformance: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateActivityBaseQuery(req.query)
        const dayPerformance = await getDayPerformanceByDate({ storeId, ...query })

        res.json(dayPerformance)
    } catch (error) {
        next(error)
    }
}

export const getCatalogPerformance: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateCatalogPerformanceQuery(req.query)
        const catalogPerformance = await getCatalogPerformanceByDate({ storeId, ...query })

        res.json(catalogPerformance)
    } catch (error) {
        next(error)
    }
}