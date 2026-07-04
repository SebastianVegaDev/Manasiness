import type { RequestHandler } from "express"

import { unauthorized } from "../../errors/http-errors.js"
import { getAuthCookieOptions, getClearCookieOptions } from "./auth.utils.js"
import {
    getStoreSession,
    loginStore,
    registerStore,
    resetStorePassword,
    sendPasswordResetCode,
    sendRegisterCode,
    verifyPasswordResetCode,
    verifyRegisterCode
} from "./auth.service.js"
import {
    validateEmailCodePayload,
    validateEmailPayload,
    validateLoginPayload,
    validateRegisterPayload,
    validateResetPasswordPayload
} from "./auth.validator.js"

export const login: RequestHandler = async (req, res, next) => {
    try {
        const payload = validateLoginPayload(req.body)
        const session = await loginStore(payload)

        res.cookie("token", session.token, getAuthCookieOptions())

        res.status(200).json({
            message: "Login successful",
            store: session.store
        })
    } catch (error) {
        next(error)
    }
}

export const sendCode: RequestHandler = async (req, res, next) => {
    try {
        const payload = validateEmailPayload(req.body)

        await sendRegisterCode(payload)

        res.status(200).json({
            message: "Code sent"
        })
    } catch (error) {
        next(error)
    }
}

export const verifyCode: RequestHandler = async (req, res, next) => {
    try {
        const payload = validateEmailCodePayload(req.body)

        await verifyRegisterCode(payload)

        res.status(200).json({
            message: "Code verified"
        })
    } catch (error) {
        next(error)
    }
}

export const register: RequestHandler = async (req, res, next) => {
    try {
        const payload = validateRegisterPayload(req.body)
        const store = await registerStore(payload)

        res.status(201).json({
            message: "Register successful",
            store
        })
    } catch (error) {
        next(error)
    }
}

export const me: RequestHandler = async (req, res, next) => {
    try {
        const storeId = req.store?.storeId

        if (!storeId) {
            throw unauthorized("Unauthorized")
        }

        const store = await getStoreSession(storeId)

        res.status(200).json({ store })
    } catch (error) {
        next(error)
    }
}

export const logout: RequestHandler = async (_req, res, next) => {
    try {
        res.clearCookie("token", getClearCookieOptions())

        res.status(200).json({
            message: "Logout successful"
        })
    } catch (error) {
        next(error)
    }
}

export const sendResetCode: RequestHandler = async (req, res, next) => {
    try {
        const payload = validateEmailPayload(req.body)

        await sendPasswordResetCode(payload)

        res.status(200).json({
            message: "Code sent"
        })
    } catch (error) {
        next(error)
    }
}

export const verifyResetCode: RequestHandler = async (req, res, next) => {
    try {
        const payload = validateEmailCodePayload(req.body)

        await verifyPasswordResetCode(payload)

        res.status(200).json({
            message: "Code verified"
        })
    } catch (error) {
        next(error)
    }
}

export const resetPassword: RequestHandler = async (req, res, next) => {
    try {
        const payload = validateResetPasswordPayload(req.body)

        await resetStorePassword(payload)

        res.status(200).json({
            message: "Password reset successful"
        })
    } catch (error) {
        next(error)
    }
}