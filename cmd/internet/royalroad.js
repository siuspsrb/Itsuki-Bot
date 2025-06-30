import axios from "axios"
import * as cheerio from "cheerio"

// rrsearch
commands.add({
    name: ["rrsearch"],
    command: ["rrsearch"],
    category: "royalroad",
    desc: "Cari fiksi di RoyalRoad",
    query: true,
    usage: "<judul>",
    example: "magic academy",
    cooldown: 5,
    run: async ({ m, args }) => {
        let q = args.join(" ")
        let { data } = await axios.get(`https://www.royalroad.com/fictions/search?title=${encodeURIComponent(q)}&globalFilters=true`, {
            headers: { "User-Agent": "Mozilla/5.0" }
        })
        let $ = cheerio.load(data)
        let hasil = []

        $(".fiction-list-item").each((_, el) => {
            let title = $(el).find(".fiction-title a").text().trim()
            let url = "https://www.royalroad.com" + $(el).find(".fiction-title a").attr("href")
            let rating = $(el).find(".star").attr("title")?.trim() || "-"
            let status = $(el).find("span.label").eq(1).text().trim()
            let followers = $(el).find("i.fa-users").parent().text().trim()
            hasil.push(`▢ *${title}*\n⤷ 💫 *Rating:* ${rating}\n⤷ 🔖 *Status:* ${status}\n⤷ 👥 *Followers:* ${followers}\n⤷ 🔗 ${url}`)
        })

        if (!hasil.length) return m.reply("⚠️ Gak nemu bang.")
        m.reply(`📚 Hasil pencarian: *${q}*\n\n${hasil.slice(0, 5).join("\n\n")}`)
    }
})

// rrdetail
commands.add({
    name: ["rrdetail"],
    command: ["rrdetail"],
    category: "royalroad",
    desc: "Lihat detail cerita RoyalRoad",
    query: true,
    usage: "<link royalroad>",
    example: "https://www.royalroad.com/fiction/...",
    cooldown: 5,
    run: async ({ m, args }) => {
        let url = args[0]
        if (!/^https:\/\/www\.royalroad\.com\/fiction\/\d+/.test(url)) return m.reply("⚠️ URL gak valid.")
        let { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } })
        let $ = cheerio.load(data)

        let title = $("h1.font-white").text().trim()
        let author = $(".fic-title a").first().text().trim()
        let authorUrl = "https://www.royalroad.com" + $(".fic-title a").first().attr("href")
        let rating = $("span.text-muted:contains('Ratings:')").text().trim()
        let followers = $("span.text-muted:contains('Followers:')").text().trim()
        let words = $("span.text-muted:contains('Words:')").text().trim()
        let summary = $(".description").text().trim().slice(0, 500)

        m.reply(`📖 *${title}*\n👤 *Author:* ${author}\n💬 *Rating:* ${rating}\n👥 *Followers:* ${followers}\n📝 *Words:* ${words}\n🔗 ${url}\n\n📄 ${summary}...`)
    }
})

// rrchapter
commands.add({
    name: ["rrchapter"],
    command: ["rrchapter"],
    category: "royalroad",
    desc: "Ambil isi teks chapter RoyalRoad",
    query: true,
    usage: "<url chapter>",
    example: "https://www.royalroad.com/fiction/123/chapter/1",
    cooldown: 5,
    run: async ({ m, args }) => {
        let url = args[0]
        if (!/^https:\/\/www\.royalroad\.com\/fiction\/\d+\/chapter\/\d+/.test(url)) return m.reply("⚠️ URL chapter gak valid.")
        let { data } = await axios.get(url)
        let $ = cheerio.load(data)
        let isi = $(".chapter-inner.chapter-content").text().trim()
        if (!isi) return m.reply("⚠️ Isi chapter kosong atau gagal ambil.")
        m.reply(isi.slice(0, 4000))
    }
})

// rrlatest
commands.add({
    name: ["rrlatest"],
    command: ["rrlatest"],
    category: "royalroad",
    desc: "Fiksi terbaru update RoyalRoad",
    cooldown: 5,
    run: async ({ m }) => {
        let { data } = await axios.get("https://www.royalroad.com/fictions/latest-updates", {
            headers: { "User-Agent": "Mozilla/5.0" }
        })
        let $ = cheerio.load(data)
        let hasil = []

        $(".fiction-list-item").each((_, el) => {
            let title = $(el).find(".fiction-title a").text().trim()
            let link = "https://www.royalroad.com" + $(el).find(".fiction-title a").attr("href")
            hasil.push(`▢ *${title}*\n⤷ 🔗 ${link}`)
        })

        if (!hasil.length) return m.reply("⚠️ Gagal ambil update.")
        m.reply(`🆕 *Fiksi terbaru RoyalRoad:*\n\n${hasil.slice(0, 5).join("\n\n")}`)
    }
})

