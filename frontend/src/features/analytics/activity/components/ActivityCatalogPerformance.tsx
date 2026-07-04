import "./ActivityCatalogPerformance.css"

import SegmentedSwitch from "@shared/ui/controls/SegmentedSwitch"

import type {
    ActivityCatalogOption,
    ActivityCatalogPerformance as ActivityCatalogPerformanceData,
    ActivityChangeEvent
} from "../shared/types/activity.types"
import type { SelectOption } from "@shared/types/form.types"

type ActivityCatalogPerformanceProps = {
    catalogPerformance: ActivityCatalogPerformanceData | null
    catalogOption: ActivityCatalogOption
    catalogOptions: SelectOption[]
    onCatalogOptionChange: (event: ActivityChangeEvent) => void
}

function ActivityCatalogPerformance({
    catalogPerformance,
    catalogOption,
    catalogOptions,
    onCatalogOptionChange
}: ActivityCatalogPerformanceProps) {
    const emptyCatalog = !catalogPerformance?.categoryName && !catalogPerformance?.productName

    return (
        <div className="activity-content-catalog-performance">
            <div className="catalog-performance-title">
                <h1>Catalog Performance</h1>

                <SegmentedSwitch
                    value={catalogOption}
                    onChange={onCatalogOptionChange}
                    options={catalogOptions}
                    name="activityCatalogOptions"
                    idPrefix="activity-catalog-option"
                    className="activity-content-filter-switch"
                    optionClassName="activity-content-filter-option"
                    backgroundClassName="activity-content-filter-background"
                />
            </div>

            {emptyCatalog ? (
                <div className="catalog-performance-empty">
                    <span>Catalog is quiet</span>
                    <h3>No paid sales found for this period.</h3>
                    <p>When sales are paid, the top category and product will appear in this space.</p>
                </div>
            ) : null}

            {!emptyCatalog ? (
                <div className="catalog-performance-content">
                    <div className="catalog-performance-content-item">
                        <h2>Category</h2>
                        <img
                            src={catalogPerformance?.categoryImg}
                            alt="category performance"
                        />
                        <h3>{catalogPerformance?.categoryName ?? "No data"}</h3>
                        <h4>Quantity: {catalogPerformance?.categoryQuantity ?? 0}</h4>
                    </div>

                    <div className="catalog-performance-content-item">
                        <h2>Product</h2>
                        <img
                            src={catalogPerformance?.productImg}
                            alt="product performance"
                        />
                        <h3>{catalogPerformance?.productName ?? "No data"}</h3>
                        <h4>Quantity: {catalogPerformance?.productQuantity ?? 0}</h4>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default ActivityCatalogPerformance
