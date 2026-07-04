import {
    useEffect,
    useMemo,
    useState
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import {
    activateProduct,
    deactivateProduct,
    getProductById
} from "@features/catalog/products/api/products.api"
import type { Product } from "@features/catalog/shared/types/catalog.types"
import { getApiErrorMessage } from "@shared/api/httpError"
import EntityDetailScreen, { type EntityDetailData } from "@shared/ui/screens/entity-detail/EntityDetailScreen"
import { formatCurrency } from "@shared/utils/currency"

const FALLBACK_IMAGE = "https://i.postimg.cc/KYydTs9w/noimage.png"

function toNumber(value: unknown): number {
    const numberValue = Number(value ?? 0)
    return Number.isFinite(numberValue) ? numberValue : 0
}

function getProductStatus(product: Product): boolean {
    if (typeof product.is_active === "boolean") {
        return product.is_active
    }

    if (typeof product.isActive === "boolean") {
        return product.isActive
    }

    return product.status !== "inactive"
}

function getCategoryName(product: Product): string {
    return (
        product.category_name ??
        product.categoryName ??
        product.category?.name ??
        String(product.category ?? "No category")
    )
}

function ProductDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const bootstrap = useBootstrapData()

    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const currencyCode = bootstrap.data?.session?.store?.currency_code ?? "PEN"

    async function loadProduct() {
        if (!id) {
            setProduct(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        try {
            setProduct(await getProductById(id))
        } catch (caughtError) {
            console.error(caughtError)
            setProduct(null)
            toast.error(getApiErrorMessage(caughtError, "Could not load product"))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void loadProduct()
    }, [id])

    const detail = useMemo<EntityDetailData | null>(() => {
        if (!product) {
            return null
        }

        return {
            id: product.id,
            entity: "Product",
            name: product.name,
            image: product.image || FALLBACK_IMAGE,
            isActive: getProductStatus(product),
            details: [
                { label: "Category", value: getCategoryName(product) },
                { label: "Cost Price", value: formatCurrency(product.cost_price ?? product.costPrice, currencyCode) },
                { label: "Sale Price", value: formatCurrency(product.sale_price ?? product.salePrice, currencyCode) },
                { label: "Stock", value: String(toNumber(product.stock)) }
            ]
        }
    }, [currencyCode, product])

    async function handleStatusChange(nextAction: "activate" | "deactivate") {
        if (!id) {
            return
        }

        setIsSubmitting(true)

        try {
            const nextProduct = nextAction === "activate"
                ? await activateProduct(id)
                : await deactivateProduct(id)

            setProduct(nextProduct)
            toast.success(nextAction === "activate" ? "Product activated successfully" : "Product deactivated successfully")
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, "Could not update product"))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!detail && !isLoading) {
        return (
            <div className="shared-entity-detail-screen">
                <div className="shared-entity-detail-title">
                    <h1>Could not load product</h1>
                </div>
                <div className="shared-entity-detail-actions">
                    <button id="edit" type="button" onClick={() => navigate("/dashboard/products")}>
                        Back
                    </button>
                </div>
            </div>
        )
    }

    if (!detail) {
        return (
            <div className="shared-entity-detail-screen">
                <div className="shared-entity-detail-title">
                    <h1>Product</h1>
                </div>
            </div>
        )
    }

    return (
        <EntityDetailScreen
            detail={detail}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onDeactivateClick={() => void handleStatusChange("deactivate")}
            onActivateClick={() => void handleStatusChange("activate")}
        />
    )
}

export default ProductDetailPage
