commands.add({
    name: ["animesearch"],
    command: ["animesearch"],
    category: "anime",
    alias: ["anisearch", "animelookup"],
    usage: "<title>",
    desc: "Mencari anime di Otakudesu berdasarkan nama!",
    limit: 8,
    query: true,
    example: "Shingeki no Kyojin",
    run: async ({ sius, m, text, Func }) => {
        //m.reply({ react: { text: "🕣", key: m.key }})
        const apiUrl = `https://api.siputzx.my.id/api/anime/otakudesu/search?s=${encodeURIComponent(text)}`;
        const result = await Func.fetchJson(apiUrl);
        if (!result || !result.status || !result.data || result.data.length === 0) {
            return m.reply(`⚠️ Tidak ditemukan anime untuk judul "${text}". Coba judul lain!`);
        }
        const items = result.data.slice(0, 10);
        const caption = `*[√] Hasil pencarian untuk "${text}":*\n\nMenampilkan ${items.length} anime dari Otakudesu.`;         
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
        sius.sendCarousel(m.chat, caption, cards, m);
        //m.reply({ react: { text: "", key: m.key }})
    }
})