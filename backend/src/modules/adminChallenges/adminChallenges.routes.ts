import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import {
	createChallengeController,
	deleteChallengeController,
	getChallengeByIdController,
	listChallengesController,
	updateChallengeController,
} from "./adminChallenges.controller.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole("admin"));

router.get("/", listChallengesController);
router.get("/:id", getChallengeByIdController);
router.post("/", createChallengeController);
router.put("/:id", updateChallengeController);
router.delete("/:id", deleteChallengeController);

export default router;