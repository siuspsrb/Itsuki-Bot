commands.add({
    name: ["totalcommands", "totalfitur"],
    command: ["totalcommands", "totalfitur"],
    category: "info",
    alias: ["totalcmd"],
    desc: "menampilkan total semua fitur yang tersedia",
    run: async ({ sius, m }) => {
        const allCmds = commands.getAllCommands({ onlyEnabled: true })
        const grouped = {}
        for (const cmd of allCmds) {
            const cat = cmd.category.toUpperCase()
            if (!grouped[cat]) grouped[cat] = []
            grouped[cat].push(cmd)
        }
        const total = allCmds.length
        let teks = `*TOTAL FITUR AKTIF: ${total}*\n\n`
        for (const [cat, list] of Object.entries(grouped).sort()) {
            teks += `▢ ${cat}: ${list.length} Fitur\n`
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