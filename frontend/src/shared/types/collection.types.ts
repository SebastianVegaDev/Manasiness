import type { BootstrapData, BootstrapUpdater } from "@features/bootstrap/shared/types/bootstrap.types"
import type { CurrencyCode } from "@shared/types/common.types"
import type { SelectOption } from "@shared/types/form.types"

export type CollectionFilterValue = string

export type CollectionFilters = Record<string, CollectionFilterValue>

export type CollectionFilterChangeEvent = {
    target: {
        value: string
    }
}

export type CollectionFilterGroup = {
    key: string
    label: string
    value: string
    onChange: (event: CollectionFilterChangeEvent) => void
    options: SelectOption[]
}

export type CollectionContext<TOptions extends Record<string, unknown> = Record<string, unknown>> = {
    bootstrapData: BootstrapData | null
    updateBootstrap: (updater: BootstrapUpdater) => void
    currencyCode: CurrencyCode | string
    options: TOptions
}

export type CollectionState<TOptions extends Record<string, unknown> = Record<string, unknown>> = {
    filters: CollectionFilters
    options: TOptions
    setFilter: (key: string, value: string) => void
    createFilterChangeHandler: (key: string) => (event: CollectionFilterChangeEvent) => void
    context: CollectionContext<TOptions>
}

export type CollectionParamsInput<TOptions extends Record<string, unknown> = Record<string, unknown>> = {
    search: string
    filters: CollectionFilters
    context: CollectionContext<TOptions>
}

export type CollectionPageConfig<
    TRawItems = unknown,
    TMappedItem = unknown,
    TParams = Record<string, unknown>,
    TOptions extends Record<string, unknown> = Record<string, unknown>
> = {
    title: string
    subtitle?: string
    searchLabel: string
    resourcePath: string
    emptyMessage: string

    initialFilters?: CollectionFilters

    getOptions?: (context: CollectionContext<TOptions>) => Promise<TOptions> | TOptions

    mapParams?: (input: CollectionParamsInput<TOptions>) => TParams

    getItems: (params: TParams, context: CollectionContext<TOptions>) => Promise<TRawItems> | TRawItems

    mapItems: (data: TRawItems, context: CollectionContext<TOptions>) => TMappedItem[]

    createItem?: (formData: unknown, context: CollectionContext<TOptions>) => Promise<unknown> | unknown

    createSuccessMessage?: string
    createErrorMessage?: string
    loadErrorMessage?: string

    buildFilterGroups?: (state: CollectionState<TOptions>) => CollectionFilterGroup[]
}

export type CollectionPageState<TMappedItem = unknown> = {
    items: TMappedItem[]
    filters: CollectionFilters
    searchInput: string
    filterGroups: CollectionFilterGroup[]
    resultsCount: number
    isLoading: boolean
    isCreateModalOpen: boolean

    handleSearchChange: (event: { target: { value: string } }) => void
    setFilter: (key: string, value: string) => void
    createFilterChangeHandler: (key: string) => (event: CollectionFilterChangeEvent) => void

    openCreateModal: () => void
    closeCreateModal: () => void
    handleCreate: (formData: unknown) => Promise<void>
    reload: () => Promise<void>
}
