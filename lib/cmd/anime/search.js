commands.add({
    name: ["animesearch"],
    command: ["animesearch"],
    category: "anime",
    alias: ["anisearch", "animelookup"],
    param: "<title>",
    desc: "Mencari anime di Otakudesu berdasarkan nama!",
    limited: true,
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            if (!args[0]) {
                return m.reply(`*Harap masukkan nama anime yang ingin dicari!\n\n> Contoh: *.animesearch Shingeki no Kyojin*`);
            }
            m.reply({ react: { text: "🕣", key: m.key }})
            const query = args.join(" ").trim()            
            const apiUrl = `https://api.siputzx.my.id/api/anime/otakudesu/search?s=${encodeURIComponent(query)}`;
            const result = await Func.fetchJson(apiUrl);
            if (!result || !result.status || !result.data || result.data.length === 0) {
                return m.reply(`[×] Tidak ditemukan anime untuk judul "${query}". Coba judul lain!`);
            }
            const items = result.data.slice(0, 10);
            const caption = `*[√] Hasil pencarian untuk "${query}":*\n\nMenampilkan ${items.length} anime dari Otakudesu.`;         
            const cards = items.map((item, index) => ({
                header: {
                    image: item.imageUrl || 'https://via.placeholder.com/150'
                },
                body: {
                    text: `${item.title}\n⭐ Rating: ${item.rating || 'N/A'}\n🎭 Genre: ${item.genres || 'N/A'}\n📺 Status: ${item.status || 'N/A'}`
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Lihat di Otakudesu",
                            url: item.link
                        })
                    }]
                }
            }));
            await sius.sendCarousel(m.chat, caption, cards, m);
            m.reply({ react: { text: "", key: m.key }})
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})

