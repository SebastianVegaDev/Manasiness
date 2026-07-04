import {
    useEffect,
    useState
} from "react"
import {
    useNavigate,
    useParams
} from "react-router-dom"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import PersonHistoryScreen from "@shared/ui/screens/person-history/PersonHistoryScreen"

import { getSupplierById } from "../api/suppliers.api"
import {
    mapSupplierToDetail,
    mapSuppliersTotalPage
} from "../mappers/suppliers.mapper"

import type { HistorySort } from "@shared/types/common.types"
import type {
    PersonHistoryApiResponse,
    PersonHistoryDetail,
    PersonHistorySortChangeEvent
} from "@shared/types/personHistory.types"

function getCurrencyCode(data: unknown): string {
    const bootstrapData = data as {
        session?: {
            store?: {
                currency_code?: string
                currencyCode?: string
            }
        }
    } | null

    return (
        bootstrapData?.session?.store?.currency_code ||
        bootstrapData?.session?.store?.currencyCode ||
        "PEN"
    )
}

function SupplierDetailPage() {
    const bootstrap = useBootstrapData()
    const currencyCode = getCurrencyCode(bootstrap.data)
    const { id } = useParams()
    const navigate = useNavigate()

    const [detail, setDetail] = useState<PersonHistoryDetail | null>(null)
    const [hasError, setHasError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sortOrder, setSortOrder] = useState<HistorySort>("recent")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(1)
    const [dayOffset, setDayOffset] = useState<number>(0)

    useEffect(() => {
        async function fetchSupplierDetail(): Promise<void> {
            if (!id) {
                setHasError(true)
                setIsLoading(false)
                return
            }

            try {
                setHasError(false)
                setIsLoading(true)

                const response: PersonHistoryApiResponse = await getSupplierById(id, {
                    sort: sortOrder,
                    page: currentPage,
                    offset: dayOffset,
                    period: "day"
                })

                setDetail(mapSupplierToDetail(response, currencyCode))
                setTotalPage(mapSuppliersTotalPage(response))
            } catch (caughtError) {
                console.error(caughtError)
                setDetail(null)
                setTotalPage(1)
                setHasError(true)
            } finally {
                setIsLoading(false)
            }
        }

        void fetchSupplierDetail()
    }, [
        id,
        sortOrder,
        currentPage,
        dayOffset,
        currencyCode
    ])

    function handleSortChange(event: PersonHistorySortChangeEvent): void {
        setSortOrder(event.target.value === "oldest" ? "oldest" : "recent")
        setCurrentPage(1)
    }

    function handleNextPage(): void {
        setCurrentPage((currentValue) => currentValue >= totalPage ? currentValue : currentValue + 1)
    }

    function handlePrevPage(): void {
        setCurrentPage((currentValue) => Math.max(currentValue - 1, 1))
    }

    function handleOlder(): void {
        if (!detail?.hasOlder) return
        setDayOffset((currentValue) => currentValue + 1)
        setCurrentPage(1)
    }

    function handleNewer(): void {
        if (!detail?.hasNewer) return
        setDayOffset((currentValue) => Math.max(currentValue - 1, 0))
        setCurrentPage(1)
    }

    if (hasError || (!detail && !isLoading)) {
        return (
            <div>
                <h2>Could not load supplier</h2>
                <button type="button" onClick={() => navigate("/dashboard/suppliers")}>
                    Back
                </button>
            </div>
        )
    }

    return (
        <PersonHistoryScreen
            title="Supplier"
            name={detail?.name ?? ""}
            rows={detail?.details ?? []}
            columns={["Date", "Product", "Price", "Quantity", "State"]}
            sectionTitle="Orders"
            sortValue={sortOrder}
            onSortChange={handleSortChange}
            windowLabel={detail?.windowLabel ?? ""}
            hasOlder={detail?.hasOlder ?? false}
            hasNewer={detail?.hasNewer ?? false}
            onOlder={handleOlder}
            onNewer={handleNewer}
            currentPage={currentPage}
            totalPage={totalPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            isLoading={isLoading}
            emptyMessage="No orders found in this date."
        />
    )
}

export default SupplierDetailPage
