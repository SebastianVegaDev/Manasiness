import fs from "node:fs/promises"
import path from "node:path"

import pool from "../../config/db.js"

async function getSqlFiles(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory)

    return entries
        .filter((entry) => entry.endsWith(".sql"))
        .sort()
        .map((entry) => path.join(directory, entry))
}

export async function runSqlFiles(directory: string): Promise<void> {
    const files = await getSqlFiles(directory)
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        for (const file of files) {
            const sql = await fs.readFile(file, "utf8")

            console.log(`Running ${path.basename(file)}...`)
            await client.query(sql)
        }

        await client.query("COMMIT")
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}