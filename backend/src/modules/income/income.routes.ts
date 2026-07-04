import { Router } from "express"

import { getInfoBar, getInfoCard } from "./income.controller.js"

const router = Router()

router.get("/", getInfoBar)
router.get("/day", getInfoCard)

export default router