import axios from "axios"
import * as cheerio from "cheerio"

async function searchPhone(phoneName) {
    try {
        const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(phoneName)}`
        const { data } = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        const $ = cheerio.load(data)

        let links = $(".makers ul li a").toArray().map(el => $(el).attr("href"))

        for (let href of links) {
            let fullUrl = "https://www.gsmarena.com/" + href
            try {
                let { data: page } = await axios.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
                let $$ = cheerio.load(page)
                if ($$("#specs-list").length && $$("h1").text().trim()) {
                    return fullUrl
                }
            } catch (e) {
                continue
            }
        }

        return null
    } catch (e) {
        return null
    }
}

async function getExchangeRates() {
    try {
        const res = await axios.get("https://api.exchangerate-api.com/v4/latest/EUR")
        return res.data.rates
    } catch {
        return null
    }
}

async function scrapeAllSpecs(url) {
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        const $ = cheerio.load(data)
        const specs = {}

        $("div#specs-list table").each((_, table) => {
            const category = $(table).find("th").text().trim()
            const details = {}
            $(table).find("tr").each((_, row) => {
                const key = $(row).find("td.ttl").text().trim()
                const value = $(row).find("td.nfo").text().trim()
                if (key && value) details[key] = value
            })
            if (category && Object.keys(details).length) specs[category] = details
        })

        const phoneName = $("h1").text().trim()
        const priceEur = specs["Misc"]?.["Price"] || "N/A"
        let prices = { EUR: priceEur }

        if (priceEur !== "N/A" && priceEur.includes("EUR")) {
            const eurValue = parseFloat(priceEur.match(/[\d.]+/)[0])
            const rates = await getExchangeRates()
            if (rates) {
                prices = {
                    EUR: `${eurValue.toFixed(2)} EUR`,
                    USD: (eurValue * rates.USD).toFixed(2) + " USD",
                    IDR: (eurValue * rates.IDR).toFixed(0) + " IDR"
                }
            }
        }

        const imageUrl = $(".specs-photo-main img").attr("src") || null
        return { phoneName, specs, prices, imageUrl }
    } catch {
        return null
    }
}

commands.add({
    name: ["gsmarena"],
    command: ["gsmarena", "gsmspek", "hpspek"],
    category: "internet",
    desc: "Cek spesifikasi HP dari GSMArena.",
    usage: "<nama hp>",
    query: true,
    run: async ({ m, text }) => {
        m.reply("Sedang mencari spesifikasi...")

        const phoneUrl = await searchPhone(text)
        if (!phoneUrl) return m.reply(`⚠️ Tidak ditemukan HP dengan nama: *${text}*`)

        const result = await scrapeAllSpecs(phoneUrl)
        if (!result) return m.reply(`⚠️ Gagal mendapatkan data untuk: *${text}*`)

        const { phoneName, specs, prices, imageUrl } = result

        let out = `*▢ ${phoneName}*\n`
        if (prices && prices.EUR !== "N/A") {
            out += `\n▢ Harga:\n`
            for (let [curr, val] of Object.entries(prices)) {
                out += `   ◦ ${curr}: ${val}\n`
            }
        }

        for (let [cat, detail] of Object.entries(specs)) {
            out += `\n▢ ${cat}:\n`
            for (let [k, v] of Object.entries(detail)) {
                out += `   ◦ ${k}: ${v}\n`
            }
        }

        if (imageUrl) {
            m.reply({
                text,
                contextInfo: {
                    externalAdReply: {
                        title: "G S M A R E N A - S P E C",
                        body: phoneName,
                        mediaType: 1,
                        thumbnailUrl: imageUrl,
                        renderLargerThumbnail: true,
                        sourceUrl: global.config?.link || "https://gsmarena.com"
                    }
                }
            })
        } else {
            m.reply(out)
        }
    }
})