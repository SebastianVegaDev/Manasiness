CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    topic VARCHAR(80) NOT NULL DEFAULT 'general',
    language VARCHAR(30) NOT NULL DEFAULT 'javascript',
    starter_code TEXT NOT NULL,
    function_name VARCHAR(80) NOT NULL DEFAULT 'solve',
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT challenges_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard')),
    CONSTRAINT challenges_language_check CHECK (language IN ('javascript', 'typescript', 'sql'))
);

CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    input TEXT,
    expected_output TEXT,
    input_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    expected_output_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_hidden BOOLEAN NOT NULL DEFAULT true,
    comparator VARCHAR(40) NOT NULL DEFAULT 'exact',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT test_cases_comparator_check CHECK (
        comparator IN (
            'exact',
            'array_exact',
            'array_unordered',
            'number_tolerance'
        )
    )
);

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    language VARCHAR(30) NOT NULL DEFAULT 'javascript',
    source_code TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    score INTEGER NOT NULL DEFAULT 0,
    passed_tests INTEGER NOT NULL DEFAULT 0,
    total_tests INTEGER NOT NULL DEFAULT 0,
    runtime_ms INTEGER,
    output TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT submissions_status_check CHECK (
        status in (
            'pending',
            'accepted',
            'wrong_answer',
            'runtime_error',
            'timeout'
        )
    ),

    CONSTRAINT submissions_score_check CHECK (score >= 0)
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    solved BOOLEAN NOT NULL DEFAULT false,
    best_score INTEGER NOT NULL DEFAULT 0,
    attempts_count INTEGER NOT NULL DEFAULT 0,
    last_submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    last_attempt_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_progress_unique_user_challenge UNIQUE (user_id, challenge_id),
    CONSTRAINT user_progress_best_score_check CHECK (best_score >= 0)
);

CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
CREATE INDEX IF NOT EXISTS idx_challenges_is_published ON challenges(is_published);
CREATE INDEX IF NOT EXISTS idx_challenges_topic ON challenges(topic);
CREATE INDEX IF NOT EXISTS idx_challenges_language ON challenges(language);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty); 
CREATE INDEX IF NOT EXISTS idx_tests_cases_challenge_id ON test_cases(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_challenge_id ON user_progress(challenge_id);