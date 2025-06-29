import path from "path"
import chalk from "chalk"
import { spawn } from "child_process"
import { fileURLToPath } from "url"
import { dirname } from "path"
import os from "os"
import fs from "fs"
import { printStartupBanner } from "./lib/functions.js"

// startup info | hi, i'm sius, whatchu doing here
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
  - CPU Cores   : ${chalk.yellow.bold(os.cpus().length)}
  - Node Vers.   : ${chalk.yellow.bold(process.version)}
  - Process ID   : ${chalk.yellow.bold(process.pid)}
  - Message     : ${chalk.yellow.bold("Enjoy the source code")}
`))

console.log(chalk.yellow.bold("[=============== STARTING BOT INSTANCE ===============]"))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const botENT = path.join(__dirname, "lib/socket.js")
const nodeBIN = process.argv[0]

function launchBotInstance() {
    const processArgs = [botENT, ...process.argv.slice(2)]
    const botProcess = spawn(nodeBIN, processArgs, {
        stdio: ["inherit", "inherit", "inherit", "ipc"],
        detached: true
    })

    const handleProcessMessage = (message) => {
        switch (message) {
            case "uptime":
                botProcess.send(process.uptime())
                break
            case "reset":
                console.log(chalk.yellow.bold("[ SYSTEM ] RESTARTING BOT INSTANCE..."))
                botProcess.off("message", handleProcessMessage)
                botProcess.kill()
                launchBotInstance()
                break
        }
    }

    botProcess
        .on("message", handleProcessMessage)
        .on("exit", (exitCode) => {
            if (exitCode !== 0) {
                console.error(chalk.red.bold(`[ CRASH ] Bot terminated Unexpectedly! Exit code: ${exitCode}`))
                setTimeout(launchBotInstance, 1000)
            } else {
                console.log(chalk.green.bold("[ SYSTEM ] Bot Shutdown Gracefully 🌿"))
                process.exit(0)
            }
        })
}

try {
    launchBotInstance()
    printStartupBanner()
} catch (err) {
    console.error(chalk.red.bold("[ BOOT FAILURE ] Initialization error:"), err)
}