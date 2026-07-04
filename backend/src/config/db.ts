import pg from "pg"
import { env } from "./env.js"

const { Pool } = pg

const pool = new Pool(
    env.isProduction
        ? {
            connectionString: env.db.databaseUrl,
            ssl: {
                rejectUnauthorized: false
            }
        }
        : {
            host: env.db.host,
            port: env.db.port,
            user: env.db.user,
            password: env.db.password,
            database: env.db.name
        }
)

export default pool