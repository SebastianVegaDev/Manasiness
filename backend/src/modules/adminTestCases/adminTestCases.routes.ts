import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import {
    createTestCaseController,
    deleteTestCaseController,
    listTestCasesController,
    updateTestCaseController,
} from "./adminTestCases.controller.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole("admin"));

router.get("/challenges/:challengeId/test-cases", listTestCasesController);
router.post("/challenges/:challengeId/test-cases", createTestCaseController);
router.put("/test-cases/:testCaseId", updateTestCaseController);
router.delete("/test-cases/:testCaseId", deleteTestCaseController);

export default router;