import { Router } from "express"

import { createSale, getSales } from "./sales.controller.js"

const router = Router()

router.get("/", getSales)
router.post("/create", createSale)

export default router