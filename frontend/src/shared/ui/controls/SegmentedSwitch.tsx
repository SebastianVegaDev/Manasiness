import "./SegmentedSwitch.css"

type SegmentedSwitchOption = {
    value: string
    label: string
    disabled?: boolean
}

type SegmentedSwitchProps = {
    value: string
    options: SegmentedSwitchOption[]
    onChange: (event: { target: { value: string } }) => void
    className?: string
    optionClassName?: string
    activeOptionClassName?: string
    backgroundClassName?: string
    name?: string
    idPrefix?: string
}

function SegmentedSwitch({
    value,
    options,
    onChange,
    className = "shared-segmented-switch",
    optionClassName = "shared-segmented-switch-option",
    activeOptionClassName = "shared-segmented-switch-option-active",
    backgroundClassName = "",
    name = "segmented-switch",
    idPrefix = "segmented-switch-option"
}: SegmentedSwitchProps) {
    const safeOptions = Array.isArray(options) ? options : []

    return (
        <div className={className} role="group">
            {backgroundClassName ? (
                <span className={backgroundClassName} aria-hidden="true" />
            ) : null}

            {safeOptions.map((option) => {
                const isActive = option.value === value
                const inputId = `${idPrefix}-${option.value}`

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={[
                            optionClassName,
                            isActive ? activeOptionClassName : ""
                        ].filter(Boolean).join(" ")}
                        disabled={option.disabled}
                        aria-pressed={isActive}
                        onClick={() => {
                            onChange({
                                target: {
                                    value: option.value
                                }
                            })
                        }}
                    >
                        <input
                            id={inputId}
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={isActive}
                            readOnly
                            hidden
                        />

                        <span>{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default SegmentedSwitch
