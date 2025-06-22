import * as cheerio from "cheerio"

commands.add({
    name: ["jadwaltv"],
    command: ["jadwaltv"],
    param: "<channel>",
    category: "internet",
    limit: true,
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        if (!text) return m.reply("Masukkan nama channel!\n\n> *Contoh:* .jadwaltv mnctv")
        try {
            const channel = text.toLowerCase()
            const url = `https://www.jadwaltv.net/channel/${channel}`
            const res = await Func.fetchJson(url)
            const $ = cheerio.load(res)
            let hasil = ''
            $('table tbody tr').each((i, el) => {
                const jam = $(el).find('td').eq(0).text().trim()
                const acara = $(el).find('td').eq(1).text().trim()
                if (jam && acara && jam.toLowerCase() !== 'jam' && acara.toLowerCase() !== 'acara') {
                    hasil += `▢ ${jam}: ${acara}\n`
                }
            })
            if (!hasil) return m.reply("❌ Channel tidak ditemukan atau tidak ada jadwalnya.")
            m.reply(`*JADWAL ${channel.toUpperCase()} HARI INI:*\n\n${hasil}`)
        } catch (err) {
            sius.cantLoad(err)
        }
    },
    desc: "menampilkan jadwal acara tv dari channel yang dimasukkan",
})