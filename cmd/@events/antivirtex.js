export default {
    name: "anti-virtex",
    exec: async ({ sius, m }) => {
        const isOwner = config.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        if (!m.text || m.key.fromMe || !m.isGroup || m.isAdmin || !m.isBotAdmin || isOwner) return false;
        const budy = typeof m.text === "string" ? m.text.toLowerCase() : ""       
        const setgroups = db.groups[m.chat] || {}
        if (setgroups.antivirtex) {
            if (budy.length > 10000) {
                await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
    			await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Mengirim Virtex..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Virtex❗*"}, ...m.key }}}, {})
    			await sius.groupParticipantsUpdate(m.chat, [m.sender], "remove")
    			return true;
            }
            if (m.msg.nativeFlowMessage && m.msg.nativeFlowMessage.messageParamsJson && m.msg.nativeFlowMessage.messageParamsJson.length > 3500) {
                await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
				await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Mengirim Bug..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Bug❗*"}, ...m.key }}}, {})
				await sius.groupParticipantsUpdate(m.chat, [m.sender], "remove")
				return true;
            }
        }
        return false;
    }
}