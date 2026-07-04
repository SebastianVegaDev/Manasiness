export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeLanguage = "javascript"  | "typescript" | "sql";

export type PublicChallenge = {
    id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: ChallengeDifficulty;
    topic: string;
    language: ChallengeLanguage;
    function_name: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    solved?: boolean;
};

export type PublicChallengeDetail = PublicChallenge & {
    starter_code: string;
};

export type SubmissionStatus =
    | "pending"
    | "accepted"
    | "wrong_answer"
    | "runtime_error"
    | "timeout";

export type ChallengeSubmission = {
    id: string;
    user_id: string;
    challenge_id: string;
    language: ChallengeLanguage;
    code: string;
    status: SubmissionStatus;
    passed_tests: number;
    total_tests: number;
    score: number;
    runtime_ms: number | null;
    error_message: string | null;
    created_at: string;
}

export type ChallengeFilters = {
    search: string;
    difficulty: ChallengeDifficulty | "";
    topic: string;
    language: ChallengeLanguage | "";
};