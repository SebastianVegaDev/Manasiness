import type { ChallengePayload } from "./adminChallenge.types";

export type ChallengeFormState = Omit<
	ChallengePayload,
	"difficulty" | "language"
> & {
	difficulty: string;
	language: string;
};
