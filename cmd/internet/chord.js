commands.add({
    name: ["chord"],
    command: ["chord"],
    category: "search",
    limit: true,
    usage: "<song>",
    desc: "Searching chord key easily",
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            if (!args[0]) return m.reply("Masukin judul lagunya dong, contoh:\n.chord dandelions")
            const query = args.join(" ")
            const data = await dl.chord(query)
            if (!data) return m.reply("Lagu tidak ditemukan, coba judul lain ya!")
            let teks = `🎸 *Chord Lagu*\n\n`
            teks += `🎵 *Judul:* ${data.title}\n`
            teks += `👤 *Artist:* ${data.artist}\n`
            teks += `🔗 *Link:* ${data.source_url}\n\n`
            teks += `📝 *Chord:*\n${data.chord.length > 3000 ? data.chord.slice(0, 3000) + "..." : data.chord}`
            m.reply(teks)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["cekgempa"],
    command: ["cekgempa"],
    category: "search",
    limit: true,
    desc: "Informasi update gempa terbaru",
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            const response = await Func.fetchJson(`https://api.agatz.xyz/api/gempa`)
            if (!response || !response.data) {
                throw m.reply("Tidak dapat mengambil data gempa.");
            }
            let gempa = `▢ *Wilayah:* ${response.data.wilayah || "Tidak diketahui"}
▢ *Tanggal:* ${response.data.tanggal || "Tidak diketahui"}
▢ *Kedalaman:* ${response.data.kedalaman || "Tidak diketahui"}
▢ *Waktu:* ${response.data.waktu || "Tidak diketahui"}
▢ *Potensi:* ${response.data.potensi || "Tidak diketahui"}
▢ *Dirasakan:* ${response.data.dirasakan || "Tidak diketahui"}
▢ *Magnitudo:* ${response.data.magnitune || "Tidak diketahui"}`;

            m.reply(gempa)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})