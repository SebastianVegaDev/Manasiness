import type { PendingScope } from "@features/finance/shared/types/finance.types"

type PendingScopeTabsProps = {
    scopes: PendingScope[]
    selectedScope: PendingScope
    onScopeChange: (event: { target: { value: string } }) => void
}

const SCOPE_LABELS: Record<PendingScope, string> = {
    sales: "Sales",
    orders: "Orders",
    staff: "Staff",
    customers: "Customers",
    suppliers: "Suppliers",
    workers: "Workers"
}

function PendingScopeTabs({
    scopes,
    selectedScope,
    onScopeChange
}: PendingScopeTabsProps) {
    const safeScopes = Array.isArray(scopes) ? scopes : []

    return (
        <div className="pending-scope-tabs" role="tablist">
            {safeScopes.map((scope) => {
                const isActive = selectedScope === scope

                return (
                    <button
                        key={scope}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={[
                            "pending-scope-tab",
                            isActive ? "pending-scope-tab-active" : ""
                        ].filter(Boolean).join(" ")}
                        onClick={() => {
                            onScopeChange({
                                target: {
                                    value: scope
                                }
                            })
                        }}
                    >
                        {SCOPE_LABELS[scope]}
                    </button>
                )
            })}
        </div>
    )
}

export default PendingScopeTabs
