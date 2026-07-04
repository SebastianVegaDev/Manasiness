export type ChallengeDifficulty = "easy" | "medium" | "hard";

export type ChallengeInput = {
    title: string;
    slug: string;
    description: string;
    difficulty: ChallengeDifficulty;
    starter_code: string;
    is_published?: boolean;
}