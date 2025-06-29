commands.add({
    name: ["command"],
    command: ["command"],
    alias: ["help"],
    category: "info",
    desc: "cek info detail command",
    query: true,
    run: async ({ sius, m, args }) => {
        const query = args[0]?.toLowerCase()
        const data = commands.findCommand(query)
        if (!data) return m.reply(`⚠️ Command *${query}* tidak ditemukan!`)

        // format lastUsed
        const formatTimeAgo = (date) => {
            const now = new Date()
            const diff = Math.floor((now - new Date(date)) / 1000)
            if (diff < 60) return `${diff} detik yang lalu`
            if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
            if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)} menit yg lalu`
            return new Date(date).toLocaleString("id-ID")
        }

        const teks = `▢ *Command:* ${data.command.join(", ")}\n` +
        `▢ *Alias:* ${data.alias.length ? data.alias.join(", ") : "-"}\n` +
        `▢ *Kategori:* ${data.category || "-"}\n` +
        `▢ *Cooldown:* ${data.cooldown || 0}s\n` +
        `▢ *Enable:* ${data.enable ? "Aktif" : "Nonaktif"}\n` +
        `▢ *Usage:* ${data.usageCount}x\n` +
        `▢ *Terakhir:* ${data.lastUsed ? formatTimeAgo(data.lastUsed) : "Belum pernah"}\n` +
        `▢ *Ditambahkan:* ${data.addedAt ? new Date(data.addedAt).toLocaleString("id-ID") : "Tidak diketahui"}\n` + (data.usage ? 
        `▢ *Usage args:* ${data.usage}\n` : "") +
        (data.example ? 
        `▢ *Contoh:* ${data.example}\n` : "") +        
        `▢ *Deskripsi:* ${data.desc || "-"}\n\n` +
        `*STATUS SYARAT PENGAKSESAN*\n` +
        `▢ *Min. Level:* ${data.level || 1}\n` +
        `▢ *Limit:* ${data.limited ? "√" : "×"}\n` +
        `▢ *Premium:* ${data.premium ? "√" : "×"}\n` +
        `▢ *Pemilik:* ${data.owner ? "√" : "×"}\n` +
        `▢ *Group:* ${data.group ? "√" : "×"}\n` +
        `▢ *Admin:* ${data.admin ? "√" : "×"}\n` +
        `▢ *Bot Admin:* ${data.botAdmin ? "√" : "×"}\n`

        sius.reply(m.chat, teks.trim(), `🔍 DETAIL COMMAND ${query.toUpperCase()}`, false)
    }
})