// rrrising
commands.add({
    name: ["rrrising"],
    command: ["rrrising"],
    category: "royalroad",
    desc: "Rising stars RoyalRoad",
    cooldown: 5,
    run: async ({ m }) => {
        let { data } = await axios.get("https://www.royalroad.com/home", {
            headers: { "User-Agent": "Mozilla/5.0" }
        })
        let $ = cheerio.load(data)
        let hasil = []

        $("#rising-stars-list .mt-list-item").each((_, el) => {
            let title = $(el).find("h2.fiction-title a").text().trim()
            let url = "https://www.royalroad.com" + $(el).find("h2.fiction-title a").attr("href")
            hasil.push(`▢ *${title}*\n⤷ 🔗 ${url}`)
        })

        m.reply(`🌟 *Rising Stars:*\n\n${hasil.slice(0, 5).join("\n\n")}`)
    }
})

// rrpopular
commands.add({
    name: ["rrpopular"],
    command: ["rrpopular"],
    category: "royalroad",
    desc: "Popular minggu ini RoyalRoad",
    cooldown: 5,
    run: async ({ m }) => {
        let { data } = await axios.get("https://www.royalroad.com/home", {
            headers: { "User-Agent": "Mozilla/5.0" }
        })
        let $ = cheerio.load(data)
        let hasil = []

        $(".popular-this-week-carousel .text-center").each((_, el) => {
            let title = $(el).find("h4").text().trim()
            let url = "https://www.royalroad.com" + $(el).find("a").attr("href")
            hasil.push(`▢ *${title}*\n⤷ 🔗 ${url}`)
        })

        m.reply(`🔥 *Popular This Week:*\n\n${hasil.slice(0, 5).join("\n\n")}`)
    }
})

// rrcompleted
commands.add({
    name: ["rrcompleted"],
    command: ["rrcompleted"],
    category: "royalroad",
    desc: "Best completed fictions",
    cooldown: 5,
    run: async ({ m }) => {
        let { data } = await axios.get("https://www.royalroad.com/home")
        let $ = cheerio.load(data)
        let hasil = []

        $(".portlet-title:contains('Best Completed')")
            .closest(".portlet")
            .find("li.mt-list-item").each((_, el) => {
                let title = $(el).find("h2.fiction-title a").text().trim()
                let link = "https://www.royalroad.com" + $(el).find("h2.fiction-title a").attr("href")
                hasil.push(`▢ *${title}*\n⤷ 🔗 ${link}`)
            })

        m.reply(`✅ *Best Completed:*\n\n${hasil.slice(0, 5).join("\n\n")}`)
    }
})

// rrongoing
commands.add({
    name: ["rrongoing"],
    command: ["rrongoing"],
    category: "royalroad",
    desc: "Best ongoing fictions",
    cooldown: 5,
    run: async ({ m }) => {
        let { data } = await axios.get("https://www.royalroad.com/home")
        let $ = cheerio.load(data)
        let hasil = []

        $(".caption-subject:contains('Best Ongoing')")
            .closest(".portlet")
            .find("li.mt-list-item").each((_, el) => {
                let title = $(el).find("h2.fiction-title a").text().trim()
                let url = "https://www.royalroad.com" + $(el).find("h2.fiction-title a").attr("href")
                hasil.push(`▢ *${title}*\n⤷ 🔗 ${url}`)
            })

        m.reply(`🪄 *Best Ongoing:*\n\n${hasil.slice(0, 5).join("\n\n")}`)
    }
})

// rrprofile
commands.add({
    name: ["rrprofile"],
    command: ["rrprofile"],
    category: "royalroad",
    desc: "Lihat profil user RoyalRoad",
    query: true,
    usage: "<link profile royalroad>",
    example: "https://www.royalroad.com/profile/123",
    cooldown: 5,
    run: async ({ m, args }) => {
        let url = args[0]
        if (!/^https:\/\/www\.royalroad\.com\/profile\/\d+/.test(url)) return m.reply("⚠️ URL profil gak valid.")
        let { data } = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        })
        let $ = cheerio.load(data)
        let name = $(".profile-stats .username h1").text().trim()
        let joined = $("th:contains('Joined:')").next().text().trim()
        let last = $("th:contains('Last Active:')").next().text().trim()
        let gender = $("th:contains('Gender:')").next().text().trim()
        let loc = $("th:contains('Location:')").next().text().trim()

        m.reply(`👤 *${name}*\n🗓️ *Joined:* ${joined}\n🕒 *Last Active:* ${last}\n🚻 *Gender:* ${gender || "-"}\n📍 *Location:* ${loc || "-"}\n🔗 ${url}`)
    }
})