import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import {
    createSubmissionController,
    getSubmissionByIdController,
    listMySubmissionsController,
} from "./submissions.controller.js";

const router = Router();
export const challengeSubmissionRouter = Router();

router.use(requireAuth);
challengeSubmissionRouter.use(requireAuth);

challengeSubmissionRouter.post(
    "/:challengeId/submissions",
    createSubmissionController
);
challengeSubmissionRouter.get(
    "/:challengeId/submissions/me",
    listMySubmissionsController
);

router.get("/:submissionId", getSubmissionByIdController);

export default router;
