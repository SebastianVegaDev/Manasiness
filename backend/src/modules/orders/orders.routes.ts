import { Router } from "express"

import { createOrder, getOrders } from "./orders.controller.js"

const router = Router()

router.get("/", getOrders)
router.post("/create", createOrder)

export default router