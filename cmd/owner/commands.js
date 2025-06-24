commands.add({
    name: ["deletecmd", "delcmd"],
    command: ["deletecmd", "delcmd"],
    category: "command-handler",
    desc: "menghapus command dari sistem",
    query: true,
    owner: true,
    usage: "<command>",
    example: "menu",
    run: async ({ sius, m, args, Func }) => {
        const target = args[0]?.toLowerCase()
        if (!target) return m.example("<command>")
        const cmd = commands.findCommand(target)
        if (!cmd) {
            // suggestion kalau salah nulis wkwk
            let allc = commands.getAllCommands().flatMap(e => [...e.command, ...(e.alias || [])])
            let result = Func.suggestCommand(target, allc)
            if (result && result.similarity > 70) {
                return m.reply(`⚠️ Command tidak ditemukan!\nMungkin maksud kamu: *.${result.suggestion}*?`)
            }
            return m.reply("⚠️ Command tidak ditemukan.")
        }
        const hapus = commands.remove(cmd.name[0])
        if (hapus) {
            return m.reply(`[√] Command *.${target}* berhasil dihapus dari sistem`)
        } else {
            return m.reply(`⚠️ Gagal menghapus command`)
        }
    }
})

commands.add({
    name: ["enablecmd"],
    command: ["enablecmd"],
    category: "command-handler",
    owner: true,
    query: true,
    desc: "aktifkan command",
    usage: "<command>",
    run: async ({ m, args }) => {
        const target = args[0]?.toLowerCase()
        const cmd = commands.findCommand(target)
        if (!cmd) {
            let allc = commands.getAllCommands().flatMap(e => [...e.command, ...(e.alias || [])])
            let result = Func.suggestCommand(target, allc)
            if (result && result.similarity > 70) {
                return m.reply(`⚠️ Command tidak ditemukan!\nMungkin maksud kamu: *.${result.suggestion}*?`)
            }
            return m.reply("⚠️ Command tidak ditemukan.")
        }
        const success = commands.setCommandState(cmd.name[0], true)
        m.reply(success ? `[√] Command *${cmd.name[0]}* berhasil diaktifkan` : `⚠️ Gagal mengaktifkan command`)
    }
})

commands.add({
    name: ["disablecmd"],
    command: ["disablecmd"],
    category: "command-handler",
    owner: true,
    query: true,
    desc: "nonaktifkan command",
    usage: "<command>",
    run: async ({ m, args }) => {
        const target = args[0]?.toLowerCase()
        const cmd = commands.findCommand(target)
        if (!cmd) {
            let allc = commands.getAllCommands().flatMap(e => [...e.command, ...(e.alias || [])])
            let result = Func.suggestCommand(target, allc)
            if (result && result.similarity > 70) {
                return m.reply(`⚠️ Command tidak ditemukan!\nMungkin maksud kamu: *.${result.suggestion}*?`)
            }
            return m.reply("⚠️ Command tidak ditemukan.")
        }
        const success = commands.setCommandState(cmd.name[0], false)
        m.reply(success ? `[√] Command *${cmd.name[0]}* berhasil dinonaktifkan` : `⚠️ Gagal menonaktifkan command`)
    }
})

commands.add({
    name: ["getcmd"],
    command: ["getcmd"],
    category: "command-handler",
    desc: "melihat isi function dari command",
    owner: true,
    query: true,
    usage: "<command>",
    example: "menu",
    run: async ({ sius, m, args }) => {
        const target = args[0]?.toLowerCase()
        if (!target) return m.example("<command>")
        const data = commands.findCommand(target)
        if (!data) {
            let allc = commands.getAllCommands().flatMap(e => [...e.command, ...(e.alias || [])])
            let result = Func.suggestCommand(target, allc)
            if (result && result.similarity > 70) {
                return m.reply(`⚠️ Command tidak ditemukan!\nMungkin maksud kamu: *.${result.suggestion}*?`)
            }
            return m.reply("⚠️ Command tidak ditemukan.")
        }
        const code = data.run?.toString()
        if (!code || code.length < 10) return m.reply("⚠️ Tidak bisa menampilkan function.")
        const header = `📄 *COMMAND SOURCE - .${target}*\n` +
                       `▢ *Command:* ${data.command[0]}\n` +
                       `▢ *Kategori:* ${data.category}\n` +
                       `▢ *Status:* ${data.enable ? "Aktif" : "Nonaktif"}\n\n`
        return m.reply(header + "```\n" + code + "\n```")
    }
})

commands.add({
    name: ["setcmd","setvalue"],
    command: ["setcmd","setvalue"],
    category: "command-handler",
    owner: true,
    query: true,
    usage: "<command> | key: value, ...",
    desc: "ubah attribute command",
    example: "menu | cooldown: 5, owner: true, limit: 2",
    run: async ({ m, args, text }) => {
        if (!text.includes("|")) return m.reply("⚠️ Format salah. Gunakan: .setcmd <command> | key: value")
        const [x, keys] = text.split("|").map(v => v.trim())
        const cmd = commands.findCommand(x)
        if (!cmd) {
            let allc = commands.getAllCommands().flatMap(e => [...e.command, ...(e.alias || [])])
            let result = Func.suggestCommand(x, allc)
            if (result && result.similarity > 70) {
                return m.reply(`⚠️ Command tidak ditemukan!\nMungkin maksud kamu: *.${result.suggestion}*?`)
            }
            return m.reply("⚠️ Command tidak ditemukan.")
        }
        const updates = keys.split(",").map(kv => kv.trim().split(":").map(v => v.trim()))
        const valid = [
            "cooldown", "owner", "group", "admin", 
            "botAdmin","private", "register", 
            "premium", "hidden", "enable", "limit", "level",
            "category", "desc", "privatechat","query", 
            "usage", "example"
        ]
        let changes = ""
        for (let [key, val] of updates) {
            if (!valid.includes(key)) {
                changes += `⚠️ Tidak valid: ${key}\n`
                continue
            }
            if (["owner","group","admin","botAdmin","privatechat","register","premium","hidden","query","enable"].includes(key)) {
                cmd[key] = val.toLowerCase() === "true"
            } else if (key === "limit") {
                if (val.toLowerCase() === "true") cmd.limit = true
                else if (val.toLowerCase() === "false") cmd.limit = false
                else cmd.limit = parseInt(val) || false
            } else if (["cooldown","level"].includes(key)) {
                cmd[key] = parseInt(val) || 0
            } else {
                cmd[key] = val
            }
            changes += `*${key}* diubah menjadi *${cmd[key]}*\n`
        }
        return m.reply(`✅ Attribute command *${x}* telah diperbarui!\n\n${changes.trim()}`)
    }
})