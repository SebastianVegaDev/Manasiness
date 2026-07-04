import type { RequestHandler } from "express";
import { sendErrorResponse } from "../../errors/httpErrors.js";
import {
	getPublishedChallengeBySlug,
	getPublishedChallenges,
} from "./challenges.service.js";

export const listChallengesController: RequestHandler = async (req, res) => {
	try {
		const challenges = await getPublishedChallenges(
			req.query as Record<string, unknown>
		);

		res.json({
			challenges,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const getChallengeBySlugController: RequestHandler = async (req, res) => {
	try {
		const slug = req.params.slug;

		if (Array.isArray(slug) || !slug?.trim()) {
			throw new Error("Challenge slug is required");
		}

		const challenge = await getPublishedChallengeBySlug(slug);

		res.json({
			challenge,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};