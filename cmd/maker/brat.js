import { createCanvas } from "@napi-rs/canvas"
import {
    imageToWebp,
    videoToWebp,
    writeExif 
} from "../../lib/exif.js"

commands.add({
    name: ["brat","bratvideo"],
    command: ["brat","bratvideo"],
    alias: ["stickerbrat","bratvid"],    
    usage: "<text>",
    category: "maker",
    limit: 5,
    cooldown: 30,
    query: true,
    desc: "Generator sticker brat",
    run: async({ sius, m, args, Func }) => {
        const txt = args.join(" ")
        if (!txt) return m.reply(`[×] Contoh penggunaan: ${m.prefix + m.command} halo ganteng, kiw`)
        const isVid = m.command == "bratvid" || m.command == "bratvideo"
        let file = await Func.getBuffer(`https://api.hamsoffc.me/tools/${isVid ? "bratvid" : "brat"}?apikey=DabiKey&text=${encodeURIComponent(txt)}`)
        if (!file) return m.reply("[×] Gagal memuat stiker")
        try {
            const stik = isVid ? await videoToWebp(file) : await imageToWebp(file)
            let { packname, author } = config
            let emoji = ["🤭"] // 😂 
            let data = {
                packname,
                author,
                emoji,
                categories: emoji,
                isAvatar: 0
            }
            let stick = await writeExif(stik, data)
            if (stick.length > 512 * 1024) {
                m.reply("[×] Size sticker terlalu besar !")
            }
            await m.reply({ sticker: stick })
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["brat2"],
    command: ["brat2"],
    usage: "<text>",
    category: "maker",
    limit: 5,
    cooldown: 30,
    desc: "Membuat sticker trending brat berdasarkan teks",
    run: async ({ sius, m, args }) => {
        try {
            if (!args.length) return m.reply("[×] Sertakan teks untuk dibuat gambar (contoh: .brat i am sius)!")
            let text = args.join(" ").trim()
            if (text.length > 50) return m.reply("Huruf maksimal 50 karakter!")
            let width = 512
            let height = 512
            let canvas = createCanvas(width, height)
            let ctx = canvas.getContext("2d")
            ctx.fillStyle = "#FFFFFF"
            ctx.fillRect(0, 0, width, height)
            ctx.fillStyle = "#000000"
            ctx.font = "bold 80px Arial"
            ctx.textAlign = "left"
            ctx.textBaseline = "middle"
            ctx.fillText(text, 20, height / 2)
            let tmp = createCanvas(width, height)
            let tempCtx = tmp.getContext("2d")
            tempCtx.drawImage(canvas, 0, 0)
            tempCtx.filter = "blur(3px)"
            tempCtx.drawImage(canvas, 0, 0)
            ctx.drawImage(tmp, 0, 0)
            let buffer = canvas.toBuffer("image/png")
            let stickzer = await imageToWebp(buffer)
            let packname = args[0] || "@sius.psrb"
            let author = args[1] || "★"
            let emojis = args[2] ? args[2].split(',') : ['😎']
            let exifData = {
                packname,
                author,
                emojis,
                categories: emojis,
                isAvatar: 0
            }
            let s = await writeExif(stickzer, exifData)
            await m.reply({ sticker: s })
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})