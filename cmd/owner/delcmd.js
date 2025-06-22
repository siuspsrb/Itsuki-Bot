commands.add({
    name: ["deletecmd", "delcmd"],
    command: ["deletecmd", "delcmd"],
    category: "owner",
    desc: "menghapus command dari sistem",
    query: true,
    owner: true,
    usage: "<command>",
    example: ".deletecmd menu",
    run: async ({ sius, m, args, Func }) => {
        const target = args[0]?.toLowerCase()
        if (!target) return m.example("<command>")

        const cmd = commands.findCommand(target)
        if (!cmd) {
            // suggestion kalau salah nulis wkwk
            const allc = commands.getAllCommands().flatMap(e => [...e.command, ...(e.alias || [])])
            const result = Func.suggestCommand(target, allc)
            if (result && result.similarity > 70) {
                return m.reply(`⚠️ Tidak ditemukan!\nMungkin maksud kamu: *.${result.suggestion}*?`)
            }
            return m.reply("⚠️ Command tidak ditemukan.")
        }

        const removed = commands.remove(cmd.name[0])
        if (removed) {
            return m.reply(`[√] Command *.${target}* berhasil dihapus dari sistem`)
        } else {
            return m.reply(`⚠️ Gagal menghapus command`)
        }
    }
})