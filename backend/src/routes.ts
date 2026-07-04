import { Router } from "express"

import { verifyToken } from "./middlewares/auth.middleware.js"

import activityRoutes from "./modules/activity/activity.routes.js"
import authRoutes from "./modules/auth/auth.routes.js"
import bootstrapRoutes from "./modules/bootstrap/bootstrap.routes.js"
import categoriesRoutes from "./modules/categories/categories.routes.js"
import customersRoutes from "./modules/customers/customers.routes.js"
import expensesRoutes from "./modules/expenses/expenses.routes.js"
import incomeRoutes from "./modules/income/income.routes.js"
import informationRoutes from "./modules/information/information.routes.js"
import ordersRoutes from "./modules/orders/orders.routes.js"
import passwordRoutes from "./modules/password/password.routes.js"
import pendingRoutes from "./modules/pending/pending.routes.js"
import productsRoutes from "./modules/products/products.routes.js"
import salesRoutes from "./modules/sales/sales.routes.js"
import staffRoutes from "./modules/staff/staff.routes.js"
import statsRoutes from "./modules/stats/stats.routes.js"
import suppliersRoutes from "./modules/suppliers/suppliers.routes.js"
import usersRoutes from "./modules/users/users.routes.js"
import workersRoutes from "./modules/workers/workers.routes.js"

const router = Router()

router.use("/auth", authRoutes)

router.use(verifyToken)

router.use("/bootstrap", bootstrapRoutes)

router.use("/activity", activityRoutes)
router.use("/categories", categoriesRoutes)
router.use("/customers", customersRoutes)
router.use("/expenses", expensesRoutes)
router.use("/income", incomeRoutes)
router.use("/information", informationRoutes)
router.use("/orders", ordersRoutes)
router.use("/password", passwordRoutes)
router.use("/pending", pendingRoutes)
router.use("/products", productsRoutes)
router.use("/sales", salesRoutes)
router.use("/staff", staffRoutes)
router.use("/stats", statsRoutes)
router.use("/suppliers", suppliersRoutes)
router.use("/users", usersRoutes)
router.use("/workers", workersRoutes)

export default router