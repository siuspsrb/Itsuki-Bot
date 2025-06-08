import pkg from "../../../package.json" with { type: "json" }
import { performance } from "perf_hooks"
import os from "os"

commands.add({
    name: ["infobot"],
    command: ["infobot"],
    category: "info",
    desc: "Menampilkan informasi detail tentang SiusBot",
    run: async ({ sius, m }) => {
        const start = performance.now()
        const botNumber = sius.decodeJid(sius.user.id)
        const dbSet = db.set[botNumber] || {}
        const uptime = process.uptime()
        const formatTime = (sec) => {
            const h = Math.floor(sec / 3600)
            const m = Math.floor((sec % 3600) / 60)
            const s = Math.floor(sec % 60)
            return [h, m, s].map(v => String(v).padStart(2, "0")).join(":")
        }
        const end = performance.now()
        const speed = (end - start).toFixed(3)    
        const memUsed = (process.memoryUsage().rss / 1024 / 1024).toFixed(2)
        const info = `*▢ Name :* ${config.bot.name}
*▢ Uptime :* ${formatTime(uptime)}
*▢ Mode :* ${dbSet.public ? "Public" : dbSet.privateonly ? "Private Only" : dbSet.grouponly ? "Group Only" : "Unknown"}
*▢ AutoTyping :* ${dbSet.autotyping ? "√" : "×"}
*▢ AutoRead :* ${dbSet.autoread ? "√" : "×"}
*▢ AntiSpam :* ${dbSet.antispam ? "√" : "×"}
*▢ AntiCall :* ${dbSet.anticall ? "√" : "×"}
*▢ Read SW :* ${dbSet.readsw ? "√" : "×"}
*▢ Menu :* ${dbSet.template}
*▢ Prefix :* ${dbSet.multiprefix ? "multi" : m.prefix}
*▢ Library :* ${pkg.dependencies["@adiwajshing/baileys"]}
*▢ Node.js :* ${process.version}
*▢ RAM Used :* ${memUsed} MB
*▢ Speed :* ${speed} ms`.trim()
        sius.reply(m.chat, info, "I N F O - B O T", false)
    }
})