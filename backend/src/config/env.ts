import dotenv from "dotenv"

dotenv.config()

type NodeEnv = "development" | "production" | "test"

function getNodeEnv(value: string | undefined): NodeEnv {
    if (value === "production" || value === "test") {
        return value
    }

    return "development"
}

function getNumberEnv(name: string, fallback: number): number {
    const value = process.env[name]

    if (!value) {
        return fallback
    }

    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : fallback
}

function requireInProduction(name: string): string | undefined {
    const value = process.env[name]

    if (process.env.NODE_ENV === "production" && !value) {
        throw new Error(`${name} is required in production`)
    }

    return value
}

const nodeEnv = getNodeEnv(process.env.NODE_ENV)
const isProduction = nodeEnv === "production"

export const env = {
    nodeEnv,
    isProduction,
    port: getNumberEnv("PORT", 3000),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    trustProxy: process.env.TRUST_PROXY === "true" || process.env.TRUST_PROXY === "1",

    jwtSecret: requireInProduction("JWT_SECRET") || "change-me-in-development",

    db: {
        databaseUrl: requireInProduction("DATABASE_URL") || "",
        host: process.env.DB_HOST || "localhost",
        port: getNumberEnv("DB_PORT", 5432),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        name: process.env.DB_NAME || "manasiness"
    },

    email: {
        resendApiKey: process.env.RESEND_API_KEY || "",
        from: process.env.RESEND_FROM_EMAIL || "Manasiness <onboarding@resend.dev>"
    }
} as const
