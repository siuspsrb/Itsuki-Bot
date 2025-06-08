import path from "path";
import chalk from "chalk";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";
import os from "os";
import { printStartupBanner } from "./lib/source/functions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BOT_ENTRY = path.join(__dirname, "lib/source/socket.js");
const NODE_BINARY = process.argv[0];

function launchBotInstance() {
    const processArgs = [BOT_ENTRY, ...process.argv.slice(2)];
    const botProcess = spawn(NODE_BINARY, processArgs, {
        stdio: ["inherit", "inherit", "inherit", "ipc"],
        detached: true
    });

    const handleProcessMessage = (message) => {
        switch (message) {
            case "reset":
                console.log(chalk.yellow.bold("[SYSTEM] Restarting bot instance..."));
                botProcess.off("message", handleProcessMessage);
                botProcess.kill();
                launchBotInstance();
                break;
            case "uptime":
                botProcess.send(process.uptime());
                break;
        }
    };

    botProcess
        .on("message", handleProcessMessage)
        .on("exit", (exitCode) => {
            if (exitCode !== 0) {
                console.error(chalk.red.bold(`[CRASH] Bot terminated unexpectedly! Exit code: ${exitCode}`));
                setTimeout(launchBotInstance, 1000);
            } else {
                console.log(chalk.green.bold("[SYSTEM] Bot shutdown gracefully"));
                process.exit(0);
            }
        });

    process.on("uncaughtException", (err) => {
        console.error(
            chalk.redBright("[FATAL ERROR]"),
            `File: ${err.stack.split("\n")[0]}\n`,
            `Line: ${err.stack.match(/(.+):(\d+):\d+/)[2]}\n`,
            `Error: ${err}`
        );
        process.exit(1);
    });
    process.on("exit", () => botProcess.kill());
}

console.log(chalk.red.bold(`
╔══════════════════════════════════════════════════╗
║               SYSTEM ENVIRONMENT                 ║
╚══════════════════════════════════════════════════╝
  - Platform    : ${chalk.yellow.bold(os.platform())}
  - Release     : ${chalk.yellow.bold(os.release())}
  - Architecture: ${chalk.yellow.bold(os.arch())}
  - Hostname    : ${chalk.yellow.bold(os.hostname())}
  - Total RAM   : ${chalk.yellow.bold(`${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`)}
  - Free RAM    : ${chalk.yellow.bold(`${(os.freemem() / 1024 / 1024).toFixed(2)} MB`)}
`));
console.log(chalk.yellow.bold("[=============== STARTING BOT INSTANCE ===============]"));
try {
    launchBotInstance();
    printStartupBanner();
} catch (err) {
    console.error(chalk.red.bold("[BOOT FAILURE] Initialization error:"), err);
    process.exit(1);
}