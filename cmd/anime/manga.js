commands.add({
    name: ["manga"],
    command: ["manga"],
    category: "anime",
    limit: true,
    query: true,
    example: "One Piece",
    usage: "<title>",
    desc: "Cari info manga dari MAL",
    run: async({ sius, m, args, Func }) => {
        //m.reply({ react: { text: "🕣", key: m.key }})
        let res = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/anime/mangainfo?name=${encodeURIComponent(args.join(" "))}`)
        if (!res?.result) return m.reply("⚠️ Manga tidak ditemukan!")
        let r = res.result
        let text = `*▢ Judul:* ${r.title}\n`
        text += `*▢ Type:* ${r.type}\n`
        text += `*▢ Status:* ${r.status}\n`
        text += `*▢ Genre:* ${r.genres}\n`
        text += `*▢ Skor:* ${r.score} (dari ${r.scored_by} users)\n`
        text += `*▢ Rank:* ${r.rank} | *Popularitas:* ${r.popularity}\n`
        text += `*▢ Anggota:* ${r.members}\n\n`
        text += `*▢ Sinopsis:*\n${r.synopsis?.split("\n").slice(0, 2).join("\n")}...\n\n`
        text += `Link: ${r.url}`
        sius.reply(m.chat, text, "MANGA - INFO", false)
    }
})