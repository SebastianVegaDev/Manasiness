import "./EntityDetailScreen.css"

import { useNavigate } from "react-router-dom"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"

export type EntityDetailItem = {
    label: string
    value: string
}

export type EntityDetailData = {
    id: string | number
    entity: string
    name: string
    image: string
    isActive: boolean
    details: EntityDetailItem[]
}

type EntityDetailScreenProps = {
    detail: EntityDetailData
    isLoading?: boolean
    isSubmitting?: boolean
    onDeactivateClick: () => void
    onActivateClick: () => void
}

function EntityDetailScreen({
    detail,
    isLoading = false,
    isSubmitting = false,
    onDeactivateClick,
    onActivateClick
}: EntityDetailScreenProps) {
    const navigate = useNavigate()
    const disabled = isLoading || isSubmitting

    return (
        <div className="shared-entity-detail-screen">
            <div className="shared-entity-detail-title">
                <h1>Id {detail.entity}: {detail.id}</h1>
            </div>

            <div className="shared-entity-detail-information">
                <div className="shared-entity-detail-image">
                    <img src={detail.image} alt={detail.name} />
                </div>

                <div className="shared-entity-detail-content">
                    <fieldset className="shared-entity-detail-box">
                        <legend>Name</legend>
                        <p>{detail.name}</p>
                    </fieldset>

                    {detail.details.map((item) => (
                        <fieldset className="shared-entity-detail-box" key={item.label}>
                            <legend>{item.label}</legend>
                            <p>{item.value}</p>
                        </fieldset>
                    ))}
                </div>
            </div>

            <div className="shared-entity-detail-actions">
                <button id="edit" type="button" onClick={() => navigate("edit")} disabled={disabled}>
                    Edit
                </button>
                <button
                    id="deactive"
                    type="button"
                    onClick={detail.isActive ? onDeactivateClick : onActivateClick}
                    disabled={disabled}
                >
                    {isSubmitting ? "Saving..." : detail.isActive ? "Deactivate" : "Activate"}
                </button>
            </div>

            {disabled ? <LoadingOverlay /> : null}
        </div>
    )
}

export default EntityDetailScreen
