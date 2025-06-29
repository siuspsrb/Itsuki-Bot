import {
    imageToWebp, 
    writeExif 
} from "../../lib/exif.js"
import axios from "axios"

commands.add({
    name: ["qc"],
    command: ["qc"],
    usage: "<text>",
    category: "maker",
    limit: 5,
    cooldown: 30,
    query: true,
    run: async({ sius, m, args }) => {
        let q = args.join(" ")
        if (!q) return m.reply(`[×] Contoh penggunaan: ${m.prefix + m.command} hallo`)
        let obj = {
            type: 'quote',
            format: 'png',
            backgroundColor: '#ffffff',
            width: 512,
            height: 768,
            scale: 2,
            messages: [{
                entities: [],
                avatar: true,
                from: {
                    id: 1,
                    name: m.pushName,
                    photo: { 
                        url: await sius.profilePictureUrl(m.sender, "image").catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'),
                    }
                },
                text: `${q}`,
                replyMessage: {},
            }],
        }
        let response = await axios.post('https://bot.lyo.su/quote/generate', obj, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let buffer = Buffer.from(response.data.result.image, 'base64')
        let stik = await imageToWebp(buffer)
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