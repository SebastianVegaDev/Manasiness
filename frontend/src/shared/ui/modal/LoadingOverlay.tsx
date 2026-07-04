import "./LoadingOverlay.css"

function LoadingOverlay() {
    return (
        <div className="shared-loading-overlay">
            <div className="shared-loading-overlay-modal">
                <div className="shared-loading-overlay-spinner" />
                <p>Loading...</p>
            </div>
        </div>
    )
}

export default LoadingOverlay
