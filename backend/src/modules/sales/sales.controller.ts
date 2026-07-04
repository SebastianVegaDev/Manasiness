import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { createNewSale, getAllSales } from "./sales.service.js"
import { validateSalePayload, validateSalesQuery } from "./sales.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getSales: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateSalesQuery(req.query)
        const sales = await getAllSales({ storeId, ...query })

        res.json(sales)
    } catch (error) {
        next(error)
    }
}

export const createSale: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const payload = validateSalePayload(req.body)
        const sale = await createNewSale({ storeId, ...payload })

        res.status(201).json({
            message: "Sale created successfully",
            sale
        })
    } catch (error) {
        next(error)
    }
}