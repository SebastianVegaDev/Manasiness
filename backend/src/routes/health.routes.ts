import { Router } from "express";
import { checkDatabaseConnection } from "../config/db.js";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        await checkDatabaseConnection();

        res.json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        res.status(500).json({
            status: "error",
            database: "disconnected"
        });
    }
});

export default router