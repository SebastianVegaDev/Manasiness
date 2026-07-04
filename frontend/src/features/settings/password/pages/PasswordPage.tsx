import { SETTINGS_FORM_CONFIG } from "@features/settings/shared/config/settingsForms.config"
import { useSettingsFormPage } from "@features/settings/shared/hooks/useSettingsFormPage"
import SettingsFormScreen from "@shared/ui/screens/settings-form/SettingsFormScreen"

function PasswordPage() {
    const config = SETTINGS_FORM_CONFIG.password
    const settings = useSettingsFormPage(config)

    return (
        <SettingsFormScreen
            title={config.title}
            subtitle={config.subtitle ?? ""}
            fields={settings.fields}
            values={settings.values}
            onSubmit={settings.handleSubmit}
            onCancel={settings.handleCancel}
            isLoading={settings.isLoading}
            isSubmitting={settings.isSubmitting}
        />
    )
}

export default PasswordPage
