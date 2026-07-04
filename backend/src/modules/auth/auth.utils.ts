import type { CookieOptions } from "express"
import jwt from "jsonwebtoken"

import { env } from "../../config/env.js"
import type { StoreSessionRow } from "../../types/store.types.js"

export function generateToken(store: Pick<StoreSessionRow, "id" | "email">): string {
    return jwt.sign(
        {
            storeId: store.id,
            email: store.email
        },
        env.jwtSecret,
        { expiresIn: "7d" }
    )
}

export function getAuthCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    }
}

export function getClearCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? "none" : "lax",
        path: "/"
    }
}