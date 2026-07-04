import "./SettingsFormScreen.css"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"
import PageTitle from "@shared/ui/titles/page/PageTitle"
import SettingsFormContent from "./SettingsFormContent"

import type { SettingsFormScreenProps } from "@features/settings/shared/types/settings.types"

function SettingsFormScreen({ title, subtitle, fields, values, onSubmit, onCancel, isLoading = false, isSubmitting = false }: SettingsFormScreenProps) {
    return (
        <div className="shared-config-layout">
            <PageTitle title={title} subtitle={subtitle} />
            <SettingsFormContent fields={fields} values={values} onSubmit={onSubmit} onCancel={onCancel} isLoading={isLoading} isSubmitting={isSubmitting} />
            {isLoading || isSubmitting ? <LoadingOverlay /> : null}
        </div>
    )
}

export default SettingsFormScreen
