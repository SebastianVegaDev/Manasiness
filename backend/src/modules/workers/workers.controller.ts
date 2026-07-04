import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    getActiveWorkersOptions,
    getAllWorkers,
    getWorkerDetail
} from "./workers.service.js"
import {
    validateWorkerDetailParams,
    validateWorkerDetailQuery,
    validateWorkerFilters
} from "./workers.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getWorkers: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const filters = validateWorkerFilters(req.query)
        const workers = await getAllWorkers({ storeId, ...filters })

        res.json(workers)
    } catch (error) {
        next(error)
    }
}

export const getWorkerById: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateWorkerDetailParams(req.params)
        const query = validateWorkerDetailQuery(req.query)

        const worker = await getWorkerDetail({
            id,
            storeId,
            ...query
        })

        res.json(worker)
    } catch (error) {
        next(error)
    }
}

export const getWorkerOptions: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const workers = await getActiveWorkersOptions({ storeId })

        res.json(workers)
    } catch (error) {
        next(error)
    }
}