import type { RequestHandler } from "express";
import { sendErrorResponse } from "../../errors/httpErrors.js";
import type { AuthenticatedUser } from "../../types/auth.types.js";
import {
	createAdminChallenge,
	deleteAdminChallenge,
	getAdminChallengeById,
	listAdminChallenges,
	updateAdminChallenge,
} from "./adminChallenges.service.js";

function readParam(value: string | string[] | undefined, label: string) {
	if (Array.isArray(value) || !value?.trim()) {
		throw new Error(`${label} id is required`);
	}

	return value;
}

export const listChallengesController: RequestHandler = async (_req, res) => {
	try {
		const challenges = await listAdminChallenges();

		res.json({
			challenges,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const getChallengeByIdController: RequestHandler = async (req, res) => {
	try {
		const id = readParam(req.params.id, "Challenge");
		const challenge = await getAdminChallengeById(id);

		res.json({
			challenge,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const createChallengeController: RequestHandler = async (req, res) => {
	try {
		const user = res.locals.user as AuthenticatedUser;
		const challenge = await createAdminChallenge(req.body, user.id);

		res.status(201).json({
			challenge,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const updateChallengeController: RequestHandler = async (req, res) => {
	try {
		const id = readParam(req.params.id, "Challenge");
		const challenge = await updateAdminChallenge(id, req.body);

		res.json({
			challenge,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const deleteChallengeController: RequestHandler = async (req, res) => {
	try {
		const id = readParam(req.params.id, "Challenge");
		const challenge = await deleteAdminChallenge(id);

		res.json({
			message: "Challenge deleted successfully",
			challenge,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};