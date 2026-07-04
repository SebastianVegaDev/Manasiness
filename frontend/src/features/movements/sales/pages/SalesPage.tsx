import MovementRegisterForm from "@features/movements/components/MovementRegisterForm/MovementRegisterForm"
import {
    createSale,
    getSalesHistory
} from "@features/movements/shared/api/movements.api"
import { MOVEMENT_PAGE_CONFIG } from "@features/movements/shared/config/movementPages.config"
import { buildSaleFields } from "@features/movements/shared/fields/movementFields.builders"
import { useMovementPage } from "@features/movements/shared/hooks/useMovementPage"
import { updateSalesBootstrapAfterCreate } from "@features/movements/shared/utils/movementBootstrap.utils"
import { mapSalesToTables } from "@features/movements/sales/mappers/sales.mapper"
import TableHistoryScreen from "@shared/ui/screens/table-history/TableHistoryScreen"

import type { TableHistoryColumn } from "@shared/types/tableHistory.types"

const SALES_COLUMNS: TableHistoryColumn[] = [
    { key: "date", label: "Date" },
    { key: "product", label: "Product" },
    { key: "customer", label: "Customer" },
    { key: "price", label: "Price", align: "right" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "state", label: "State" }
]

function SalesPage() {
    const config = MOVEMENT_PAGE_CONFIG.sales

    const movement = useMovementPage({
        config,
        getHistory: getSalesHistory,
        createRecord: createSale,
        buildFields: buildSaleFields,
        mapRows: mapSalesToTables,
        updateBootstrapAfterCreate: updateSalesBootstrapAfterCreate
    })

    return (
        <>
            <TableHistoryScreen
                title={config.title}
                subtitle={config.subtitle}
                rows={movement.rows}
                columns={SALES_COLUMNS}
                sortValue={movement.sort}
                onSortChange={movement.handleSortChange}
                windowLabel={movement.windowLabel}
                hasOlder={movement.hasOlder}
                hasNewer={movement.hasNewer}
                onOlder={movement.handleOlder}
                onNewer={movement.handleNewer}
                page={movement.page}
                totalPage={movement.totalPage}
                onPrevPage={movement.handlePrevPage}
                onNextPage={movement.handleNextPage}
                onRegisterClick={movement.openModal}
                emptyMessage={config.emptyMessage}
                isLoading={movement.isLoading}
            />

            {movement.isModalOpen ? (
                <MovementRegisterForm
                    title={config.modalTitle}
                    sectionLabel={config.modalSectionLabel}
                    fields={movement.fields}
                    helperMessage={movement.helperMessage}
                    isSubmitting={movement.isSubmitting}
                    onClose={movement.closeModal}
                    onSubmit={movement.handleSubmit}
                />
            ) : null}
        </>
    )
}

export default SalesPage
