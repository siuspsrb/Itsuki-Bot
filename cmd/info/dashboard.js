commands.add({
    name: ["dashboard"],
    command: ["dashboard"],
    category: "info",
    desc: "menampilkan log perubahan command terbaru",
    run: async ({ sius, m }) => {
        if (!cmdLogs || cmdLogs.length === 0) {
            return m.reply("⚠️ Belum ada log perubahan command.")
        }
        let filtered = []
        let seen = {}
        for (let log of [...global.cmdLogs].reverse()) {
            let key = `${log.type}-${log.file}`
            if (!seen[key] || log.time - seen[key] > 3000) {
                filtered.push(log)
               seen[key] = log.time
             }
        }
        let text = ""
        let q = "DASHBOARD COMMAND LOG"
        for (let log of filtered.slice(0, 10)) {
            let icon = log.type === "add" ? "[√]" :
                   log.type === "delete" ? "[×]" :
                   log.type === "error" ? "[×]" :
                   "[√]"
            text += `▢ *${log.type.toUpperCase()}* : ${log.file}\n`
            text += `    ⤷ ${icon} ${log.status}\n`
            text += `    ⤷ ${log.time}\n\n`
        }
        sius.reply(m.chat, text, q, false)
    }
})