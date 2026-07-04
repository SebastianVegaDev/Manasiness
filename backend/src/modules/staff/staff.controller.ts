import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { createNewStaff, getAllStaff } from "./staff.service.js"
import { validateStaffPayload, validateStaffQuery } from "./staff.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getStaff: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const query = validateStaffQuery(req.query)
        const staff = await getAllStaff({ storeId, ...query })

        res.json(staff)
    } catch (error) {
        next(error)
    }
}

export const createStaff: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const payload = validateStaffPayload(req.body)
        const staff = await createNewStaff({ storeId, ...payload })

        res.status(201).json({
            message: "Staff payment created successfully",
            staff
        })
    } catch (error) {
        next(error)
    }
}