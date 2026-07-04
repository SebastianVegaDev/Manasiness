import type {
	AdminChallenge,
	ChallengePayload,
} from "../types/adminChallenge.types";

export function toChallengePayload(challenge: AdminChallenge): ChallengePayload {
	return {
		title: challenge.title,
		slug: challenge.slug,
		description: challenge.description,
		difficulty: challenge.difficulty,
		topic: challenge.topic,
		language: challenge.language,
		starter_code: challenge.starter_code,
		function_name: challenge.function_name,
		is_published: challenge.is_published,
	};
}
