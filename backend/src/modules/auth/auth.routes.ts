import { Router } from "express"

import { authRateLimit } from "../../middlewares/auth-rate-limit.js"
import { verifyToken } from "../../middlewares/auth.middleware.js"
import {
    login,
    logout,
    me,
    register,
    resetPassword,
    sendCode,
    sendResetCode,
    verifyCode,
    verifyResetCode
} from "./auth.controller.js"

const router = Router()

router.post("/login", authRateLimit, login)
router.post("/register/send-code", authRateLimit, sendCode)
router.post("/register/verify-code", authRateLimit, verifyCode)
router.post("/register", authRateLimit, register)
router.post("/password/send-code", authRateLimit, sendResetCode)
router.post("/password/verify-code", authRateLimit, verifyResetCode)
router.post("/password/reset", authRateLimit, resetPassword)
router.get("/me", verifyToken, me)
router.post("/logout", logout)

export default router