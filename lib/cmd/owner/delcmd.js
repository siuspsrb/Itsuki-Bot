commands.add({
    name: ["delcmd"],
    command: ["delcmd"],
    category: "owner",
    owner: true,
    desc: "menghapus command dari runtime memori",
    run: async ({ sius, m, args }) => {
        if (!args[0]) return m.reply("• Contoh penggunaan:\n.delcmd animequote")
        const target = args[0].toLowerCase()
        let found = false
        for (let key in commands.event) {
            const cmd = commands.event[key]
            if (cmd.name.includes(target) || (cmd.alias && cmd.alias.includes(target)) || cmd.command.includes(target)) {
                delete commands.event[key]
                found = true
                break
            }
        }
        if (found) {
            m.reply(`[√] Berhasil menghapus command *${target}* dari runtime`)
        } else {
            m.reply(`[×] Command *${target}* tidak ditemukan atau sudah dihapus`)
        }
    }
})