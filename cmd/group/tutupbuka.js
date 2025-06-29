commands.add({
    name: ["tutupjam", "bukajam"],
    command: ["tutupjam", "bukajam"],
    category: "group",
    desc: "jadwalkan grup agar otomatis tutup/buka pada jam tertentu",
    usage: "<jam:menit>",
    example: "18:00",
    group: true,
    admin: true,
    botAdmin: true,
    query: true,
    run: async ({ sius, m, args }) => {
        const [jmStr, mntStr] = args[0]?.split(":") || []
        const command = m.command

        if (!jmStr || !mntStr)
            return m.reply(`⚠️ format salah!\n\n▢ contoh: ${m.prefix + command} 18:00`)

        const jm = parseInt(jmStr)
        const mnt = parseInt(mntStr)

        if (isNaN(jm) || jm > 23)
            return m.reply(`⚠️ jam invalid (0–23)\n\n▢ contoh: ${m.prefix + command} 18:00`)

        if (isNaN(mnt) || mnt > 59)
            return m.reply(`⚠️ menit invalid (0–59)\n\n▢ contoh: ${m.prefix + command} 18:00`)

        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
        const target = new Date(now)
        target.setHours(jm)
        target.setMinutes(mnt)
        target.setSeconds(0)

        if (target < now) target.setDate(now.getDate() + 1)

        const delay = target - now

        m.reply(`⏰ Grup akan di${command == "tutupjam" ? "tutup" : "buka"} pada ${jm.toString().padStart(2, "0")}:${mnt.toString().padStart(2, "0")} WIB`)

        setTimeout(async () => {
            try {
                if (command == "tutupjam") {
                    await sius.groupSettingUpdate(m.chat, "announcement")
                    m.reply("[√] Grup berhasil ditutup\n> ⏱ Ditutup otomatis sesuai jadwal")
                } else if (command == "bukajam") {
                    await sius.groupSettingUpdate(m.chat, "not_announcement")
                    m.reply("[√] Grup berhasil dibuka\n> ⏱ Dibuka otomatis sesuai jadwal")
                }
            } catch (err) {
                console.error("error update grup:", err)
            }
        }, delay)
    }
})