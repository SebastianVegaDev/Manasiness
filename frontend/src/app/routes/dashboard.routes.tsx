import { Route } from "react-router-dom"

import DashboardLayout from "@app/layouts/DashboardLayout"
import ActivityPage from "@features/analytics/activity/pages/ActivityPage"
import { BootstrapProvider } from "@features/bootstrap/providers/BootstrapProvider"
import CategoriesPage from "@features/catalog/categories/pages/CategoriesPage"
import CategoryDetailPage from "@features/catalog/categories/pages/CategoryDetailPage"
import CategoryEditPage from "@features/catalog/categories/pages/CategoryEditPage"
import ProductDetailPage from "@features/catalog/products/pages/ProductDetailPage"
import ProductEditPage from "@features/catalog/products/pages/ProductEditPage"
import ProductsPage from "@features/catalog/products/pages/ProductsPage"
import ExpensesPage from "@features/finance/expenses/pages/ExpensesPage"
import IncomePage from "@features/finance/income/pages/IncomePage"
import PendingPage from "@features/finance/pending/pages/PendingPage"
import HomePage from "@features/home/pages/HomePage"
import OrdersPage from "@features/movements/orders/pages/OrdersPage"
import SalesPage from "@features/movements/sales/pages/SalesPage"
import StaffPage from "@features/movements/staff/pages/StaffPage"
import CustomerDetailPage from "@features/people/customers/pages/CustomerDetailPage"
import CustomersPage from "@features/people/customers/pages/CustomersPage"
import SupplierDetailPage from "@features/people/suppliers/pages/SupplierDetailPage"
import SuppliersPage from "@features/people/suppliers/pages/SuppliersPage"
import UserEditPage from "@features/people/users/pages/UserEditPage"
import UserDetailPage from "@features/people/users/pages/UserDetailPage"
import UsersPage from "@features/people/users/pages/UsersPage"
import WorkerDetailPage from "@features/people/workers/pages/WorkerDetailPage"
import WorkersPage from "@features/people/workers/pages/WorkersPage"
import InformationPage from "@features/settings/information/pages/InformationPage"
import PasswordPage from "@features/settings/password/pages/PasswordPage"
import ProtectedRoute from "@shared/routes/ProtectedRoute"

function DashboardRouteElement() {
    return (
        <ProtectedRoute>
            <BootstrapProvider>
                <DashboardLayout />
            </BootstrapProvider>
        </ProtectedRoute>
    )
}

function DashboardRoutes() {
    return (
        <Route path="/dashboard" element={<DashboardRouteElement />}>
            <Route index element={<HomePage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:id" element={<CategoryDetailPage />} />
            <Route path="categories/:id/edit" element={<CategoryEditPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="products/:id/edit" element={<ProductEditPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="users/:id/edit" element={<UserEditPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="suppliers/:id" element={<SupplierDetailPage />} />
            <Route path="workers" element={<WorkersPage />} />
            <Route path="workers/:id" element={<WorkerDetailPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="income" element={<IncomePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="pending" element={<PendingPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="information" element={<InformationPage />} />
            <Route path="password" element={<PasswordPage />} />
        </Route>
    )
}

export { DashboardRoutes }
