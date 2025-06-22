import yts from "yt-search"

commands.add({
    name: ["yts"],
    command: ["yts"],
    desc: "Searching anything from YouTube easily!",
    limit: true,
    cooldown: 60,
    param: "<keyword>",
    category: "search",
    run: async ({ sius, m, args, Func }) => {
        try {
            if (!args[0]) return m.reply("Contoh: .youtube Lagu Indonesia");
            const query = args.join(" ");
            const { videos } = await yts(query);
            if (!videos || videos.length === 0) {
                return m.reply("Ga ada hasil ditemukan");
            }
            // ambil 5 video pertama (biar ga spam)
            const cards = videos.slice(0, 5).map(video => ({
                header: {
                    title: video.title,
                    image: video.thumbnail
                },
                body: {
                    text: `🎬 *${video.title}*\n🕵🏼 *${video.author.name}*\n⏱️ ${video.timestamp || 'N/A'}\n👁️ ${video.views || 'N/A'}`
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Tonton di YouTube",
                            url: video.url
                        })
                    }]
                }
            }));
            await sius.sendCarousel(
                m.chat,
                `🔎 *Hasil Pencarian YouTube:* ${query}`,
                cards,
                m
            );

        } catch (e) {
            sius.cantLoad(e)
        }
    }
});