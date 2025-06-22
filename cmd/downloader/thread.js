commands.add({
    name: ["threads"],
    command: ["threads"],
    alias: ["thread"],
    category: "downloader",
    desc: "Download video dari Threads",
    usage: "<url-thread>",
    query: true,
    limit: 5,
    run: async ({ sius, m, args, Func }) => {
        const url = args[0].trim();
        if (!url.includes("threads.net")) return m.reply(`⚠️ URL tidak valid! Pastikan URL dari Threads \n\n> Contoh: https://www.threads.net/@user/post/abc123`)
        //m.reply({ react: { text: "🕣", key: m.key }})
        try {
            const apiUrl = `https://www.velyn.biz.id/api/downloader/threads?url=${encodeURIComponent(url)}`;
            const response = await Func.fetchJson(apiUrl)
            if (!response.status || !response.result?.media) {
                return m.reply(`⚠️ Gagal mengambil video: ${response.message || "Data tidak ditemukan"}. Coba URL lain.`);
            }
            const { title, media } = response.result   
            await m.reply({
                video: { url: media },
                mimetype: "video/mp4",
                caption: title ? title : "",
            })
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})