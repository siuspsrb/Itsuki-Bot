commands.add({
    name: ["getcmd"],
    command: ["getcmd"],
    category: "owner",
    alias: ["getcommand"],
    param: "<nama_command>",
    owner: true,
    desc: "Ambil detail lengkap dari command tertentu",
    run: async ({ sius, m, args }) => {
        try {
            if (!args[0]) return m.reply(`[×] Masukkan nama command!\n\n> Contoh: *.getcmd runtime*`)
            const cmdName = args[0].toLowerCase();
            const cmd = Object.values(commands.event).find(e =>
                e.name.includes(cmdName) || e.alias.includes(cmdName)
            )
            if (!cmd) return m.reply(`[×] Command *${cmdName}* tidak ditemukan.`)
            const { name, command, category, desc, alias, run } = cmd;
            const code = run.toString()
            const detail = `*▢ Nama:* ${name.join(", ")}\n` +
                           `*▢ Command:* ${command.join(", ")}\n` +
                           `*▢ Kategori:* ${category || "N/A"}\n` +
                           `*▢ Deskripsi:* ${desc || "N/A"}\n` +
                           `*▢ Alias:* ${alias.length ? alias.join(", ") : "N/A"}\n\n` +
                           `\`KODE FUNGSI RUN:\`\n${code}`;
            await m.reply(detail)
        } catch (err) { //kokakiko itsuki-desuu
            sius.cantLoad(err)
        }
    }
})

commands.add({
    name: ["deletecmd"],
    command: ["deletecmd"],
    category: "owner",
    owner: true,
    desc: "menghapus command aktif dari cache command bot",
    run: async ({ sius, m, args }) => {
        const name = args[0]?.toLowerCase()
        if (!name) return m.reply("[×] Masukkan nama command yang ingin dihapus.")
        let found = false
        for (let key in commands.event) {
            let index = commands.event[key].findIndex(cmd => 
                cmd.command.includes(name) || (cmd.alias && cmd.alias.includes(name))
            )
            if (index !== -1) {
                commands.event[key].splice(index, 1)
                found = true
            }
        }
        if (found) {
            m.reply(`[√] Berhasil menghapus command *${name}* dari sistem.`)
        } else {
            m.reply(`[×] Command *${name}* tidak ditemukan.`)
        }
    }
})