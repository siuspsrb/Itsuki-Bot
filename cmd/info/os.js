import os from "os"
import speed from "performance-now"
import { exec } from "child_process"

commands.add({
    name: ["os"],
    command: ["os"],
    category: "info",
    desc: "menampilkan informasi sistem server",
    run: async ({ sius, m }) => {
        let timestamp = speed()
        let latensi = speed() - timestamp

        exec("neofetch --stdout", (error, stdout) => {
            let info = stdout.toString("utf-8").replace(/Memory:/, "Ram:")
            let heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
            let totalMem = Math.round(os.totalmem() / 1024 / 1024)
            let teks = [
                `▢ *CPU:* ${info.trim()}`,
                `▢ *Kecepatan:* ${latensi.toFixed(4)} _ms_`,
                `▢ *Memory:* ${heapUsed}MB / ${totalMem}MB`,
                `▢ *OS:* ${os.version()}`,
                `▢ *Platform:* ${os.platform()}`,
                `▢ *Hostname:* ${os.hostname()}`
            ].join("\n")

            m.reply(teks)
        })
    }
})