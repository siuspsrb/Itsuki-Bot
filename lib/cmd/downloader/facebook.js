commands.add({
    name: ["facebook"],
    command: ["facebook"],
    category: "downloader",
    alias: ["fb"],
    param: "<url>",
    desc: "Pengunduh video Facebook!",
    limited: true,
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            if (!args[0]) return m.reply(`[×] Harap kirim link Facebook yang ingin didownload!\n\n> Contoh: *.facebook https://www.facebook.com/share/v/19vf4TpTPt*`)
            const url = args[0].trim()
            if (!url.includes("facebook.com")) return m.reply(`[×] URL tidak valid! Pastikan URL dari Facebook (contoh: https://www.facebook.com/share/v/19vf4TpTPt).`)
            m.reply({ react: { text: "🕣", key: m.key }})
            const apiUrl = `https://fastrestapis.fasturl.cloud/downup/fbdown?url=${encodeURIComponent(url)}`
            const result = await Func.fetchJson(apiUrl)
            if (!result || result.status !== 200 || !result.result) return m.reply(`[×] Gagal mendownload video Facebook: ${result?.message || "Data tidak ditemukan"}.`)
            const { title, thumbnail, sd, hd, duration_ms } = result.result
            const duration = Math.floor(duration_ms / 1000)
            const caption = title || ""
            if (thumbnail) {
                await m.reply(`[√] Preview video. Tunggu dalam beberapa saat video akan dikirim...`, { contextInfo: { externalAdReply: { thumbnailUrl: thumbnail, mediaUrl: thumbnail, sourceUr: url, mediaType: 1, renderLargerThumbnail: true, previewType: "PHOTO" }}})
            }
            const videoUrl = hd || sd
            if (videoUrl) {
                await m.reply({
                    video: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption
                })
            } else {
                m.reply(`[×] Tidak ada video yang tersedia untuk diunduh.`)
            }
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})