import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

import { env } from "../config/env.js"
import { unauthorized } from "../errors/http-errors.js"
import type { AuthTokenPayload } from "../types/auth.types.js"

function isAuthTokenPayload(payload: string | jwt.JwtPayload): payload is AuthTokenPayload {
    return (
        typeof payload !== "string" &&
        typeof payload.storeId === "number" &&
        typeof payload.email === "string"
    )
}

export function verifyToken(req: Request, _res: Response, next: NextFunction) {
    const token = req.cookies?.token

    if (!token) {
        return next(unauthorized("Unauthorized"))
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret)

        if (!isAuthTokenPayload(decoded)) {
            return next(unauthorized("Unauthorized"))
        }

        req.user = decoded
        req.store = { storeId: decoded.storeId }

        return next()
    } catch {
        return next(unauthorized("Unauthorized"))
    }
}