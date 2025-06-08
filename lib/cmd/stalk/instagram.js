commands.add({
    name: ["stalktiktok"],
    command: ["stalktiktok"],
    category: "stalk",
    alias: ["ttstalk","tiktokstalk","stalktt"],
    desc: "melihat info profil TikTok dari username yang dimasukkan",
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        if (!text) return m.reply("*Contoh:* .ttstalk wilisalim")
        const data = await Func.fetchJson(`https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(text)}`)
        if (!data || !data.data || !data.data.user) {
            return m.reply("⚠️ Gagal mengambil info profile TikTok.")
        }
        const { user, stats } = data.data;
        const { uniqueId, nickname, signature, avatarLarger, region } = user;
        const { followerCount, followingCount, heart, videoCount } = stats;
        let txt = `▢ *Username:* ${uniqueId}\n`;
            txt += `▢ *Nickname:* ${nickname}\n`;
            txt += `▢ *bio:* ${signature}\n`;
            txt += `▢ *Region:* ${region}\n`;
            txt += `▢ *Followers:* ${followerCount}\n`;
            txt += `▢ *Following:* ${followingCount}\n`;
            txt += `▢ *Total Likes (Hearts):* ${heart}\n`;
            txt += `▢ *Total Videos:* ${videoCount}\n\n`;
            txt += `> https://www.tiktok.com/@${uniqueId}\n`;
        m.reply(txt, {
            contextInfo: {
                externalAdReply: {
                    mediaUrl: avatarLarger,
                    thumbnailUrl: avatarLarger,
                    previewType: "PHOTO",
                    mediaType: 1,
                    sourceUrl: `https://www.tiktok.com/@${uniqueId}`,
                    title: `@${uniqueId}`,
                    renderLargerThumbnail: true
                }
            }
        })
    }
})
