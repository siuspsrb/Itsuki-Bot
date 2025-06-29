commands.add({
    name: ["channelstalk"],
    command: ["channelstalk"],
    category: "stalk",
    desc: "Melihat informasi dari link Channel WhatsApp.",
    usage: "<link_channel>",
    query: true,
    run: async ({ m, args, sius }) => {
        if (!args[0]) return m.reply("⚠️ Format salah!\nGunakan: .channelstalk <link_channel>")

        let match = args[0].match(/whatsapp\.com\/channel\/([\w-]+)/)
        if (!match) return m.reply("⚠️ Terjadi kesalahan! Pastikan link yang kamu kirim valid.")

        let inviteId = match[1]
        let data

        try {
            data = await sius.newsletterMetadata("invite", inviteId)
        } catch {
            return m.reply("⚠️ Gagal mengambil data dari WhatsApp. Coba lagi nanti.")
        }

        if (!data || !data.id) return m.reply("⚠️ Data tidak ditemukan. Pastikan link benar atau belum kadaluarsa.")

        let teks =
            `▢ *ID:* ${data.id}\n` +
            `▢ *Nama:* ${data.name}\n` +
            `▢ *Pengikut:* ${data.subscribers?.toLocaleString("id-ID") || "Tidak diketahui"}\n` +
            `▢ *Dibuat sejak:* ${data.creation_time ? new Date(data.creation_time * 1000).toLocaleString("id-ID") : "Tidak diketahui"}\n` +
            `▢ *Deskripsi:* ${data.description || "Tidak ada deskripsi."}`

        m.reply({
            text: teks,
            contextInfo: {
                externalAdReply: {
                    title: "C H A N N E L - I N F O",
                    body: "Channel Information Result",
                    thumbnailUrl: "https://pps.whatsapp.net" + (data.preview || ""),
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: config
                }
            }
        })
    }
})