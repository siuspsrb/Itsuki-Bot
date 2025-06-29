commands.add({
    name: ["topcmd"],
    command: ["topcmd"],
    category: "info",
    desc: "menampilkan command paling sering dipakai",
    cooldown: 10, 
    run: async ({ sius, m }) => {
        const stats = commands.getStats()
        const entries = Array.from(stats.entries())
        if (!entries.length) return m.reply("× Belum ada statistik command.")
        const allCommands = commands.getAllCommands()
        const sorted = entries
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10)
        let teks = " "
        for (let i = 0; i < sorted.length; i++) {
            const [cmd, data] = sorted[i]
            const detail = allCommands.find(e => e.command.includes(cmd) || e.alias.includes(cmd))
            teks += `${i + 1}. *${cmd}* — ${data.count}x dipakai`
            teks += "\n"
        }
        sius.reply(m.chat, teks.trim(), "📊 TOP COMMAND STATS", false)
    }
})