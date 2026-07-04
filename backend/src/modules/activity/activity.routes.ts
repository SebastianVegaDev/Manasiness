import { Router } from "express"

import {
    getCatalogPerformance,
    getDayPerformance,
    getGrowthRate
} from "./activity.controller.js"

const router = Router()

router.get("/growth-rate", getGrowthRate)
router.get("/day-performance", getDayPerformance)
router.get("/catalog-performance", getCatalogPerformance)

export default router