import type { ReactNode } from "react";
import "./Badge.css";

type BadgeProps = {
    children: ReactNode;
};

export function Badge({ children }: BadgeProps) {
    return <span className="badge">{children}</span>;
}