import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
};

export function Button({
    children,
    variant = "primary",
    type = "button",
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`button button--${variant} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    )
}