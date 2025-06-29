commands.add({
    name: ["tiktoksearch"],
    command:  ["tiktoksearch"],
    alias: ["tiktoks","searchtiktok"],
    category: "downloader",
    usage: "<keyword>",
    desc: "Laman pencarian tiktok dan mengunduh video hasil pencariannya secara langsung!",
    limit: 5,
    query: true,
    cooldown: 15,
    run: async ({ sius, m, args, Func, dl }) => {
        const query = args.join(" ")
        if (!query) return m.example("kucing lucu") // no
        //m.reply({ react: { text: "🕣", key: m.key }})
        try {
            const result = await dl.tiktoks(query)
            const caption = result.title
            await m.reply({
                video: { url: result.no_watermark },
                caption
            })
            m.reply({ react: { text: "", key: m.key }})
        } catch (err) {
            sius.cantLoad(err)
        }
  }
})

commands.add({
    name: ["tiktok"],
    command: ["tiktok"],
    category: "downloader",
    alias: ["ttmp4","tt","tiktokvideo","tiktokgambar"],
    usage: "<url>",
    desc: "Pengunduh media tiktok!",
    limit: 1,
    query: true,
    cooldown: 15,
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            if (!args[0]) return m.reply("⚠️ Harap kirim link TikTok yang ingin didownload!")
            //m.reply({ react: { text: "🕣", key: m.key }})
            const result = await dl.tiktok(args[0])
            if (!result || !result.status) {
                return m.reply("⚠️ Gagal mendownload konten TikTok");
            }
            const caption = `🎭 *TikTok - ${result.author?.nickname || "Unknown"}*\n` + `❤️ ${result.stats?.likes || "0"} | 👁️ ${result.stats?.views || "0"}\n` + `⌛ ${result.duration || "0"}\n` + `📅 ${result.taken_at || ""}\n\n` + `${result.title ? result.title : ""}`;

            if (result.data && result.data[0]?.type.includes("watermark")) {
                const videoUrl = result.data.find(item => item.type === "nowatermark")?.url || result.data[0].url 
                await m.reply({
                    video: { url: videoUrl },
                    caption,
                })
            } else if (result.data && result.data[0]?.type === "photo") {
                const images = result.data.slice(0, 10).map(item => item.url);                
                const cards = images.map((imageUrl, index) => ({
                    header: {
                        image: imageUrl
                    },
                    body: {
                        text: `Gambar ${index + 1} dari ${images.length}`
                    },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Lihat di TikTok",
                                url: `https://www.tiktok.com/@${result.author?.nickname}/video/${result.id}`
                            })
                        }]
                    }
                }));                
                await sius.sendCarousel(m.chat, caption, cards, m)
                m.reply({ react: { text: "", key: m.key }})
            } else {
                m.reply("⚠️Format konten tidak dikenali");
            }
        } catch (err) {
            sius.cantLoad(err)
        }
    },
  desc: "Mengunduh media tiktok berdasarkan link yang diberikan!"
})