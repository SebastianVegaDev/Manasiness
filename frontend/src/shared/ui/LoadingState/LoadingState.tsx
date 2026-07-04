import "./LoadingState.css";

type LoadingStateProps = {
    message?: string;
};

export function LoadingState({ message = "Loading..."}: LoadingStateProps) {
    return (
        <div className="loading-state">
            <p>{message}</p>
        </div>
    )
}