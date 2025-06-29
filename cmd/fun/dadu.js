import fs from "fs";
import path from "path";
import { imageToWebp, videoToWebp, writeExif } from "../../lib/exif.js"

commands.add({
    name: ["dadu"],
    command: ["dadu"],
    category: "fun",
    desc: "Rolling dadu..",
    run: async({ sius, m, args, Func }) => {
        try {
		    let ddsa = ['https://telegra.ph/file/9f60e4cdbeb79fc6aff7a.png','https://telegra.ph/file/797f86e444755282374ef.png','https://telegra.ph/file/970d2a7656ada7c579b69.png','https://telegra.ph/file/0470d295e00ebe789fb4d.png','https://telegra.ph/file/a9d7332e7ba1d1d26a2be.png','https://telegra.ph/file/99dcd999991a79f9ba0c0.png']
			let media = await Func.pickRandom(ddsa)
			let dadu = await Func.getBuffer(media.url)
			let stik = await imageToWebp(dadu)
			let { packname, author } = config
            let emoji = ["🎲"]
            let data = {
                packname,
                author,
                emoji,
                categories: emoji,
                isAvatar: 0
            }			
			let stick = await writeExif(stik, data)
			await m.reply({ sticker: stick })
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})