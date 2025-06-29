import axios from "axios"
import FormData from "form-data"
import { randomUUID, randomBytes } from "crypto"

commands.add({
    name: ["toghibli"],
    command: ["toghibli"],
    category: "ai-tools",
    desc: "Ubah gambar jadi gaya Ghibli",
    param: "<teks prompt>",
    limit: 15,
    cooldown: 60,
    run: async ({ sius, m, args }) => {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ""
        if (!mime) return m.reply(`[×] Kirim atau reply gambar/stiker dengan caption *${m.prefix + m.command} vibes lautan*`)
        if (!/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`[×] Format *${mime}* tidak didukung!`)
        const uuid = randomUUID()
        const buffer = await q.download()
        if (!buffer) return m.reply("[×] Gagal download media.")
        const mimetype = mime 
        const ext = "." + mimetype.split("/")[1]
        const filename = `Fiony_${randomBytes(4).toString("hex")}${ext}`
        const form = new FormData()
        form.append("file", buffer, { filename, contentType: mimetype })
        const headers = {
            ...form.getHeaders(),
            authorization: "Bearer",
            "x-device-language": "en",
            "x-device-platform": "web",
            "x-device-uuid": uuid,
            "x-device-version": "1.0.44"
        }
        try {
            m.reply({ react: { text: "🕣", key: m.key }})
            const upload = await axios.post("https://widget-api.overchat.ai/v1/chat/upload", form, { headers })
            const { link, croppedImageLink, chatId } = upload.data
            const prompt = args.join(" ") || "Ghibli Studio style, charming hand-drawn anime-style illustration."
            const payload = {
                chatId,
                prompt,
                model: "gpt-image-1",
                personaId: "image-to-image",
                metadata: {
                    files: [{ path: filename, link, croppedImageLink }]
                }
            }
            const jsonHeaders = {
                ...headers,
                "content-type": "application/json"
            }
            const gen = await axios.post("https://widget-api.overchat.ai/v1/images/generations", payload, { headers: jsonHeaders })
            const url = gen?.data?.data?.[0]?.url
            if (!url) return m.reply("[×] Gagal generate gambar.")
            await m.reply({
                image: { url },
                caption: "[√] Ghibli Style Generated! ✨"
            })
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})