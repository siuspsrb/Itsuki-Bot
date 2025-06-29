commands.add({
    name: ["auto-ai"],
    command: ["auto-ai"],
    category: "ai",
    premium: true,
    alias: ["autoai"],
    desc: "aktif/nonaktifin auto-ai buat balas pesan kamu otomatis",
    usage: "<on/off>",
    run: async({ sius, m, args, Func }) => {
        let user = db.users[m.sender]
        if (!args[0]) {
            let status = user.autodl ? "aktif" : "nonaktif"
            return m.reply(`Status auto-ai kamu sekarang *${status}*\n\n> ${user.autodl ? "Nonaktifkan" : "Aktifkan"} dengan mengetik ${m.prefix + m.command} ${user.autodl ? "off" : "on"}`)
        }
        let option = args[0].toLowerCase()
        if (option != "on" && option != "off") return m.reply("⚠️ Pilih antara *on* atau *off*")
        user.autodl = option == "on"
        m.reply(`[√] auto-ai berhasil *${option == "on" ? "diaktifkan" : "dinonaktifkan"}*`)
    }
})