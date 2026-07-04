import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { toast } from "react-toastify"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import { getApiErrorMessage } from "@shared/api/httpError"
import useDebouncedValue from "@shared/hooks/useDebouncedValue"

import type {
    CollectionContext,
    CollectionFilterChangeEvent,
    CollectionFilterGroup,
    CollectionFilters,
    CollectionPageConfig,
    CollectionPageState
} from "@shared/types/collection.types"
import type { BootstrapData } from "@features/bootstrap/shared/types/bootstrap.types"
import type { CurrencyCode } from "@shared/types/common.types"

function getCurrencyCode(bootstrapData: BootstrapData | null): CurrencyCode | string {
    return (
        bootstrapData?.session?.store?.currency_code ||
        bootstrapData?.session?.store?.currencyCode ||
        "PEN"
    )
}

function createDefaultFilterGroups<
    TRawItems,
    TMappedItem,
    TParams,
    TOptions extends Record<string, unknown>
>(
    config: CollectionPageConfig<TRawItems, TMappedItem, TParams, TOptions>,
    state: {
        filters: CollectionFilters
        options: TOptions
        setFilter: (key: string, value: string) => void
        createFilterChangeHandler: (key: string) => (event: CollectionFilterChangeEvent) => void
        context: CollectionContext<TOptions>
    }
): CollectionFilterGroup[] {
    if (!config.buildFilterGroups) {
        return []
    }

    return config.buildFilterGroups(state)
}

export function useCollectionPage<
    TRawItems = unknown,
    TMappedItem = unknown,
    TParams = Record<string, unknown>,
    TOptions extends Record<string, unknown> = Record<string, unknown>
>(
    config: CollectionPageConfig<TRawItems, TMappedItem, TParams, TOptions>
): CollectionPageState<TMappedItem> {
    const bootstrap = useBootstrapData()

    const [items, setItems] = useState<TMappedItem[]>([])
    const [options, setOptions] = useState<TOptions>({} as TOptions)
    const [filters, setFilters] = useState<CollectionFilters>(config.initialFilters ?? {})
    const [searchInput, setSearchInput] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)

    const searchTerm = useDebouncedValue(searchInput)

    const currencyCode = useMemo(() => {
        return getCurrencyCode(bootstrap.data)
    }, [bootstrap.data])

    const optionsLoaderContext = useMemo<CollectionContext<TOptions>>(() => {
        return {
            bootstrapData: bootstrap.data,
            updateBootstrap: bootstrap.updateBootstrap,
            currencyCode,
            options: {} as TOptions
        }
    }, [bootstrap.data, bootstrap.updateBootstrap, currencyCode])

    const context = useMemo<CollectionContext<TOptions>>(() => {
        return {
            bootstrapData: bootstrap.data,
            updateBootstrap: bootstrap.updateBootstrap,
            currencyCode,
            options
        }
    }, [bootstrap.data, bootstrap.updateBootstrap, currencyCode, options])

    const params = useMemo<TParams>(() => {
        if (config.mapParams) {
            return config.mapParams({
                search: searchTerm,
                filters,
                context
            })
        }

        return {
            search: searchTerm,
            ...filters
        } as TParams
    }, [config, context, filters, searchTerm])

    const loadOptions = useCallback(async () => {
        if (!config.getOptions) {
            return
        }

        try {
            const nextOptions = await config.getOptions(optionsLoaderContext)
            setOptions((nextOptions ?? {}) as TOptions)
        } catch (caughtError) {
            console.error(caughtError)
            setOptions({} as TOptions)
        }
    }, [config, optionsLoaderContext])

    const loadItems = useCallback(async () => {
        setIsLoading(true)

        try {
            const response = await config.getItems(params, context)
            const mappedItems = config.mapItems(response, context)

            setItems(Array.isArray(mappedItems) ? mappedItems : [])
        } catch (caughtError) {
            console.error(caughtError)
            setItems([])
            toast.error(getApiErrorMessage(caughtError, config.loadErrorMessage ?? "Could not load information"))
        } finally {
            setIsLoading(false)
        }
    }, [config, context, params])

    useEffect(() => {
        void loadOptions()
    }, [loadOptions])

    useEffect(() => {
        void loadItems()
    }, [loadItems])

    function handleSearchChange(event: { target: { value: string } }): void {
        setSearchInput(event.target.value)
    }

    const setFilter = useCallback((key: string, value: string): void => {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [key]: value
        }))
    }, [])

    const createFilterChangeHandler = useCallback((key: string) => {
        return function handleFilterChange(event: CollectionFilterChangeEvent): void {
            setFilter(key, event.target.value)
        }
    }, [setFilter])

    async function handleCreate(formData: unknown): Promise<void> {
        if (!config.createItem) {
            return
        }

        try {
            await config.createItem(formData, context)
            await loadItems()

            setIsCreateModalOpen(false)
            toast.success(config.createSuccessMessage ?? "Created successfully")
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, config.createErrorMessage ?? "Could not create information"))
        }
    }

    const filterGroups = useMemo(() => {
        return createDefaultFilterGroups(config, {
            filters,
            options,
            setFilter,
            createFilterChangeHandler,
            context
        })
    }, [config, context, createFilterChangeHandler, filters, options, setFilter])

    return {
        items,
        filters,
        searchInput,
        filterGroups,
        resultsCount: items.length,
        isLoading: isLoading || bootstrap.isLoading,
        isCreateModalOpen,

        handleSearchChange,
        setFilter,
        createFilterChangeHandler,

        openCreateModal: () => setIsCreateModalOpen(true),
        closeCreateModal: () => setIsCreateModalOpen(false),
        handleCreate,
        reload: loadItems
    }
}

export default useCollectionPage
