import { Sticker } from "wa-sticker-formatter"
import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import path from "path"
import fetch from "node-fetch"

commands.add({
    name: ["smeme"],
    command: ["smeme"],
    category: "sticker",
    desc: "buat sticker meme dari gambar dan teks atas bawah",
    alias: ["stickermeme","stikermeme"],
    usage: "<teks atas>|<teks bawah>",
    example: "gue|capek bro",
    query: true,
    limit: true,
    run: async ({ sius, m, args }) => {
        let [atas, bawah] = args.join(" ").split("|")
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ""
        if (!mime) return m.reply(`⚠️ Balas gambar/video dengan command ini ya\ncontoh: .smeme atas|bawah`)

        let mediaBuffer = await q.download()
        let ext = mime.split("/")[1] || "png"
        let tempFile = path.join(process.cwd(), `lib/database/sampah/${Date.now()}.${ext}`)
        fs.writeFileSync(tempFile, mediaBuffer)
        let url = await uploadUguu(tempFile)
        let result
        if (mime.startsWith("image/")) {
            let memeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas || " ")}/${encodeURIComponent(bawah || " ")}.png?background=${url}`
            result = await createSticker(memeUrl, "", "")
        } else {
            result = await createSticker(url, "", "")
        }
        await m.reply({ sticker: result })
        fs.unlinkSync(tempFile)
    }
})

async function uploadUguu(filePath) {
    const form = new FormData()
    form.append("files[]", fs.createReadStream(filePath))
    const { data } = await axios.post("https://uguu.se/upload", form, {
        headers: { ...form.getHeaders() }
    })
    return data.files[0].url
}

async function createSticker(img, packName, authorName, quality = 100) {
    let stickerMetadata = {
        type: "full",
        pack: packName,
        author: authorName || "zenz nih",
        quality
    }
    return (new Sticker(img, stickerMetadata)).toBuffer()
}