import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "../config/db.js";

async function runSqlFile(filePath: string) {
    const sql = await fs.readFile(filePath, "utf-8");
    await pool.query(sql);
}

async function initDb() {
    try {
        const schemaPath = path.resolve("src/db/schema.sql");
        const seedPath = path.resolve("src/db/seed.sql");

        await runSqlFile(schemaPath);
        await runSqlFile(seedPath);

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

initDb();