import type { AuthTokenPayload, RequestStore } from "./auth.types.js"

declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload
            store?: RequestStore
        }
    }
}

export {}