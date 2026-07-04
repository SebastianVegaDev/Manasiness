import { Router } from "express"

import { editPassword } from "./password.controller.js"

const router = Router()

router.post("/edit", editPassword)

export default router