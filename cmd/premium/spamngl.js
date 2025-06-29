import fetch from "node-fetch"

commands.add({
    name: ["spamngl"],
    command: ["spamngl"],
    category: "tools",
    desc: "spam pesan anonymous ke link NGL",
    usage: "<link NGL> <jumlah> <pesan>",
    example: "https://ngl.link/sius.xcx 10 halo dari bot!",
    query: true,
    premium: true,
    run: async ({ sius, m, args }) => {
        if (args.length < 3) return m.reply("⚠️ penggunaan: .spamngl <link NGL> <jumlah> <pesan>\ncontoh: .spamngl https://ngl.link/sius.xcx 10 halo dari bot!")

        const linkNGL = args[0]
        if (!linkNGL.includes("ngl.link")) return m.reply("⚠️ link NGL ga valid! harus ngandung `ngl.link`")

        const count = parseInt(args[1])
        if (isNaN(count) || count <= 0) return m.reply("⚠️ jumlah harus angka yg valid dan lebih dari 0")

        const pesan = args.slice(2).join(" ")
        await m.reply(`[√] Mengirim ${count} pesan ke ngl, tunggu sebentar...`)

        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/spamngl?link=${encodeURIComponent(linkNGL)}&message=${encodeURIComponent(pesan)}&type=anonymous&count=${count}`

        const res = await fetch(apiUrl)
        if (!res.ok) return m.reply("⚠️ server error, coba lagi nanti")

        const json = await res.json()

        if (json.status === 200 && json.content === "Success") {
            return m.reply(`[√] Berhasil kirim ${count} pesan ke: ${json.result.sentTo}\n\n*Isi:* ${json.result.message}`)
        } else {
            return m.reply("⚠️ gagal kirim spam ke ngl.")
        }
    }
})