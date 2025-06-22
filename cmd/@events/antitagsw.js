export default {
    name: "anti-tagsw",
    exec: async ({ sius, m }) => {
        const isOwner = config.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        if (m.key.fromMe || !m.isGroup || m.isAdmin || !m.isBotAdmin || isOwner) return false;
        let setgroups = db.groups[m.chat] || {}
        if (m.type === "groupStatusMentionMessage" || m.message?.groupStatusMentionMessage || m.message?.protocolMessage?.type === 25 || Object.keys(m.message).length === 1 && Object.keys(m.message)[0] === "messageContextInfo" && setgroups.antitagsw) {
            if (!setgroups.tagsw[m.sender]) {
				setgroups.tagsw[m.sender] = 1
				await m.reply(`Grup ini terdeteksi ditandai dalam Status WhatsApp\n@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp\nPeringatan ${setgroups.tagsw[m.sender]}/5, akan dikick jika mencapai batas❗`)
				await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
				return true;
			} else if (setgroups.tagsw[m.sender] >= 5) {
				await sius.groupParticipantsUpdate(m.chat, [m.sender], "remove").catch((err) => m.reply("Gagal!"))
				await m.reply(`@${m.sender.split("@")[0]} telah dikeluarkan dari grup\nKarena menandai grup dalam status WhatsApp sebanyak 5x`)
				await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
				delete setgroups.tagsw[m.sender]
				return true;
			} else {
				setgroups.tagsw[m.sender] += 1
				await m.reply(`Grup ini terdeteksi ditandai dalam Status WhatsApp\n@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp\nPeringatan ${setgroups.tagsw[m.sender]}/5, akan dikick ketika peringatan mencapai batas❗`)
				await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
				return true;
			}
        }
        return false;
    }
}