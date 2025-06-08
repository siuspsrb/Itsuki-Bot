commands.add({
    name: ["instagram"],
    command: ["instagram"],
    category: "downloader",
    alias: ["igmp4","igvideo","ig","igreel","igphoto","reels"],
    param: "<url>",
    desc: "Pengunduh media Instagram!",
    limited: true,
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            if (!args[0]) return m.reply(`[×] Kirim link Instagram yang ingin didownload!\nContoh: *.instagram https://www.instagram.com/reel/C_Phn6NSIfQ*`)
            const url = args[0].trim();
            if (!url.includes('instagram.com')) return m.reply(`[×] URL tidak valid! Pastikan URL dari Instagram\n\n> Contoh: https://www.instagram.com/reel/C_Phn6NSIfQ`)
            m.reply({ react: { text: "🕣", key: m.key }})
            const apiUrl = `https://fastrestapis.fasturl.cloud/downup/igdown/advanced?url=${encodeURIComponent(url)}&type=detail`;
            const result = await Func.fetchJson(apiUrl);
            if (!result || result.status !== 200 || !result.result) {
                return m.reply(`[×] Gagal mendownload konten Instagram: ${result?.message || 'Data tidak ditemukan'}.`);
            }
            const { is_video, video_url, images, caption, owner, like_count, comment_count, taken_at_timestamp, shortcode } = result.result;
            const captionText = `📸 *Instagram - ${owner?.username || 'Unknown'}*\n` +
                               `❤️ Suka: ${like_count || 0} | 💬 Komentar: ${comment_count || 0}\n` +
                               `📅 ${new Date(taken_at_timestamp * 1000).toLocaleDateString('id-ID')}\n\n` +
                               `${caption?.text || 'Tanpa caption'}`;
            if (is_video && video_url) {
                await m.reply({
                    video: { url: video_url },
                    mimetype: 'video/mp4',
                    caption: captionText
                });
            }
            else if (images && images.length > 0) {
                const imageUrls = images.slice(0, 10)
                const cards = imageUrls.map((imageUrl, index) => ({
                    header: {
                        image: imageUrl
                    },
                    body: {
                        text: `Gambar ${index + 1} dari ${imageUrls.length}`
                    },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Lihat di Instagram",
                                url: `https://www.instagram.com/p/${shortcode}`
                            })
                        }]
                    }
                }));
                await sius.sendCarousel(m.chat, captionText, cards, m);
            } else {
                m.reply(`[×] Format konten tidak dikenali atau tidak ada media yang tersedia.`);
            }
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})