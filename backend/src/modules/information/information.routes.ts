import { Router } from "express"

import { editInformation, getInformation } from "./information.controller.js"

const router = Router()

router.get("/", getInformation)
router.post("/edit", editInformation)

export default router