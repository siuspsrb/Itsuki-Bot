commands.add({
    name: ["enablecmd"],
    command: ["enablecmd"],
    category: "owner",
    owner: true,
    query: true,
    desc: "aktifkan command",
    usage: "<command>",
    run: async ({ m, args }) => {
        const target = args[0]?.toLowerCase()
        const cmd = commands.findCommand(target)
        if (!cmd) return m.reply(`⚠️ Command *${target}* tidak ditemukan`)
        const success = commands.setCommandState(cmd.name[0], true)
        m.reply(success ? `[√] Command *${cmd.name[0]}* berhasil diaktifkan` : `⚠️ Gagal mengaktifkan command`)
    }
})

commands.add({
    name: ["disablecmd"],
    command: ["disablecmd"],
    category: "owner",
    owner: true,
    query: true,
    desc: "nonaktifkan command",
    usage: "<command>",
    run: async ({ m, args }) => {
        const target = args[0]?.toLowerCase()
        const cmd = commands.findCommand(target)
        if (!cmd) return m.reply(`⚠️ Command *${target}* tidak ditemukan`)
        const success = commands.setCommandState(cmd.name[0], false)
        m.reply(success ? `[√] Command *${cmd.name[0]}* berhasil dinonaktifkan` : `⚠️ Gagal menonaktifkan command`)
    }
})