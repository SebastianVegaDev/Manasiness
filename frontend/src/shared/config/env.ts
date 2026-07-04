import type { FrontendEnv } from "@shared/types/env.types"

export const env: FrontendEnv = {
    apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
    appName: import.meta.env.VITE_APP_NAME || "Manasiness",
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
}










