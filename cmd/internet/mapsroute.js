commands.add({
    name: ["mapsroute"],
    command: ["mapsroute"],
    category: "internet",
    desc: "cari rute perjalanan antara dua lokasi",
    usage: "<dari>;<ke>",
    example: "jakarta;bandung",
    query: true,
    run: async ({ sius, m, args }) => {
        if (args.length < 1) return m.reply(`⚠️ masukkan format yg bener:\ncontoh: .mapsroute Jakarta;Bandung`)
        const input = args.join(" ").split(";")
        const [from, to] = input.map(v => v.trim())
        if (!from || !to) return m.reply(`⚠️ format salah. pisahkan lokasi dgn titik koma (;)\ncontoh: .mapsroute Jakarta;Bandung`)
        const res = await fetch(`https://fastrestapis.fasturl.cloud/search/gmaps?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&language=id`)
        const json = await res.json()
        if (json.status !== 200) return m.reply("⚠️ Gagal ambil data rute")
        m.reply(`🛫 Dari: ${from}\n🛬 Ke: ${to}\n🌐 Link: ${json.result.mapUrl}`)
    }
})