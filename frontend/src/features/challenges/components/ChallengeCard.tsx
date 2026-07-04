import { Link } from "react-router-dom";
import { Badge } from "../../../shared/ui/Badge/Badge.tsx";
import { Card } from "../../../shared/ui/Card/Card.tsx";
import type { PublicChallenge } from "../types/challenge.types.ts";
import "./ChallengeCard.css";

type ChallengeCardProps = {
    challenge: PublicChallenge;
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
    return (
        <Card className="challenge-card">
            <div className="challenge-card-header">
                <div>
                    <h2>{challenge.title}</h2>
                    <p className="challenge-card-slug">/{challenge.slug}</p>
                </div>
                <Badge>{challenge.solved ? "solved" : "unsolved"}</Badge>
            </div>
            <p>{challenge.description}</p>
            <div className="challenge-card-meta">
                <Badge>{challenge.difficulty}</Badge>
                <Badge>{challenge.topic}</Badge>
                <Badge>{challenge.language}</Badge>
                <Badge>fn: {challenge.function_name}</Badge>
            </div>
            <Link className="challenge-card-link" to={`/challenges/${challenge.slug}`}>
                Open challenge
            </Link>
        </Card>
    )
}