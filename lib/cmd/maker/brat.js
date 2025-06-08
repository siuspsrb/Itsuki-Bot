import { createCanvas } from "@napi-rs/canvas"
import {
    imageToWebp, 
    writeExif 
} from "../../source/exif.js"

commands.add({
    name: ["brat"],
    command: ["brat"],
    alias: ["stickerbrat"],    
    param: "<text>",
    category: "maker",
    desc: "Generator sticker brat",
    run: async({ sius, m, args, Func }) => {
        const txt = args.join(" ")
        if (!txt) return m.reply("[×] Contoh penggunaan: .brat Halo")
        let file = await Func.getBuffer("https://aqul-brat.hf.space?text=" + txt)
        if (!file) return m.reply("[×] Gagal memuat stiker")
        let stik = await imageToWebp(file).catch((e) => sius.cantLoad(e))
        let { packname, author } = config
        let emoji = ["🤭"] // 😂 hyzer negro 🚲 
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
            .catch((e) => sius.cantLoad(e))
    }
})

commands.add({
    name: ["brat2"],
    command: ["brat2"],
    category: "maker",
    param: "<teks>",
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