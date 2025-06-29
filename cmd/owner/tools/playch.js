import axios from "axios"
// credits: flowfalcon

commands.add({
    name: ["playchannel"],
    command: ["playchannel"],
    alias: ["playch"],
    category: "owner-tools",
    desc: "kirim lagu ke channel whatsapp",
    usage: "<link/judul lagu>",
    example: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    query: true,
    owner: true,
    run: async ({ sius, m, text, command }) => {
        let title, author, audioUrl, thumbnail, videoUrl
        if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)) {
            const { data } = await axios.get(`https://cloudkutube.eu/api/yta?url=${encodeURIComponent(text)}`)
            if (data.status !== "success") return m.reply("⚠️ gagal ambil audio dari link")
            ;({ title, author, url: audioUrl, thumbnail } = data.result)
            videoUrl = text
        } else {
            const search = await axios.get(`https://flowfalcon.dpdns.org/search/youtube?q=${encodeURIComponent(text)}`)
            const list = search.data.result
            if (!list || !list.length) return m.reply("⚠️ Video ga ketemu")
            const video = list[0]
            const { data } = await axios.get(`https://cloudkutube.eu/api/yta?url=${encodeURIComponent(video.link)}`)
            if (data.status !== "success") return m.reply("⚠️ Gagal ambil audio dari pencarian")
            ;({ title, author, url: audioUrl, thumbnail } = data.result)
            videoUrl = video.link
        }

        const channelId = config.channel
        const contextInfo = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelId,
                serverMessageId: Math.floor(Math.random() * 999999),
                newsletterName: config.bot.name,
            },
            externalAdReply: {
                title,
                body: `By ${author}`,
                thumbnailUrl: thumbnail,
                mediaType: 1,
                sourceUrl: videoUrl
            }
        }
        const audioRes = await axios.get(audioUrl, { responseType: "arraybuffer" })
        const audioBuffer = Buffer.from(audioRes.data, "binary")
        await sius.sendMessage(channelId, {
            audio: audioBuffer,
            mimetype: "audio/mp4",
            ptt: true,
            contextInfo
        })
        return m.reply(`[√] Sukses memainkan lagu *${title}* ke channel`)
    }
})