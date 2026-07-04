import { Router } from "express"

import {
    getCustomersPending,
    getPendingSummary,
    getSuppliersPending,
    getWorkersPending,
    updatePendingState
} from "./pending.controller.js"

const router = Router()

router.get("/summary", getPendingSummary)
router.get("/customers", getCustomersPending)
router.get("/sales", getCustomersPending)
router.get("/suppliers", getSuppliersPending)
router.get("/orders", getSuppliersPending)
router.get("/workers", getWorkersPending)
router.get("/staff", getWorkersPending)
router.patch("/:scope/:id/state", updatePendingState)
router.patch("/:scope/:id", updatePendingState)

export default router
