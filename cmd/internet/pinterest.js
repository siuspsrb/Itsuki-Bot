commands.add({
    name: ["pinterest"],
    command: ["pinterest"],
    alias: ["pin"],
    desc: "Find any pictures from pinterest",
    limit: true,
    cooldown: 60, //😋
    param: "<keyword>",
    category: "internet",
    run: async ({ sius, m, args, Func }) => {
        try {
            if (!args[0]) return m.reply("*Contoh penggunaan:* .pinterest ariana grande")
            let keyword = args.join(" ")
            const result = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/search/pinterest?name=${encodeURIComponent(keyword)}`)
            if (!result || result.status !== 200 || !result.result || result.result.length === 0) {
                return m.reply("Gagal mendapatkan gambar, coba keyword lain!")
            }
            const images = result.result.slice(0, 5).map(item => item.directLink)
            const links = result.result.slice(0, 5).map(item => item.link)
            const cards = images.map((url, index) => ({
                header: {
                    image: url
                },
                body: {
                    text: `Gambar ${index + 1} dari ${images.length}`
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Lihat di Pinterest",
                            url: links[index]
                        })
                    }]
                }
            }))
            
            // Kirim carousel
            await sius.sendCarousel(m.chat, `Hasil pencarian *${keyword}*`, cards, m)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})