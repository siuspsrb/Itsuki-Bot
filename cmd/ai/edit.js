import { GoogleGenerativeAI } from "@google/generative-ai"
import fs from "fs"
import path from "path"
import { exec } from "child_process"

async function convertImageToSticker(inPath, outputPath) {
    return new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${inPath}" -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -compression_level 6 -q:v 50 -loop 0 -preset picture -an -vsync 0 "${outputPath}"`, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

commands.add({
    name: ["editor","ai-edit"],
    command: ["editor","ai-edit"],
    category: "ai",
    alias: ["edit"],
    desc: "Mengedit gambar/stiker sesuai prompt",
    usage: "<reply-image>",
    cooldown: 30,
    limit: 12,
    run: async ({ sius, m, args, Func }) => {
        let q = m.quoted ? m.quoted : m
        let text = args.join(" ")
        let mime = (q.msg || q).mimetype || ""
        if (!mime) return m.reply(`⚠️ Kirim atau reply gambar/stiker dengan caption *${m.prefix + m.command} tambahkan pelangi*`)
        if (!/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`⚠️ Format *${mime}* tidak didukung!`)
        const promptText = text || "Ubah gambar atau stiker ini menjadi suasan ghibli dengan resolusi yang bagus"
        //m.reply({ react: { text: "🕣", key: m.key }})
        try {
            let imgData = await q.download()
            let genAI = new GoogleGenerativeAI("AIzaSyC4suCdzUpdJvimpZ2fLgFR_zTJk1vYkVY")
            const base64Image = imgData.toString("base64")
            const contents = [{ text: promptText },{
                inlineData: {
                    mimeType: mime,
                    data: base64Image
                }
            }]
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash-exp-image-generation",
                generationConfig: {
                    responseModalities: ["Text", "Image"]
                }
            })
            const response = await model.generateContent(contents)
            let resultImage
            for (const part of response.response.candidates[0].content?.parts) {
                if (part.inlineData) {
                    const gmbrn = part.inlineData.data
                    resultImage = Buffer.from(gmbrn, "base64")
                }
            }
            if (resultImage) {
                const tempPath = path.join(process.cwd(), "lib/database/sampah", `aiimg_${Date.now()}.png`)
                fs.writeFileSync(tempPath, resultImage)
            if (/image\/webp/.test(mime)) {
                const stickerPath = path.join(process.cwd(), "lib/database/sampah", `aiimg_${Date.now()}.webp`)
                await convertImageToSticker(tempPath, stickerPath)
                m.reply({ sticker: { url: stickerPath }})
            } else {
                m.reply({ image: { url: tempPath }})
            }
            } else {
                m.reply("⚠️ Gagal memuat gambar.")
            }
        } catch (error) {
            sius.sendMessage(config.creator, { text: "⚠️ Error pak, image edit ai!" }, { quoted: m })
        }
    }
})