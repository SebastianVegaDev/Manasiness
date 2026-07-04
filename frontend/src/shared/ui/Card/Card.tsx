import type { HTMLAttributes, ReactNode } from "react";
import "./Card.css";

type CardProps = HTMLAttributes<HTMLElement> & {
    children: ReactNode;
};

export function Card({ children, className = "", ...props}: CardProps) {
    return (
        <section className={`card ${className}`.trim()} {...props}>
            {children}
        </section>
    );
}