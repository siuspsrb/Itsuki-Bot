import fetch from "node-fetch"

commands.add({
    name: ["sendngl"],
    command: ["sendngl"],
    category: "tools",
    desc: "kirim pesan anonim ke link NGL",
    usage: "<link ngl> <pesan>",
    example: "https://ngl.link/sius.xcx halo dari bot!",
    query: true,
    run: async ({ sius, m, args }) => {
        if (args.length < 2) return m.reply(`[×] penggunaan salah\ncontoh: .sendngl https://ngl.link/sius.xcx halo dari bot`)
        let linkNGL = args[0]
        if (!linkNGL.includes("ngl.link")) return m.reply(`⚠️ link ngl tidak valid`)
        let pesan = args.slice(1).join(" ")
        let apiUrl = `https://fastrestapis.fasturl.cloud/tool/sendngl?link=${encodeURIComponent(linkNGL)}&message=${encodeURIComponent(pesan)}&type=anonymous`
        let res = await fetch(apiUrl)
        if (!res.ok) throw await res.text()
        let json = await res.json()
        if (json.status === 200 && json.content === "Success") {
            m.reply(`✅ Berhasil kirim pesan ke ${json.result.sentTo}\n\n▢ *Isi pesan:* ${json.result.message}`)
        } else {
            return m.reply("⚠️ gagal mengirim pesan ke NGL")
        }
    }
})