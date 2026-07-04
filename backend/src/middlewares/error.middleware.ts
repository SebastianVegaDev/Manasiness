import type { ErrorRequestHandler } from "express"

import { env } from "../config/env.js"
import { AppError } from "../errors/app-error.js"

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }

    return "Internal server error"
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.message
        })
    }

    const message = getErrorMessage(error)

    if (!env.isProduction) {
        console.error(error)
    }

    return res.status(500).json({
        error: env.isProduction ? "Internal server error" : message
    })
}