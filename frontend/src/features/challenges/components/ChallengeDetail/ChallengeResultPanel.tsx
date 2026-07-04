import { Badge } from "../../../../shared/ui/Badge/Badge.tsx";
import { Card } from "../../../../shared/ui/Card/Card.tsx";
import { EmptyState } from "../../../../shared/ui/EmptyState/EmptyState.tsx";
import { ErrorState } from "../../../../shared/ui/ErrorState/ErrorState.tsx";
import type { ChallengeSubmission } from "../../types/challenge.types.ts";

type ChallengeResultPanelProps = {
    currentResult: ChallengeSubmission | null;
    submissionError: string;
};

export function ChallengeResultPanel({
    currentResult,
    submissionError,
}: ChallengeResultPanelProps) {
    return (
        <Card>
            <h2>Result panel</h2>

            {submissionError && <ErrorState message={submissionError} />}

            {currentResult ? (
                <div className="challenge-result-box">
                    <div className="challenge-detail-meta">
                        <Badge>{currentResult.status}</Badge>
                        <Badge>
                            {currentResult.passed_tests}/{currentResult.total_tests} tests
                        </Badge>
                        <Badge>score: {currentResult.score}</Badge>
                    </div>

                    <p>The judge ran your solution against the challenge test cases.</p>

                    {currentResult.error_message && (
                        <p>{currentResult.error_message}</p>
                    )}
                </div>
            ) : (
                <EmptyState
                    title="No result yet"
                    description="Click Run tests to save a pending submission."
                />
            )}
        </Card>
    );
}
