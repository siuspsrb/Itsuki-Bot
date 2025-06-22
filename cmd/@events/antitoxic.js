export default {
    name: "anti-toxic",
    exec: async ({ sius, m }) => {
        const isOwner = config.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        if (!m.text || m.key.fromMe || !m.isGroup || m.isAdmin || !m.isBotAdmin || isOwner) return false;
        const budy = typeof m.text === "string" ? m.text.toLowerCase() : ""
        const setgroups = db.groups[m.chat] || {}
        if (budy.toLowerCase().split(/\s+/).some(word => config.badWords.includes(word)) && setgroups.antitoxic) {
            await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
            await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Berkata Toxic\nMohon gunakan bahasa yang sopan.`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Toxic❗*"}, ...m.key }}}, {})
            return true;
        }
        return false;
    }
}