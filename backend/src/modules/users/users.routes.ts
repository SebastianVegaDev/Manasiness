import { Router } from "express"

import {
    activateUser,
    createUser,
    deactivateUser,
    editUser,
    getUserById,
    getUsers
} from "./users.controller.js"

const router = Router()

router.get("/", getUsers)
router.post("/", createUser)
router.post("/create", createUser)
router.get("/:id", getUserById)
router.put("/:id", editUser)
router.post("/:id/edit", editUser)
router.patch("/:id/deactivate", deactivateUser)
router.patch("/:id/activate", activateUser)

export default router
