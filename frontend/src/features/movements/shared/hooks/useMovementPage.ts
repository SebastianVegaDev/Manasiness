import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { toast } from "react-toastify"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import { getApiErrorMessage } from "@shared/api/httpError"

import { createMovementWindowLabel } from "../utils/movementDateLabel.utils"
import {
    createMovementWindowQuery,
    getMovementTotalPage,
    normalizeMovementWindow
} from "../utils/movementWindow.utils"

import type { BootstrapData } from "@features/bootstrap/shared/types/bootstrap.types"
import type { FormValues } from "@shared/types/form.types"
import type { HistorySort } from "@shared/types/common.types"
import type {
    MovementApiWindowResponse,
    MovementField,
    MovementFieldsBuildResult,
    UseMovementPageInput,
    UseMovementPageState
} from "../types/movement.types"

function getBootstrapInitialWindow(
    bootstrapData: BootstrapData | null,
    bootstrapKey: string
): MovementApiWindowResponse | null {
    const initialWindow = bootstrapData?.initialWindows?.[bootstrapKey]

    return initialWindow
        ? initialWindow as MovementApiWindowResponse
        : null
}

function resolveFieldBuildResult(
    result: MovementFieldsBuildResult | MovementField[] | null | undefined
): MovementFieldsBuildResult {
    if (Array.isArray(result)) {
        return {
            fields: result,
            helperMessage: ""
        }
    }

    return {
        fields: result?.fields ?? [],
        helperMessage: result?.helperMessage ?? ""
    }
}

function getCurrencyCode(bootstrapData: BootstrapData | null): string {
    return (
        bootstrapData?.session?.store?.currency_code ||
        bootstrapData?.session?.store?.currencyCode ||
        "PEN"
    )
}

export function useMovementPage({
    config,
    getHistory,
    createRecord,
    buildFields,
    mapRows,
    updateBootstrapAfterCreate
}: UseMovementPageInput): UseMovementPageState {
    const bootstrap = useBootstrapData()
    const currencyCode = getCurrencyCode(bootstrap.data)

    const [sort, setSort] = useState<HistorySort>("recent")
    const [dayOffset, setDayOffset] = useState<number>(0)
    const [page, setPage] = useState<number>(1)

    const [windowData, setWindowData] = useState(() => {
        const initialWindow = getBootstrapInitialWindow(bootstrap.data, config.bootstrapKey)
        return normalizeMovementWindow(initialWindow)
    })

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const query = useMemo(() => {
        return createMovementWindowQuery({
            page,
            sort,
            dayOffset
        })
    }, [dayOffset, page, sort])

    const totalPage = useMemo(() => {
        return getMovementTotalPage(windowData.totalRows)
    }, [windowData.totalRows])

    const fieldBuildResult = useMemo(() => {
        return resolveFieldBuildResult(buildFields(bootstrap.data))
    }, [bootstrap.data, buildFields])

    const rows = useMemo(() => {
        return mapRows(windowData.raw, currencyCode)
    }, [currencyCode, mapRows, windowData.raw])

    const loadWindow = useCallback(async () => {
        const shouldUseBootstrap =
            page === 1 &&
            sort === "recent" &&
            dayOffset === 0

        const initialWindow = getBootstrapInitialWindow(bootstrap.data, config.bootstrapKey)

        if (shouldUseBootstrap && initialWindow) {
            setWindowData(normalizeMovementWindow(initialWindow))
            return
        }

        setIsLoading(true)

        try {
            const response = await getHistory(query)
            setWindowData(normalizeMovementWindow(response))
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, config.errorMessage))
        } finally {
            setIsLoading(false)
        }
    }, [
        bootstrap.data,
        config.bootstrapKey,
        config.errorMessage,
        dayOffset,
        getHistory,
        page,
        query,
        sort
    ])

    useEffect(() => {
        void loadWindow()
    }, [loadWindow])

    function handleSortChange(event: { target: { value: string } }): void {
        const nextSort = event.target.value === "oldest" ? "oldest" : "recent"

        setSort(nextSort)
        setPage(1)
    }

    function handleOlder(): void {
        if (!windowData.hasOlder) {
            return
        }

        setDayOffset((currentOffset) => currentOffset + 1)
        setPage(1)
    }

    function handleNewer(): void {
        if (!windowData.hasNewer) {
            return
        }

        setDayOffset((currentOffset) => Math.max(currentOffset - 1, 0))
        setPage(1)
    }

    function handlePrevPage(): void {
        setPage((currentPage) => Math.max(currentPage - 1, 1))
    }

    function handleNextPage(): void {
        setPage((currentPage) => {
            if (currentPage >= totalPage) {
                return currentPage
            }

            return currentPage + 1
        })
    }

    function openModal(): void {
        setIsModalOpen(true)
    }

    function closeModal(): void {
        if (isSubmitting) {
            return
        }

        setIsModalOpen(false)
    }

    async function handleSubmit(formData: FormValues): Promise<void> {
        if (isSubmitting) {
            return
        }

        setIsSubmitting(true)

        try {
            const payload = config.mapPayload(formData)
            const result = await createRecord(payload)

            const initialQuery = createMovementWindowQuery({
                page: 1,
                sort: "recent",
                dayOffset: 0
            })

            const latestWindow = await getHistory(initialQuery)

            updateBootstrapAfterCreate?.({
                bootstrap,
                result,
                payload,
                config,
                latestWindow
            })

            toast.success(config.successMessage)

            setIsModalOpen(false)
            setSort("recent")
            setDayOffset(0)
            setPage(1)
            setWindowData(normalizeMovementWindow(latestWindow))
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, config.createErrorMessage))
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        rows,
        totalRows: windowData.totalRows,
        startDate: windowData.startDate,
        endDate: windowData.endDate,
        windowLabel: createMovementWindowLabel(windowData.startDate, windowData.endDate),
        hasOlder: windowData.hasOlder,
        hasNewer: windowData.hasNewer,

        sort,
        page,
        totalPage,

        fields: fieldBuildResult.fields,
        helperMessage: fieldBuildResult.helperMessage,

        isLoading: isLoading || bootstrap.isLoading,
        isSubmitting,
        isModalOpen,

        handleSortChange,
        handleOlder,
        handleNewer,
        handlePrevPage,
        handleNextPage,
        openModal,
        closeModal,
        handleSubmit
    }
}

export default useMovementPage

