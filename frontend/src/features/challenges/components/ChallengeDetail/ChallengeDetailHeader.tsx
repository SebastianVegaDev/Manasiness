import { Link } from "react-router-dom";

type ChallengeDetailHeaderProps = {
    title: string;
    slug: string;
};

export function ChallengeDetailHeader({
    title,
    slug,
}: ChallengeDetailHeaderProps) {
    return (
        <div className="challenge-detail-header">
            <div>
                <h1>{title}</h1>
                <p className="challenge-detail-muted">/{slug}</p>
            </div>

            <Link className="challenge-detail-link" to="/challenges">
                Back to challenges
            </Link>
        </div>
    );
}
