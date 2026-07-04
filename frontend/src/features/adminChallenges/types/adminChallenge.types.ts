export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeLanguage = "javascript" | "typescript" | "sql";

export type AdminChallenge = {
	id: string;
	title: string;
	slug: string;
	description: string;
	difficulty: ChallengeDifficulty;
	topic: string;
	language: ChallengeLanguage;
	starter_code: string;
	function_name: string;
	is_published: boolean;
	created_by: string | null;
	created_at: string;
	updated_at: string;
};

export type ChallengePayload = {
	title: string;
	slug: string;
	description: string;
	difficulty: ChallengeDifficulty;
	topic: string;
	language: ChallengeLanguage;
	starter_code: string;
	function_name: string;
	is_published: boolean;
};

export type TestCaseComparator =
	| "exact"
	| "array_exact"
	| "array_unordered"
	| "number_tolerance";

export type AdminTestCase = {
	id: string;
	challenge_id: string;
	input_json: unknown;
	expected_output_json: unknown;
	is_hidden: boolean;
	comparator: TestCaseComparator;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

export type TestCasePayload = {
	input_json: unknown;
	expected_output_json: unknown;
	is_hidden: boolean;
	comparator: TestCaseComparator;
};