commands.add({
    name: ["getcmd"],
    command: ["getcmd"],
    category: "owner",
    desc: "melihat isi function dari command",
    owner: true,
    query: true,
    usage: "<command>",
    example: ".getcmd menu",
    run: async ({ sius, m, args }) => {
        const target = args[0]?.toLowerCase()
        if (!target) return m.example("<command>")
        const data = commands.findCommand(target)
        if (!data) return m.reply(`⚠️ Command *${target}* tidak ditemukan!`)
        const code = data.run?.toString()
        if (!code || code.length < 10) return m.reply("⚠️ Tidak bisa menampilkan function.")
        const header = `📄 *FUNCTION SOURCE - .${target}*\n` +
                       `▢ *Command:* ${data.command[0]}\n` +
                       `▢ *Kategori:* ${data.category}\n` +
                       `▢ *Status:* ${data.enable ? "Aktif" : "Nonaktif"}\n\n`
        return m.reply(header + "```\n" + code + "\n```")
    }
})