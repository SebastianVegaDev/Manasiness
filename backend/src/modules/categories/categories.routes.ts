import { Router } from "express"

import {
    activateCategory,
    createCategory,
    deactivateCategory,
    editCategory,
    getCategories,
    getCategoryById,
    getCategoryOptions
} from "./categories.controller.js"

const router = Router()

router.get("/", getCategories)
router.get("/options", getCategoryOptions)
router.post("/", createCategory)
router.post("/create", createCategory)
router.get("/:id", getCategoryById)
router.put("/:id", editCategory)
router.post("/:id/edit", editCategory)
router.patch("/:id/deactivate", deactivateCategory)
router.patch("/:id/activate", activateCategory)

export default router
