commands.add({
    name: ["komikindo"],
    command: ["komikindo"],
    category: "anime",
    param: "<url>",
    desc: "download chapter komik dari komikindo",
    limited: true,
    run: async({ sius, m, args, Func }) => {
        try {
            let text = args.join(" ")
            if (!text || !text.includes("komikindo.pw")) {
                return m.reply("Linknya harus dari *komikindo.pw*\n\n> contoh: .komikindo https://komikindo.pw/solo-leveling-chapter-1")
            }
            m.reply({ react: { text: "🕣", key: m.key }})
            let api = `https://api.siputzx.my.id/api/anime/komikindo-download?url=${encodeURIComponent(text)}`
            let res = await Func.fetchJson(api)
            if (!res?.status || !res.data?.length) {
                return m.reply("[×] Gagal ambil gambar komiknya")
            }
            let pages = res.data.slice(0, 10)
            let cards = pages.map((img, i) => ({
                header: {
                    image: img
                },
                body: {
                    text: `Halaman ${i + 1} dari ${res.data.length}`
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Salin URL Gambar",
                            copy_code: img
                        })
                    }]
                }
            }))
            let caption = `*KOMIKINDO*\n\n▢ Total halaman: ${res.data.length}\n▢ Judul: ${res.title || "-"}\n\n> Hanya dapat menampilkan maksimal 10 halaman!`
            await sius.sendCarousel(m.chat, caption, cards, m)
            m.reply({ react: { text: "", key: m.key }})
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})