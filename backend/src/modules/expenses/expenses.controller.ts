import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { getExpensesByDay, getExpensesByPeriod } from "./expenses.service.js"
import {
    validateExpensesDayQuery,
    validateExpensesPeriodQuery
} from "./expenses.validator.js"

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
        const query = validateExpensesPeriodQuery(req.query)
        const expenses = await getExpensesByPeriod({ storeId, ...query })

        res.json(expenses)
    } catch (error) {
        next(error)
    }
}

export const getInfoCard: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateExpensesDayQuery(req.query)
        const expenses = await getExpensesByDay({ storeId, ...query })

        res.json(expenses)
    } catch (error) {
        next(error)
    }
}