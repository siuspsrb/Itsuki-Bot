commands.add({
    name: ["igstalk"],
    command: ["igstalk"],
    category: "stalk",
    alias: ["stalkig","instagramstalk","stalkinstagram"],
    desc: "melihat info profil Instagram dari username yang dimasukkan",
    limited: true,
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        if (!text) return m.reply("[×] *Contoh:* .igstalk trindsess")
        const json = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/stalk/instagram?username=${encodeURIComponent(text)}`)
        if (!json || !json.result) return m.reply("[×] Gagal mengambil data.")
        const res = json.result
        let msg = `▢ *Username:* ${res.name}\n`
        msg += `▢ *Bio:* ${res.description || "-"}\n`
        msg += `▢ *Followers:* ${res.followers}\n`
        msg += `▢ *Posts:* ${res.uploads}\n`
        msg += `▢ *Engagement:* ${res.engagementRate}\n`
        msg += `▢ *Avg. Aktivitas:* ${res.averageActivity}\n`
        msg += `▢ *Post per Day:* ${res.postsPerDay || "-"}\n`
        msg += `▢ *Post per Week:* ${res.postsPerWeek || "-"}\n`
        msg += `▢ *Post per Month:* ${res.postsPerMonth || "-"}\n`
        msg += `▢ *Waktu post terbaik:* ${res.mostPopularPostTime || "-"}\n`
        msg += `▢ *Top Hashtags:* ${res.hashtags.slice(0, 5).join(", ") || "-"}\n`
        msg += `> https://www.instagram.com/${res.name}/`
        m.reply(msg, {
            contextInfo: {
                externalAdReply: {
                    title: `@${res.name}`,
                    mediaType: 1,
                    previewType: "PHOTO",
                    renderLargerThumbnail: true,
                    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
                    mediaUrl: `https://www.instagram.com/${res.name}/`,
                    sourceUrl: `https://www.instagram.com/${res.name}/`
                }
            }
        })
    }
})