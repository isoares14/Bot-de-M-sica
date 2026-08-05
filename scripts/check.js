const fs = require("node:fs")
const path = require("node:path")
const { spawnSync } = require("node:child_process")

const root = path.resolve(__dirname, "..")
const ignoredDirectories = new Set(["node_modules", ".git"])

function findJavaScriptFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const entryPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            return ignoredDirectories.has(entry.name) ? [] : findJavaScriptFiles(entryPath)
        }

        return entry.name.endsWith(".js") ? [entryPath] : []
    })
}

const files = findJavaScriptFiles(root)

for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" })

    if (result.status !== 0) {
        process.exit(result.status)
    }
}

console.log(`${files.length} arquivos JavaScript validados.`)
