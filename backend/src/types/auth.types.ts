import type { JwtPayload } from "jsonwebtoken"

export type AuthTokenPayload = JwtPayload & {
    storeId: number
    email: string
}

export type RequestStore = {
    storeId: number
}