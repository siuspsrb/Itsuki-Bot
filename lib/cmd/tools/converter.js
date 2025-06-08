import fs from "fs"
import baileys from "@adiwajshing/baileys"
import FormData from "form-data"
import fetch from "node-fetch"
import axios from "axios"
import BodyForm from "form-data"
import { toAudio, toPTT, toVideo } from "../../source/exif.js"
import { exec } from "child_process"
const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};
const { proto, generateWAMessageContent, generateWAMessageFromContent, prepareWAMessageMedia } = baileys

commands.add({
    name: ["toptv"],
    command: ["toptv"],
    category: "converter",
    desc: "Mengubah video menjadi pesan PTV",
    alias: ["toptvm"],
    run: async ({ sius, m }) => {
        try {
            const quoted = m.quoted ? m.quoted : m
            const mime = quoted.msg?.mimetype || ""
            if (!quoted) return m.reply("◇ Reply video dengan *.toptv*")
            if (!/video/.test(mime)) return m.reply("◇ Hanya video yang didukung!")
            if ((m.quoted ? m.quoted.type : m.type) !== "videoMessage") return m.reply("◇ Reply video yang ingin diubah ke PTV!")
            const anu = await quoted.download()
            const message = await generateWAMessageContent({ video: anu }, { upload: sius.waUploadToServer })
            await sius.relayMessage(m.chat, { ptvMessage: message.videoMessage }, {})
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["tourl"],
    command: ["tourl"],
    category: "converter",
    desc: "Mengunggah media ke URL",
    alias: ["url"],
    run: async ({ sius, m, Func }) => {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        if (!mime) return m.reply(`Kirim/reply video/gambar`);
		try {
			let media = await sius.downloadAndSaveMediaMessage(quoted);
			if (/image|video/.test(mime)) {
				let response = await CatBox(media);
				let fileSize = (fs.statSync(media).size / 1024).toFixed(2);
				let uploadDate = new Date().toLocaleString();
				let uploader = `${m.pushName}`;
				let caption = `> Media size : ${fileSize} ᴋʙ\n> Uploader : ${uploader}`.trim();
				let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: {
                text: "Berhasil mengubah menjadi tautan link, silahkan salin linknya di tombol bawah ini!"
                            },
                        carouselMessage: {
                            cards: [{
                                header: proto.Message.InteractiveMessage.Header.create({
                                    ...(await prepareWAMessageMedia({ image: { url: response }}, { upload: sius.waUploadToServer })),
                                    title: '',
                                    gifPlayback: true,
                                    subtitle: config.bot.name,
                                    hasMediaAttachment: false
                                }),
                                body: { text: caption },
                                nativeFlowMessage: {
                                    buttons: [{
                                        "name": "cta_copy",
                                        "buttonParamsJson": `{\"display_text\":\"Click to get link\",\"id\":\"123456789\",\"copy_code\":\"${response}\"}`
                                    }],
                                },
                            }],
				        messageVersion: 1,		
			            },
			            },
                    },
                    },
                },
                { quoted: m }
                );
                await sius.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id,
                });
			} else if (!/image/.test(mime)) {
				let response = await CatBox(media);
				m.reply(response);
			} else {
				m.reply(`Jenis media tidak didukung!`);
			}
			await fs.unlinkSync(media);
		} catch (err) {
			sius.cantLoad(err)
	    }
	}
})

commands.add({
    name: ["hd","remini"],
    command: ["hd","remini"],
    category: "tools",
    desc: "Meningkatkan resolusi image",
    limited: true,
    run: async ({ sius, m, Func }) => {
        let q = m.quoted || m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!mime) return m.reply(`[×] Reply atau kirim gambar yang ingin diubah dengan caption ${m.prefix + m.command}`)
        let wait = await m.reply({ react: { text: "🕣", key: m.key }})
        let startTime = Date.now()
        let media = await sius.downloadAndSaveMediaMessage(q)
        try {
            const imageUrl = await CatBox(media)
            const api = `https://fastrestapis.fasturl.cloud/aiimage/upscale?imageUrl=${encodeURIComponent(imageUrl)}&resize=4`
            const res = await fetch(api)
            const buffer = await res.buffer()
            let endTime = Date.now()
            let durasi = ((endTime - startTime) / 1000).toFixed(2)
            await m.reply({ image: buffer, caption: "[√] Berhasil memproses dalam waktu " + durasi + " detik!"})
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})

async function CatBox(filePath) {
	try {
		const fileStream = fs.createReadStream(filePath);
		const formData = new BodyForm();
		formData.append('fileToUpload', fileStream);
		formData.append('reqtype', 'fileupload');
		formData.append('userhash', '');
		const response = await axios.post('https://catbox.moe/user/api.php', formData, {
			headers: {
				...formData.getHeaders(),
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error at Catbox uploader:", error);
		return "Terjadi kesalahan saat upload ke Catbox.";
	}
};