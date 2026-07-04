import { Router } from "express"

import {
    getOrdersStats,
    getSalesStats,
    getStaffStats
} from "./stats.controller.js"

const router = Router()

router.get("/sales", getSalesStats)
router.get("/orders", getOrdersStats)
router.get("/staff", getStaffStats)

export default router