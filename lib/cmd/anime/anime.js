commands.add({
    name: ["anime"],
    command: ["anime"],
    category: "anime",
    limited: true,
    desc: "Cari info anime dari WhatsApp",
    run: async({ sius, m, args, Func }) => {
        let q = args.join(" ")
        if (!q) return m.reply("[×] Sertakan judul anime yang ingin dicari!")
        m.reply({ react: { text: "🕣", key: m.key }})
        let res = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/anime/animeinfo?name=${encodeURIComponent(q)}`)
        if (!res?.result) return m.reply("[×] Anime tidak ditemukan!")
        let r = res.result
        let text = `*ANIME - INFO*\n\n`
        text += `*▢ Judul:* ${r.title}\n`
        text += `*▢ Type:* ${r.type}\n`
        text += `*▢ Status:* ${r.status}\n`
        text += `*▢ Genre:* ${r.genres}\n`
        text += `*▢ Skor:* ${r.score} | *Favorites:* ${r.favorites}\n`
        text += `*▢ Anggota:* ${r.members}\n\n`
        text += `*▢ Sinopsis:*\n${r.synopsis?.split("\n").slice(0, 2).join("\n")}...\n\n`
        text += `Link: ${r.url}`
        m.reply(text, {
            contextInfo: {
                externalAdReply: {
                    title: r.title,
                    mediaType: 1,
                    thumbnailUrl: r.images.jpg.image_url,
                    renderLargerThumbnail: true,
                    sourceUrl: r.url
                }
            }
        })
        m.reply({ react: { text: "", key: m.key }})
    }
})