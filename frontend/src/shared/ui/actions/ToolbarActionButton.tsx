import "./ToolbarActionButton.css"

import type { ComponentType } from "react"

type ToolbarActionButtonProps = {
    label: string
    icon?: ComponentType<{ size?: number; strokeWidth?: number }>
    onClick?: () => void
    className?: string
    type?: "button" | "submit" | "reset"
    disabled?: boolean
}

function ToolbarActionButton({
    label,
    icon: Icon,
    onClick,
    className = "",
    type = "button",
    disabled = false
}: ToolbarActionButtonProps) {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {Icon ? <Icon size={22} strokeWidth={2.2} /> : null}
            <span>{label}</span>
        </button>
    )
}

export default ToolbarActionButton
