import fs from "fs";
import path from "path";
import { imageToWebp, videoToWebp, writeExif } from "../../lib/exif.js"

commands.add({
    name: ["sticker"],
    command: ["sticker"],
    category: "maker",
    desc: "Mengubah gambar atau video menjadi stiker",
    alias: ["swm","s","stiker", "stickerwm","stikerwm"],
    run: async ({ sius, m, args, Func }) => {
        try {
            const quoted = m.quoted ? m.quoted : m;
            const mime = (quoted.msg || quoted).mimetype || "";
            const qmsg = quoted.msg || quoted;
            if (!/image|video|webp/.test(mime)) {
                return m.reply(`[×] Reply gambar, video, atau sticker dengan caption *.sticker*`)
            }
            if (qmsg.bytes > 10 * 1024 * 1024) {
                return m.reply(`[×] Ukuran media terlalu besar (maksimal 10MB)`)
            }
            let media = await sius.downloadAndSaveMediaMessage(qmsg);
            let packname = args[0] || config.sticker.packname || "ItsukiBot"
            let author = args[1] || config.sticker.author || "Hyzer"
            let emojis = args[2] ? args[2].split(",") : ["😎"];
            let webpBuffer
            if (/image|webp/.test(mime)) {
                webpBuffer = await imageToWebp(fs.readFileSync(media))
            } else if (/video/.test(mime)) {
                webpBuffer = await videoToWebp(fs.readFileSync(media))
            }
            const exifData = {
                packname,
                author,
                emojis,
                categories: emojis,
                isAvatar: 0
            }
            const finalSticker = await writeExif(webpBuffer, exifData);
            if (finalSticker.length > 512 * 1024) {
                fs.unlinkSync(media);
                return m.reply(`[×] Sticker terlalu besar (maksimal 512KB)`);
            }
            await m.reply({ sticker: finalSticker })
            fs.unlinkSync(media)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})