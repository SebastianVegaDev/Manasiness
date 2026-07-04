import "./CardCollectionGrid.css"

import { useNavigate } from "react-router-dom"

import type { CardCollectionItem } from "./CardCollectionScreen"

type CardCollectionGridProps = {
    items?: CardCollectionItem[] | undefined
    resourcePath: string
    emptyMessage?: string | undefined
}

function CardCollectionGrid({
    items = [],
    resourcePath,
    emptyMessage = "No records found"
}: CardCollectionGridProps) {
    const navigate = useNavigate()
    const safeItems = Array.isArray(items) ? items : []

    if (!safeItems.length) {
        return (
            <div className="shared-card-grid shared-card-grid-feedback">
                <div className="shared-card-grid-empty-state">
                    <span>No cards yet</span>
                    <h3>{emptyMessage}</h3>
                    <p>Create a first record or adjust the filters to see matching cards here.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="shared-card-grid">
            {safeItems.map((item) => (
                <div className="shared-card-item" key={item.id}>
                    <div className="shared-card-item-header">
                        <h3>{item.name}</h3>

                        {item.status ? (
                            <span className={`shared-card-status shared-card-status-${item.status.toLowerCase()}`}>
                                {item.status}
                            </span>
                        ) : null}
                    </div>

                    <img src={item.image} alt={item.name} />

                    {item.details?.length ? (
                        <div className="shared-card-details">
                            {item.details.map((detail, index) => (
                                <p key={`${item.id}-${index}`}>{detail}</p>
                            ))}
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => navigate(`/dashboard/${resourcePath}/${item.id}`)}
                    >
                        View
                    </button>
                </div>
            ))}
        </div>
    )
}

export default CardCollectionGrid
