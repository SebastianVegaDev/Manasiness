import { Button } from "../../../../shared/ui/Button/Button.tsx";
import { Card } from "../../../../shared/ui/Card/Card.tsx";

type ChallengeCodeWorkspaceProps = {
    starterCode: string;
    code: string;
    isSubmitting: boolean;
    onCodeChange: (code: string) => void;
    onRunTests: () => void;
    onResetCode: () => void;
};

export function ChallengeCodeWorkspace({
    starterCode,
    code,
    isSubmitting,
    onCodeChange,
    onRunTests,
    onResetCode,
}: ChallengeCodeWorkspaceProps) {
    return (
        <div className="challenge-detail-grid">
            <Card>
                <h2>Starter code</h2>
                <pre className="challenge-code-box">{starterCode}</pre>
            </Card>

            <Card>
                <h2>Your solution</h2>

                <textarea
                    className="challenge-code-editor"
                    value={code}
                    onChange={(event) => onCodeChange(event.target.value)}
                    spellCheck={false}
                />

                <div className="challenge-detail-actions">
                    <Button
                        onClick={onRunTests}
                        disabled={!code.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Run tests"}
                    </Button>

                    <Button variant="secondary" onClick={onResetCode}>
                        Reset code
                    </Button>
                </div>
            </Card>
        </div>
    );
}
