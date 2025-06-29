// SEKALIGUS CONTOH PENULISAN STRUKTUR FITUR

commands.add({
    name: ["anime"], // nama fitur di menu 
    command: ["anime"], // commandnya
    category: "anime", // kategori fitur (tags)
    usage: "<title>", // param usage tampilan menu
    example: "jujutsu kaisen", // contoh semisal gda q
    limit: 5, // biaya 5 limit
    cooldown: 10, // cooldown fitur 10 detik per user
    query: true, //wajib ada klo butuh input respon user
    desc: "Cari info anime melalui bot", // deskripsinya
    privatechat: false, //apakah harus di pc?
    group: false, //apakah harus di group
    admin: false, // khusus admin?
    botAdmin: false, // bot harus jadi admin?
    premium: false, // khusus pengguna premium?
    register: false, // harus daftar dulu?
    level: 2, // harus level 2 dulu!
    run: async({ sius, m, text, Func }) => { // functions 
        let res = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/anime/animeinfo?name=${encodeURIComponent(text)}`)
        if (!res.result) return m.reply("⚠️ Anime tidak ditemukan!")
        let r = res.result
        let query = `*ANIME - INFO*\n\n`
        query += `*▢ Judul:* ${r.title}\n`
        query += `*▢ Type:* ${r.type}\n`
        query += `*▢ Status:* ${r.status}\n`
        query += `*▢ Genre:* ${r.genres}\n`
        query += `*▢ Skor:* ${r.score} | *Favorites:* ${r.favorites}\n`
        query += `*▢ Anggota:* ${r.members}\n\n`
        query += `*▢ Sinopsis:*\n${r.synopsis?.split("\n").slice(0, 2).join("\n")}...\n\n`
        query += `Link: ${r.url}`
        m.reply(query, { // m.reply(text)
            contextInfo: { // media: m.reply({ media: })
                externalAdReply: {
                    title: r.title,
                    mediaType: 1,
                    thumbnailUrl: r.images.jpg.image_url,
                    renderLargerThumbnail: true,
                    sourceUrl: r.url
                }
            }
        })
    }
})