import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { getIncomeByDay, getIncomeByPeriod } from "./income.service.js"
import {
    validateIncomeDayQuery,
    validateIncomePeriodQuery
} from "./income.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getInfoBar: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateIncomePeriodQuery(req.query)
        const income = await getIncomeByPeriod({ storeId, ...query })

        res.json(income)
    } catch (error) {
        next(error)
    }
}

export const getInfoCard: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateIncomeDayQuery(req.query)
        const income = await getIncomeByDay({ storeId, ...query })

        res.json(income)
    } catch (error) {
        next(error)
    }
}