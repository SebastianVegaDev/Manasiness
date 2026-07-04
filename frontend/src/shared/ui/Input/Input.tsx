import type { InputHTMLAttributes } from "react";
import "./Input.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
    const inputId = id ?? props.name;

    return (
        <label
            className={`input-field ${className}`.trim()}
            htmlFor={inputId}
        >
            <span>{label}</span>
            <input id={inputId} {...props}></input>
            {error && <small>{error}</small>}
        </label>
    )
}