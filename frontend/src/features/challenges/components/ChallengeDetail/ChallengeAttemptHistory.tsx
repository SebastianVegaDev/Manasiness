import { Badge } from "../../../../shared/ui/Badge/Badge.tsx";
import { Card } from "../../../../shared/ui/Card/Card.tsx";
import { EmptyState } from "../../../../shared/ui/EmptyState/EmptyState.tsx";
import type { ChallengeSubmission } from "../../types/challenge.types.ts";

type ChallengeAttemptHistoryProps = {
    submissions: ChallengeSubmission[];
};

export function ChallengeAttemptHistory({
    submissions,
}: ChallengeAttemptHistoryProps) {
    return (
        <Card>
            <h2>Attempt history</h2>

            {submissions.length === 0 && (
                <EmptyState
                    title="No attempts yet"
                    description="Your saved submissions will appear here."
                />
            )}

            {submissions.length > 0 && (
                <div className="challenge-attempt-list">
                    {submissions.map((submission, index) => (
                        <article key={submission.id} className="challenge-attempt-item">
                            <div className="challenge-attempt-header">
                                <strong>Attempt #{submissions.length - index}</strong>
                                <Badge>{submission.status}</Badge>
                            </div>

                            <p className="challenge-detail-muted">
                                {new Date(submission.created_at).toLocaleString()}
                            </p>

                            <pre className="challenge-code-box">{submission.code}</pre>
                        </article>
                    ))}
                </div>
            )}
        </Card>
    );
}
