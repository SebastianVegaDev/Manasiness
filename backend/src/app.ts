import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import router from "./routes.js"
import { corsOptions } from "./config/cors.js"
import { env } from "./config/env.js"
import { notFound } from "./middlewares/not-found.middleware.js"
import { errorHandler } from "./middlewares/error.middleware.js"

const app = express()

if (env.isProduction || env.trustProxy) {
    app.set("trust proxy", 1)
}

app.disable("x-powered-by")

app.use(express.json({ limit: "100kb" }))
app.use(cookieParser())
app.use(cors(corsOptions))

app.use(router)

app.use(notFound)
app.use(errorHandler)

export default app
