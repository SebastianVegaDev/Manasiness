import type {
    CurrencyCode,
    EntityId,
    HistorySort,
    MovementState
} from "@shared/types/common.types"
import type {
    BootstrapContextValue,
    BootstrapData
} from "@features/bootstrap/shared/types/bootstrap.types"
import type { FormValues, SelectOption } from "@shared/types/form.types"

export type MovementScope = "sales" | "orders" | "staff"

export type MovementHistoryParams = {
    sort?: HistorySort | string
    page?: number
    offset?: number
    dayOffset?: number
    period?: "day" | string
    limit?: number
    rowOffset?: number
    orderDirection?: "ASC" | "DESC"
}

export type MovementApiWindowResponse = {
    rows?: MovementRecord[]
    data?: MovementRecord[]
    total_rows?: number | string
    totalRows?: number | string
    start_date?: string | null
    startDate?: string | null
    end_date?: string | null
    endDate?: string | null
    has_older?: boolean
    hasOlder?: boolean
    has_newer?: boolean
    hasNewer?: boolean
    [key: string]: unknown
}

export type MovementWindowState = {
    rows: MovementRecord[]
    totalRows: number
    startDate: string | null
    endDate: string | null
    hasOlder: boolean
    hasNewer: boolean
    raw: MovementApiWindowResponse | null
}

export type MovementRecord = {
    id: EntityId
    date?: string | null
    created_at?: string | null
    createdAt?: string | null
    product?: string
    customer?: string
    supplier?: string
    worker?: string
    price?: number | string
    salary?: number | string
    quantity?: number | string
    state?: MovementState | string
    product_id?: EntityId
    user_id?: EntityId
    [key: string]: unknown
}

export type MovementTableRow = {
    id: EntityId
    date?: string
    product?: string
    customer?: string
    supplier?: string
    worker?: string
    price?: string
    salary?: string
    quantity?: number | string
    state?: string
    [key: string]: unknown
}

export type MovementFieldOption = SelectOption & {
    isDefault?: boolean
    disabledWhen?: (formValues: FormValues) => boolean
    disabledLabel?: string
}

export type MovementField = {
    id: string
    name: string
    label: string
    placeholder?: string
    type?: string
    required?: boolean
    defaultValue?: string | number
    min?: string | number
    step?: string | number
    inputMode?: "text" | "numeric" | "decimal" | "email" | "tel" | "url" | "search"
    disabled?: boolean
    options?: MovementFieldOption[]
}

export type MovementFieldsBuildResult = {
    fields: MovementField[]
    helperMessage: string
}

export type ProductMovementPayload = {
    product_id: number
    user_id: number
    quantity: number
    state: string
}

export type StaffMovementPayload = {
    user_id: number
    salary: number
    state: string
}

export type MovementPayload = ProductMovementPayload | StaffMovementPayload

export type MovementPageConfig = {
    title: string
    subtitle: string
    modalTitle: string
    modalSectionLabel: string
    emptyMessage: string
    bootstrapKey: MovementScope
    successMessage: string
    errorMessage: string
    createErrorMessage: string
    mapPayload: (formData: FormValues) => MovementPayload
}

export type MovementBootstrapAfterCreateInput = {
    bootstrap: BootstrapContextValue
    result: unknown
    payload: MovementPayload
    config: MovementPageConfig
    latestWindow: MovementApiWindowResponse | null
}

export type UseMovementPageInput = {
    config: MovementPageConfig
    getHistory: (params: MovementHistoryParams) => Promise<MovementApiWindowResponse>
    createRecord: (payload: MovementPayload) => Promise<unknown>
    buildFields: (bootstrapData: BootstrapData | null) => MovementFieldsBuildResult | MovementField[]
    mapRows: (data: MovementApiWindowResponse | null, currencyCode: CurrencyCode | string) => MovementTableRow[]
    updateBootstrapAfterCreate?: (data: MovementBootstrapAfterCreateInput) => void
}

export type UseMovementPageState = {
    rows: MovementTableRow[]
    totalRows: number
    startDate: string | null
    endDate: string | null
    windowLabel: string
    hasOlder: boolean
    hasNewer: boolean
    sort: HistorySort
    page: number
    totalPage: number
    fields: MovementField[]
    helperMessage: string
    isLoading: boolean
    isSubmitting: boolean
    isModalOpen: boolean
    handleSortChange: (event: { target: { value: string } }) => void
    handleOlder: () => void
    handleNewer: () => void
    handlePrevPage: () => void
    handleNextPage: () => void
    openModal: () => void
    closeModal: () => void
    handleSubmit: (formData: FormValues) => Promise<void>
}

