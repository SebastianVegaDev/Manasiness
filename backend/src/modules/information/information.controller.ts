import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { editInformationStore, getInformationStore } from "./information.service.js"
import { validateEditInformationPayload } from "./information.validator.js"

export const getInformation: RequestHandler = async (req, res, next) => {
    try {
        const storeId = req.store?.storeId

        if (!storeId) {
            throw unauthorized("Unauthorized")
        }

        const information = await getInformationStore({ storeId })

        res.json(information)
    } catch (error) {
        next(error)
    }
}

export const editInformation: RequestHandler = async (req, res, next) => {
    try {
        const storeId = req.store?.storeId

        if (!storeId) {
            throw unauthorized("Unauthorized")
        }

        const payload = validateEditInformationPayload(req.body)
        const information = await editInformationStore({ storeId, ...payload })

        res.status(200).json({
            message: "Information edit successfully",
            information
        })
    } catch (error) {
        next(error)
    }
}