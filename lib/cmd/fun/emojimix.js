import fs from "fs";
import path from "path";
import { imageToWebp, videoToWebp, writeExif } from "../../source/exif.js"

commands.add({
    name: ["emojimix"],
    command: ["emojimix"],    
    param: "<emoji|emoji>",
    category: "fun",
    desc: "Generator sticker emoji mix",
    run: async({ sius, m, args, Func }) => {
        const txt = args.join(" ")
        const [sat, satt] = txt.split("|")
        if (!sat || !satt) return m.reply("Contoh penggunaan: .emojimix 🤕|😆")
        let file = await Func.getBuffer(`https://flowfalcon.dpdns.org/tools/emojimix?emoji1=${encodeURIComponent(sat)}&emoji2=${encodeURIComponent(satt)}`)
        let stik = await imageToWebp(file)
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
            m.reply("Size sticker terlalu besar !")
        }
        await m.reply({ sticker: stick })
            .catch((e) => sius.cantLoad())
    }
})