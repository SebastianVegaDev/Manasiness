import { Router } from "express"

import { getBootstrap } from "./bootstrap.controller.js"

const router = Router()

router.get("/", getBootstrap)

export default router