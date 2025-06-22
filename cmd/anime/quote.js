commands.add({
    name: ["animequote"],
    command: ["animequote"],
    alias: ["animequotes","quoteanime","quotesanime"],
    category: "anime",
    limit: true,
    desc: "Kutipan anime random dari karakter",
    run: async({ sius, m, Func }) => {
        //m.reply({ react: { text: "🕣", key: m.key }})
        let res = await Func.fetchJson("https://fastrestapis.fasturl.cloud/anime/animequote")
        if (!res?.result || !Array.isArray(res.result)) return m.reply("⚠️ Gagal mengambil quote")
        let quote = Func.pickRandom(res.result)
        let text = `*${quote.character}* - ${quote.anime}\n`
        text += `_${quote.episode}_\n\n`
        text += `❝ ${quote.quote} ❞\n\n`
        text += `Link: ${quote.link}`
        let txt = "🔖 A N I M E - Q U O T E S"
        await sius.reply(m.chat, text, txt, false)
    }
})