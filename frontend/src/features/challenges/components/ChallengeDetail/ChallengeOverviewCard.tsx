import { Badge } from "../../../../shared/ui/Badge/Badge.tsx";
import { Card } from "../../../../shared/ui/Card/Card.tsx";
import type { PublicChallengeDetail } from "../../types/challenge.types.ts";

type ChallengeOverviewCardProps = {
    challenge: PublicChallengeDetail;
};

export function ChallengeOverviewCard({
    challenge,
}: ChallengeOverviewCardProps) {
    return (
        <Card>
            <div className="challenge-detail-meta">
                <Badge>{challenge.difficulty}</Badge>
                <Badge>{challenge.topic}</Badge>
                <Badge>{challenge.language}</Badge>
                <Badge>fn: {challenge.function_name}</Badge>
            </div>

            <p className="challenge-detail-description">{challenge.description}</p>
        </Card>
    );
}
