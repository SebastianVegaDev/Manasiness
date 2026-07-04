import type { PendingConfig } from "../types/finance.types"

export const PENDING_CONFIG: PendingConfig = {
    scopes: ["sales", "orders", "staff"],
    defaultScope: "sales",
    title: "Pending",
    subtitle: "Review and complete pending payments.",
    emptyMessage: "No pending records found.",
    loadErrorMessage: "Could not load pending records",
    updateSuccessMessage: "Pending record marked as paid",
    updateErrorMessage: "Could not update pending record"
}

