import { Router } from "express";
import { loginController, logoutController, meController, registerController } from "./auth.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, meController);

export default router;