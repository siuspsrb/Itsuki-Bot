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
    name: ["setppgroup"],
    command: ["setppgroup"],
    alias: ["setppgc","setppgrup"],
    category: "group",
    desc: "Update profile picture group",
    admin: true,
    group: true,
    botAdmin: true,
    run: async ({ sius, m, args, Func }) => {
		if (!m.quoted) return m.reply("Reply Gambar yang mau dipasang sebagai profile group!")
		const quoted = m.quoted ? m.quoted : ""
		const mime = (quoted.msg || quoted).mimetype || ''
		if (!/image/.test(quoted.type)) return m.reply("Reply Gambar yang mau dipasang sebagai profile group!")
		let media = await sius.downloadAndSaveMediaMessage(quoted, "ppg.jpeg")
		if (args.length > 0) {
			let { img } = await generateProfile(media)
			await sius.query({
				tag: 'iq',
				attrs: {
					target: m.chat,
					to: '@s.whatsapp.net',
					type: 'set',
					xmlns: 'w:profile:picture'
				},
				content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
			})
			await fs.unlinkSync(media)
			m.reply('Sukses')
		} else {
			await sius.updateProfilePicture(m.chat, { url: media })
			await fs.unlinkSync(media)
			m.reply('Berhasil')
		}
	}
})