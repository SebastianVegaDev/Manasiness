import type { ChallengeFormState } from "../types/adminChallengeForm.types";

export const emptyChallengeForm: ChallengeFormState = {
	title: "",
	slug: "",
	description: "",
	difficulty: "easy",
	topic: "arrays",
	language: "javascript",
	starter_code: "function solve() {\n\t\n}",
	function_name: "solve",
	is_published: false,
};
