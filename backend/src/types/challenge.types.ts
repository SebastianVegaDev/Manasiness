export const challengeDifficulties = ["easy", "medium", "hard"] as const;
export const challengeLanguages = ["javascript", "typescript", "sql"] as const;

export type ChallengeDifficulty = (typeof challengeDifficulties)[number];
export type ChallengeLanguage = (typeof challengeLanguages)[number];

export type ChallengeInput = {
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

export type ChallengeFilters = {
    search?: string;
    difficulty?: ChallengeDifficulty;
    topic?: string;
    language?: ChallengeLanguage;
};