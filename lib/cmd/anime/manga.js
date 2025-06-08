commands.add({
    name: ["manga"],
    command: ["manga"],
    category: "anime",
    limited: true,
    desc: "Cari info manga dari MAL",
    run: async({ sius, m, args, Func }) => {
        let q = args.join(" ")
        if (!q) return m.reply("[×] Sertakan judul manga yang ingin dicari!")
        m.reply({ react: { text: "🕣", key: m.key }})
        let res = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/anime/mangainfo?name=${encodeURIComponent(q)}`)
        if (!res?.result) return m.reply("[×] Manga tidak ditemukan!")
        let r = res.result
        let text = `*MANGA - INFO*\n\n`
        text += `*▢ Judul:* ${r.title}\n`
        text += `*▢ Type:* ${r.type}\n`
        text += `*▢ Status:* ${r.status}\n`
        text += `*▢ Genre:* ${r.genres}\n`
        text += `*▢ Skor:* ${r.score} (dari ${r.scored_by} users)\n`
        text += `*▢ Rank:* ${r.rank} | *Popularitas:* ${r.popularity}\n`
        text += `*▢ Anggota:* ${r.members}\n\n`
        text += `*▢ Sinopsis:*\n${r.synopsis?.split("\n").slice(0, 2).join("\n")}...\n\n`
        text += `Link: ${r.url}`
        await m.reply(text)
        m.reply({ react: { text: "", key: m.key }})
    }
})