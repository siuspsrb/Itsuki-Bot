import fs from "fs"
import Jimp from "jimp"

const generateProfile = async (buffer) => {
    const jimp = await Jimp.read(buffer)
    const min = jimp.getWidth()
    const max = jimp.getHeight()
    const cropped = jimp.crop(0, 0, min, max)
    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
        preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)
    }
}

commands.add({
    name: ["setppbot"],
    command: ["setppbot"],
    category: "owner",
    desc: "update profile picture bot",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        if (!m.quoted) return m.reply("• Reply gambar yang mau dipasang sebagai pp bot!")
        const quoted = m.quoted
        const mime = (quoted.msg || quoted).mimetype || ""
        if (!/image/.test(mime)) return m.reply("[×] Pesan yang direply bukan gambar!")
        const media = await sius.downloadAndSaveMediaMessage(quoted, "ppbot.jpeg")
        const { img } = await generateProfile(media)
        try {
            await sius.updateProfilePicture(sius.user.id, img)
            fs.unlinkSync(media)
            m.reply("[√] Foto profil bot berhasil diganti!")
        } catch (err) {
            sius.cantLoad(e)
        }
    }
})