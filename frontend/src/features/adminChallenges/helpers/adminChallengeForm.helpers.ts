import type {
	AdminChallenge,
	ChallengeDifficulty,
	ChallengeLanguage,
	ChallengePayload,
} from "../types/adminChallenge.types";
import type { ChallengeFormState } from "../types/adminChallengeForm.types";

export function toChallengeFormState(
	challenge: AdminChallenge
): ChallengeFormState {
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

export function buildChallengePayload(
	form: ChallengeFormState
): ChallengePayload {
	return {
		...form,
		difficulty: form.difficulty as ChallengeDifficulty,
		language: form.language as ChallengeLanguage,
	};
}

export function createSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
