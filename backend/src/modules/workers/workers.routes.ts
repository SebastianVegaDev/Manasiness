import { Router } from "express"

import {
    getWorkerById,
    getWorkerOptions,
    getWorkers
} from "./workers.controller.js"

const router = Router()

router.get("/", getWorkers)
router.get("/options", getWorkerOptions)
router.get("/:id", getWorkerById)

export default router