import { Router } from "express"

import {
    activateProduct,
    createProduct,
    deactivateProduct,
    editProduct,
    getProductById,
    getProductOptions,
    getProducts
} from "./products.controller.js"

const router = Router()

router.get("/", getProducts)
router.get("/options", getProductOptions)
router.post("/", createProduct)
router.post("/create", createProduct)
router.get("/:id", getProductById)
router.put("/:id", editProduct)
router.post("/:id/edit", editProduct)
router.patch("/:id/deactivate", deactivateProduct)
router.patch("/:id/activate", activateProduct)

export default router
