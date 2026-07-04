import { Router } from "express"

import { createStaff, getStaff } from "./staff.controller.js"

const router = Router()

router.get("/", getStaff)
router.post("/create", createStaff)

export default router