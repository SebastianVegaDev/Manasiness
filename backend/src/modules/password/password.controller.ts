import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { editAccountPassword } from "./password.service.js"
import { validateEditPasswordPayload } from "./password.validator.js"

export const editPassword: RequestHandler = async (req, res, next) => {
    try {
        const storeId = req.store?.storeId

        if (!storeId) {
            throw unauthorized("Unauthorized")
        }

        const payload = validateEditPasswordPayload(req.body)

        await editAccountPassword({
            storeId,
            ...payload
        })

        res.status(200).json({
            message: "Password updated successfully"
        })
    } catch (error) {
        next(error)
    }
}