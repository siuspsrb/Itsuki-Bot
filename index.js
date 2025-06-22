import path from "path"
import chalk from "chalk"
import { spawn } from "child_process"
import { fileURLToPath } from "url"
import { dirname } from "path"
import os from "os"
import fs from "fs"
import { printStartupBanner } from "./lib/functions.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BOT_ENTRY = path.join(__dirname, "lib/socket.js")
const NODE_BINARY = process.argv[0]
const ER_LOG = path.join(__dirname, "lib/error.log")

// pastiin file error log-nya ad
if (!fs.existsSync(ER_LOG)) fs.writeFileSync(ER_LOG, "")

const unhandledRejections = new Map()

const logToFile = (type, err) => {
    const logMsg = `[${new Date().toISOString()}] ${type}: ${err.stack || err}\n`
    fs.appendFileSync(ER_LOG, logMsg)
}

function launchBotInstance() {
    const processArgs = [BOT_ENTRY, ...process.argv.slice(2)]
    const botProcess = spawn(NODE_BINARY, processArgs, {
        stdio: ["inherit", "inherit", "inherit", "ipc"],
        detached: true
    })

    const handleProcessMessage = (message) => {
        switch (message) {
            case "reset":
                console.log(chalk.yellow.bold("[ SYSTEM ] Restarting bot instance..."))
                botProcess.off("message", handleProcessMessage)
                botProcess.kill()
                launchBotInstance()
                break
            case "uptime":
                botProcess.send(process.uptime())
                break
        }
    }

    botProcess
        .on("message", handleProcessMessage)
        .on("exit", (exitCode) => {
            if (exitCode !== 0) {
                console.error(chalk.red.bold(`[ CRASH ] Bot terminated unexpectedly! Exit code: ${exitCode}`))
                setTimeout(launchBotInstance, 1000)
            } else {
                console.log(chalk.green.bold("[ SYSTEM ] Bot shutdown gracefully"))
                process.exit(0)
            }
        })

    // handler error biar bot tahan banting:v
    process.on("uncaughtException", (err) => {
        if (err?.code === "ENOMEM") {
            console.error("⚠️ Memori penuh (uncaughtException)!")
        } else {
            console.error("❌ Uncaught Exception:", err)
        }
        logToFile("uncaughtException", err)
    })

    process.on("unhandledRejection", (reason, promise) => {
        unhandledRejections.set(promise, reason)
        if (reason?.code === "ENOMEM") {
            console.error("⚠️ Memori penuh (unhandledRejection)!")
        } else {
            console.error("❌ Unhandled Rejection at:", promise, "\nReason:", reason)
        }
        logToFile("unhandledRejection", reason)
    })

    process.on("rejectionHandled", (promise) => {
        unhandledRejections.delete(promise)
    })

    process.on("exit", (code) => {
        console.warn(`⚠️ Proses keluar dengan kode: ${code}`)
        botProcess.kill()
    })

    process.on("beforeExit", (code) => {
        console.log(`💡 beforeExit (${code})...`)
    })

    process.on("SIGINT", () => {
        console.warn("📴 Terdeteksi CTRL+C (SIGINT)")
        // process.exit(0) 
        // uncomment klo mau keluar, kekny g perlu
    })

    process.on("warning", (warning) => {
        if (warning.name === "MaxListenersExceededWarning") {
            console.warn("⚠️ Terlalu banyak listener! Waspada memory leak:", warning.message)
        } else {
            console.warn("⚠️ Warning:", warning.name, "-", warning.message)
        }
        logToFile("warning", warning)
    })

    process.on("multipleResolves", (type, promise, reason) => {
        console.warn("⚠️ Multiple Resolves Detected")
        console.warn("→ type:", type)
        console.warn("→ promise:", promise)
        console.warn("→ reason:", reason)
        logToFile("multipleResolves", reason)
    })
}

// startup info
console.log(chalk.red.bold(`
╔══════════════════════════════════════════════════╗
║               SYSTEM ENVIRONMENT                 ║
╚══════════════════════════════════════════════════╝
  - Platform    : ${chalk.yellow.bold(os.platform())}
  - Release     : ${chalk.yellow.bold(os.release())}
  - Architecture: ${chalk.yellow.bold(os.arch())}
  - Hostname    : ${chalk.yellow.bold(os.hostname())}
  - Total RAM   : ${chalk.yellow.bold(`${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`)}
  - Developer    : ${chalk.yellow.bold("@siuspsrb")}
  - Free RAM    : ${chalk.yellow.bold(`${(os.freemem() / 1024 / 1024).toFixed(2)} MB`)}
  - Message     : ${chalk.yellow.bold("Enjoy the source code")}
`))

console.log(chalk.yellow.bold("[=============== STARTING BOT INSTANCE ===============]"))

try {
    launchBotInstance()
    printStartupBanner()
} catch (err) {
    console.error(chalk.red.bold("[ BOOT FAILURE ] Initialization error:"), err)
    logToFile("boot_failure", err)
}