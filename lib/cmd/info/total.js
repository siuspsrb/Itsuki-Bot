commands.add({
    name: ["totalfitur", "totalcommands"],
    command: ["totalfitur", "totalcommands"],
    category: "info",
    desc: "Menampilkan jumlah total fitur bot per kategori",
    run: async ({ sius, m }) => {
        try {
            let list = Object.values(commands.event).filter(cmd => cmd.enable)
            let grouped = {}
            let total = list.length
            for (let cmd of list) {
                let cat = cmd.category || "uncategorized"
                if (!grouped[cat]) grouped[cat] = []
                grouped[cat].push(...cmd.command)
            }            
            let text = `TOTAL FITUR AKTIF\n\n[√] Jumlah keseluruhan: ${total}\n`
            text += "\n*RINCIAN PER KATEGORI*"
            for (let cat in grouped) {
                let fitur = grouped[cat]
                text += `\n▢ ${cat} [${fitur.length}]`
            }
            await sius.reply(m.chat, text, "T O T A L - F I T U R", false)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["totaluser"],
    command: ["totaluser"],
    category: "info",
    desc: "jumlah pengguna bot",
    run: ({ m }) => m.reply(`${config.bot.name} memiliki total *${Object.keys(db.users).length}* pengguna yang terdaftar di database!`)
})