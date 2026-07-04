import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import {
    createNewUser,
    disableUser,
    enableUser,
    getAllUsers,
    getUserDetail,
    updateUser
} from "./users.service.js"
import {
    validateUserFilters,
    validateUserId,
    validateUserPayload
} from "./users.validator.js"

function getStoreId(req: Parameters<RequestHandler>[0]): number {
    const storeId = req.store?.storeId

    if (!storeId) {
        throw unauthorized("Unauthorized")
    }

    return storeId
}

export const getUsers: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const filters = validateUserFilters(req.query)
        const users = await getAllUsers({ storeId, ...filters })

        res.json(users)
    } catch (error) {
        next(error)
    }
}

export const getUserById: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateUserId(req.params)
        const user = await getUserDetail({ id, storeId })

        res.json(user)
    } catch (error) {
        next(error)
    }
}

export const createUser: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const payload = validateUserPayload(req.body)
        const user = await createNewUser({ storeId, ...payload })

        res.status(201).json({
            message: "Create successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const editUser: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateUserId(req.params)
        const payload = validateUserPayload(req.body)
        const user = await updateUser({ id, storeId, ...payload })

        res.status(200).json({
            message: "Edit successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const deactivateUser: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateUserId(req.params)
        const user = await disableUser({ id, storeId, isActive: false })

        res.status(200).json({
            message: "User deactivated successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const activateUser: RequestHandler = async (req, res, next) => {
    try {
        const storeId = getStoreId(req)
        const { id } = validateUserId(req.params)
        const user = await enableUser({ id, storeId, isActive: true })

        res.status(200).json({
            message: "User activated successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}