import {
	validateChallengeInput,
	validateId,
} from "../../validators/challenge.validators.js";
import {
	deleteChallengeById,
	findAdminChallengeById,
	findAdminChallenges,
	insertChallenge,
	updateChallengeById,
} from "./adminChallenges.repository.js";

export async function listAdminChallenges() {
	return findAdminChallenges();
}

export async function getAdminChallengeById(id: string) {
	validateId(id, "Challenge");

	const challenge = await findAdminChallengeById(id);

	if (!challenge) {
		throw new Error("Challenge not found");
	}

	return challenge;
}

export async function createAdminChallenge(input: unknown, createdBy: string) {
	const validatedInput = validateChallengeInput(input);

	return insertChallenge(validatedInput, createdBy);
}

export async function updateAdminChallenge(id: string, input: unknown) {
	validateId(id, "Challenge");

	const validatedInput = validateChallengeInput(input);
	const challenge = await updateChallengeById(id, validatedInput);

	if (!challenge) {
		throw new Error("Challenge not found");
	}

	return challenge;
}

export async function deleteAdminChallenge(id: string) {
	validateId(id, "Challenge");

	const challenge = await deleteChallengeById(id);

	if (!challenge) {
		throw new Error("Challenge not found");
	}

	return challenge;
}