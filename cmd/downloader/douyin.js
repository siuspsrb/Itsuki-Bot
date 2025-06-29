import axios from "axios"
import * as cheerio from "cheerio"
import qs from "qs"

commands.add({
    name: ["douyin"],
    command: ["douyin"],
    category: "downloader",
    desc: "download video douyin tanpa watermark",
    usage: "<url>",
    limit: true,
    query: true,
    example: "https://v.douyin.com/iPX4EBFY/",
    run: async ({ sius, m, args, Func }) => {
        const url = args[0]
        //m.reply({ react: { text: "🕣", key: m.key }})
        try {
            const postData = qs.stringify({
                q: url,
                lang: "id",
                cftoken: ""
            })
            const res = await axios.post("https://tikvideo.app/api/ajaxSearch", postData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Accept": "*/*",
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            if (res.data.status !== "ok") return m.reply("[×] Gagal mengambil data dari douyin.")
            const html = res.data.data
            const $ = cheerio.load(html)
            const videos = []
            $(".tik-video").each((_, el) => {
                const downloadLinks = []
                $(el).find(".dl-action a").each((_, link) => {
                    downloadLinks.push({
                        title: $(link).text().trim(),
                        url: $(link).attr("href")
                    })
                })
                videos.push({ downloadLinks })
            })
            if (!videos.length) return m.reply("[×] ga nemu video di situ.")
            const pick = videos[0]
            const hd = pick.downloadLinks.find(x => /hd/i.test(x.title))
            const mp4_2 = pick.downloadLinks.find(x => /mp4 2/i.test(x.title))
            const mp4_1 = pick.downloadLinks.find(x => /mp4 1/i.test(x.title))
            const mp3 = pick.downloadLinks.find(x => /mp3/i.test(x.title))
            if (hd) {
                await m.reply({ video: { url: hd.url } })
            } else if (mp4_2) {
                await m.reply({ video: { url: mp4_2.url } })
            } else if (mp4_1) {
                await m.reply({ video: { url: mp4_1.url } })
            }
            if (mp3) {
                await m.reply({
                    audio: { url: mp3.url },
                    mimetype: "audio/mpeg"
                })
            }
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})