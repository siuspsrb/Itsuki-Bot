commands.add({
    name: ["listblockcmd"],
    command: ["listblockcmd", "fiturblokir", "fiturnonaktif"],
    category: "info",
    desc: "menampilkan list fitur yang diblokir",
    run: async ({ sius, m }) => {
        const nonaktif = commands.getAllCommands({ onlyEnabled: false })
            .filter(e => e.enable === false)

        if (!nonaktif.length) return m.reply("⚠️ Tidak ada fitur yang sedang diblokir.")

        let teks = `📛 *DAFTAR FITUR NONAKTIF: ${nonaktif.length}*\n\n`
        for (let cmd of nonaktif) {
            const cmdList = cmd.command.map(c => `.${c}`).join(", ")
            teks += `▢ ${cmdList}\n`
        }

        m.reply(teks.trim())
    }
})