import { Router } from "express";
import {
    getChallengeBySlugController,
    listChallengesController,
} from "./challenges.controller.js";
import { challengeSubmissionRouter } from "../submissions/submissions.routes.js";

const router = Router();

router.get("/", listChallengesController);
router.use(challengeSubmissionRouter);
router.get("/:slug", getChallengeBySlugController);

export default router;