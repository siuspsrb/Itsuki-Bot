import fetch from "node-fetch"

commands.add({
    name: ["shorturl", "tinyurl"],
    command: ["shorturl", "tinyurl"],
    category: "tools",
    param: "<url>",
    desc: "Mempersingkat URL panjang menjadi pendek",
    run: async ({ sius, m, args }) => {
        try {
            if (!args[0]) return m.reply("Sertakan URL untuk dipersingkat!")
            const url = args.join(" ").trim()
            if (!url.match(/^(https?:\/\/)/)) return m.reply("Masukkan URL yang valid (contoh: https://example.com)!")
            const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
            const response = await fetch(apiUrl);
            if (!response.ok) return m.reply("Gagal mengakses API TinyURL")
            const shortUrl = await response.text()
            if (!shortUrl || !shortUrl.startsWith("https://tinyurl.com/")) return m.reply("Gagal mempersingkat URL")
            await m.reply(shortUrl)
        } catch (err) {            
            sius.cantLoad(e);            
        }
    }
})