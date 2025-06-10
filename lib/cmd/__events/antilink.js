export default {
    name: "anti-link",
    exec: async ({ sius, m }) => {
        const isOwner = config.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        const budy = typeof m.text === "string" ? m.text.toLowerCase() : ""
        if (m.key.fromMe || !m.isGroup || m.isAdmin || !m.isBotAdmin || isOwner) return;
        const setgroups = db.groups[m.chat] || {}
        if (budy.match("chat.whatsapp.com/") && setgroups.antilink) {
            await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
    		await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Mengirim Link Group\nMaaf Link Harus Di Hapus..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Link❗*"}, ...m.key }}}, {})
        }
    }
}