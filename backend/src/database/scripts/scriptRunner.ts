import { pathToFileURL } from "node:url"

import pool from "../../config/db.js"

type DatabaseScript = () => Promise<void>

export function isDirectRun(importMetaUrl: string): boolean {
    return process.argv[1]
        ? importMetaUrl === pathToFileURL(process.argv[1]).href
        : false
}

export async function runDatabaseScript(script: DatabaseScript): Promise<void> {
    try {
        await script()
        console.log("Done.")
    } catch (error) {
        console.error(error)
        process.exitCode = 1
    } finally {
        await pool.end()
    }
}