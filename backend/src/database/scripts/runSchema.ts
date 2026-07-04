import path from "node:path"
import { fileURLToPath } from "node:url"

import { runSqlFiles } from "./runSqlFiles.js"
import { isDirectRun, runDatabaseScript } from "./scriptRunner.js"

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const schemaDir = path.resolve(currentDir, "../schema")

export async function runSchema(): Promise<void> {
    await runSqlFiles(schemaDir)
}

if (isDirectRun(import.meta.url)) {
    await runDatabaseScript(runSchema)
}