import { Router } from "express"

import {
    getSupplierById,
    getSupplierOptions,
    getSuppliers
} from "./suppliers.controller.js"

const router = Router()

router.get("/", getSuppliers)
router.get("/options", getSupplierOptions)
router.get("/:id", getSupplierById)

export default router