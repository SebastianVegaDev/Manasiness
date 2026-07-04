import MovementRegisterForm from "@features/movements/components/MovementRegisterForm/MovementRegisterForm"
import {
    createStaff,
    getStaffHistory
} from "@features/movements/shared/api/movements.api"
import { MOVEMENT_PAGE_CONFIG } from "@features/movements/shared/config/movementPages.config"
import { buildStaffFields } from "@features/movements/shared/fields/movementFields.builders"
import { useMovementPage } from "@features/movements/shared/hooks/useMovementPage"
import { updateStaffBootstrapAfterCreate } from "@features/movements/shared/utils/movementBootstrap.utils"
import { mapStaffToTables } from "@features/movements/staff/mappers/staff.mapper"
import TableHistoryScreen from "@shared/ui/screens/table-history/TableHistoryScreen"

import type { TableHistoryColumn } from "@shared/types/tableHistory.types"

const STAFF_COLUMNS: TableHistoryColumn[] = [
    { key: "date", label: "Date" },
    { key: "worker", label: "Worker" },
    { key: "salary", label: "Salary", align: "right" },
    { key: "state", label: "State" }
]

function StaffPage() {
    const config = MOVEMENT_PAGE_CONFIG.staff

    const movement = useMovementPage({
        config,
        getHistory: getStaffHistory,
        createRecord: createStaff,
        buildFields: buildStaffFields,
        mapRows: mapStaffToTables,
        updateBootstrapAfterCreate: updateStaffBootstrapAfterCreate
    })

    return (
        <>
            <TableHistoryScreen
                title={config.title}
                subtitle={config.subtitle}
                rows={movement.rows}
                columns={STAFF_COLUMNS}
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

export default StaffPage
