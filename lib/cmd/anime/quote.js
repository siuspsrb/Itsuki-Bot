commands.add({
    name: ["animequote"],
    command: ["animequote"],
    alias: ["animequotes","quoteanime","quotesanime"],
    category: "anime",
    limited: true,
    desc: "Kutipan anime random dari karakter",
    run: async({ sius, m, Func }) => {
        m.reply({ react: { text: "🕣", key: m.key }})
        let res = await Func.fetchJson("https://fastrestapis.fasturl.cloud/anime/animequote")
        if (!res?.result || !Array.isArray(res.result)) return m.reply("[×] Gagal mengambil quote")
        let quote = Func.pickRandom(res.result)
        let text = `*${quote.character}* - ${quote.anime}\n`
        text += `_${quote.episode}_\n\n`
        text += `❝ ${quote.quote} ❞\n\n`
        text += `Link: ${quote.link}`
        await m.reply(text, {
            contextInfo: {
                externalAdReply: {
                    title: quote.character,
                    body: quote.anime,
                    mediaType: 1,
                    thumbnailUrl: quote.image,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    sourceUrl: quote.link
                }
            }
        })
        m.reply({ react: { text: "", key: m.key }})
    }
})