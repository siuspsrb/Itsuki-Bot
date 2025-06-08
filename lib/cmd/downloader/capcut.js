commands.add({
    name: ["capcut"],
    command: ["capcut"],
    category: "downloader",
    limited: true,
    desc: "Pengunduh video template capcut",
    run: async({ sius, m, args, Func }) => {
        let q = args.join(" ")
        if (!q) return m.reply("[×] Sertakan link template capcut yang ingin diunduh!")
        m.reply({ react: { text: "🕣", key: m.key }})
        let zer = await Func.fetchJson(`https://velyn.biz.id/api/downloader/capcut?url=${encodeURIComponent(url)}&apikey=velyn`)
        const {
            title,
            author,
            videoUrl
        } = zer;
        let caption = `*CAPCUT TEMPLATE DOWNLOADER*\n\n`;
        caption += `*▢ Judul:* ${title}\n`;
        caption += `*▢ Author:* ${author.name}\n`;
        caption += `*▢ Link:* ${url}`;
        m.reply({ video: { url: videoUrl }, caption })
            .catch((e) => sius.cantLoad(e))
    }
})