import type { RequestHandler } from "express";
import { sendErrorResponse } from "../../errors/httpErrors.js";
import type { AuthenticatedUser } from "../../types/auth.types.js";
import {
	createSubmission,
	getSubmissionById,
	listMySubmissions,
} from "./submissions.service.js";

function readParam(value: string | string[] | undefined, label: string) {
	if (Array.isArray(value) || !value?.trim()) {
		throw new Error(`${label} id is required`);
	}

	return value;
}

export const createSubmissionController: RequestHandler = async (req, res) => {
	try {
		const user = res.locals.user as AuthenticatedUser;
		const challengeId = readParam(req.params.challengeId, "Challenge");
		const submission = await createSubmission(challengeId, req.body, user);

		res.status(201).json({
			submission,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const listMySubmissionsController: RequestHandler = async (req, res) => {
	try {
		const user = res.locals.user as AuthenticatedUser;
		const challengeId = readParam(req.params.challengeId, "Challenge");
		const submissions = await listMySubmissions(challengeId, user.id);

		res.json({
			submissions,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const getSubmissionByIdController: RequestHandler = async (req, res) => {
	try {
		const user = res.locals.user as AuthenticatedUser;
		const submissionId = readParam(req.params.submissionId, "Submission");
		const submission = await getSubmissionById(submissionId, user);

		res.json({
			submission,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};
