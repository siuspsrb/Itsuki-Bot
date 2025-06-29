import fetch from "node-fetch"

commands.add({
    name: ["stokgag"],
    command: ["stokgag"],
    alias: ["growagardenstok","stokgrowagarden"],
    category: "info",
    desc: "cek stok grow a garden",
    run: async ({ sius, m }) => {
        const res = await fetch("https://zenzxz.dpdns.org/info/growagardenstock")
        const json = await res.json()
        if (!json.status || !json.data?.data)
            return m.reply("⚠️ Yah data nya gaada:(")
        const data = json.data.data
        const formatItems = (title, items) => {
            if (!items?.length) return ""
            let text = `\n▢ *${title.toUpperCase()}*\n`
            for (const item of items) {
                text += `   ⤷ ${item.name} = ${item.quantity}\n`
            }
            return text
        }
        const formatWeather = (w) => {
            return `\n▢ *Cuaca saat ini*\n   ⤷ Tipe  : ${w.type}\n   ⤷ Aktif : ${w.active ? "✅ yaa" : "❌ tidak"}`
        }
        const formatWeatherHistory = (history) => {
            if (!history?.length) return ""
            let text = `\n▢ *Riwayat Cuaca*\n`
            for (const w of history) {
                text += `   ⤷ ${w.type} (${w.active ? "aktif" : "tidak"})\n`
            }
            return text
        }
        let teks = formatItems("seeds", data.seeds)
        teks += formatItems("gear", data.gear)
        teks += formatItems("eggs", data.eggs)
        teks += formatItems("cosmetics", data.cosmetics)
        teks += formatItems("honey", data.honey)
        teks += formatWeather(data.weather)
        teks += formatWeatherHistory(data.weatherHistory)
        teks += `\n\n[√] Last update: *${new Date(data.lastGlobalUpdate).toLocaleString("id-ID")}*`
        sius.reply(m.chat, teks.trim(), "🌿 GROW A GARDEN STOK INFO", false)
    }
})