commands.add({
    name: ["capcut"],
    command: ["capcut"],
    category: "downloader",
    limit: 5,
    desc: "Pengunduh video template capcut",
    query: true,
    usage: "<link>",
    run: async({ sius, m, args, Func }) => {
        let q = args.join(" ")
        //m.reply({ react: { text: "🕣", key: m.key }})
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
    }
})