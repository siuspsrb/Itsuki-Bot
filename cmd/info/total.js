commands.add({
    name: ["totalcommands", "totalfitur"],
    command: ["totalcommands", "totalfitur"],
    alias: ["totalcmd"],
    category: "info",
    desc: "menampilkan total semua fitur yang tersedia",
    run: async ({ sius, m }) => {
        const allCmds = commands.getAllCommands({ onlyEnabled: true })
        const grouped = {}
        let total = 0

        for (const cmd of allCmds) {
            const cat = cmd.category.toUpperCase()
            if (!grouped[cat]) grouped[cat] = []
            grouped[cat].push(cmd)
            total += cmd.command.length
        }

        let teks = `*TOTAL COMMAND AKTIF: ${total}*\n\n`
        for (const [cat, list] of Object.entries(grouped).sort()) {
            const jumlah = list.reduce((acc, x) => acc + x.command.length, 0)
            teks += `▢ ${cat}: ${jumlah} Trigger\n`
        }

        sius.reply(m.chat, teks.trim(), "S T A T I S T I K  -  F I T U R", false)
    }
})

commands.add({
    name: ["totaluser"],
    command: ["totaluser"],
    category: "info",
    desc: "jumlah pengguna bot",
    run: ({ m }) => m.reply(`${config.bot.name} memiliki total *${Object.keys(db.users).length}* pengguna yang terdaftar di database!`)
})