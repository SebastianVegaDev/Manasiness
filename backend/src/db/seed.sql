INSERT INTO users (username, email, password_hash, role)
VALUES (
    'admin',
    'admin@devjudge.local',
    '$2b$10$jYpBz73QETQxg85VwnkieuXX/THWgwZoFHPPlwXn6az1rx83xY0oO',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO challenges (
    title,
    slug,
    description,
    difficulty,
    topic,
    language,
    starter_code,
    function_name,
    is_published,
    created_by
)
VALUES (
    'Sum Two Numbers',
    'sum-two-numbers',
    'Given two numbers, return their sum.',
    'easy',
    'basics',
    'javascript',
    'function sum(a, b) {
    // Write your code here
    }
    
    module.exports = sum;',
    'sum',
    true,
    (SELECT id FROM users WHERE email = 'admin@devjudge.local')
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    difficulty = EXCLUDED.difficulty,
    topic = EXCLUDED.topic,
    language = EXCLUDED.language,
    starter_code = EXCLUDED.starter_code,
    function_name = EXCLUDED.function_name,
    is_published = EXCLUDED.is_published,
    updated_at = NOW();

DELETE from test_cases
WHERE challenge_id = (
    SELECT id FROM challenges WHERE slug = 'sum-two-numbers'
);

INSERT INTO test_cases (
    challenge_id,
    input,
    expected_output,
    input_json,
    expected_output_json,
    is_hidden,
    comparator,
    sort_order
)
VALUES
(
    (SELECT id FROM challenges WHERE slug = 'sum-two-numbers'),
    '[1, 2]',
    '3',
    '[1, 2]'::jsonb,
    '3'::jsonb,
    false,
    'exact',
    1
),
(
    (SELECT id FROM challenges WHERE slug = 'sum-two-numbers'),
    '[10, 15]',
    '25',
    '[10, 15]'::jsonb,
    '25'::jsonb,
    false,
    'exact',
    2
),
(
    (SELECT id FROM challenges WHERE slug = 'sum-two-numbers'),
    '[-5, 12]',
    '7',
    '[-5, 12]'::jsonb,
    '7'::jsonb,
    true,
    'exact',
    3
);