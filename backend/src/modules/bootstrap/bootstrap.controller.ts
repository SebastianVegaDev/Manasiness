import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { getBootstrapData } from "./bootstrap.service.js"

export const getBootstrap: RequestHandler = async (req, res, next) => {
    try {
        const storeId = req.store?.storeId

        if (!storeId) {
            throw unauthorized("Unauthorized")
        }

        const bootstrap = await getBootstrapData({ storeId })

        res.json(bootstrap)
    } catch (error) {
        next(error)
    }
}