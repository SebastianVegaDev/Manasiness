import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { createNewOrder, getAllOrders } from "./orders.service.js"
import { validateOrderPayload, validateOrdersQuery } from "./orders.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getOrders: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateOrdersQuery(req.query)
        const orders = await getAllOrders({ storeId, ...query })

        res.json(orders)
    } catch (error) {
        next(error)
    }
}

export const createOrder: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const payload = validateOrderPayload(req.body)
        const order = await createNewOrder({ storeId, ...payload })

        res.status(201).json({
            message: "Order created successfully",
            order
        })
    } catch (error) {
        next(error)
    }
}