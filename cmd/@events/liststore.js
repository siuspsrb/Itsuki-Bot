export default {
    name: "list_store",
    exec: async({ sius, m }) => {
        let chat = db.groups[m.chat]
        if (!m.isGroup || m.chat.endsWith("broadcast") || chat.mute || m.isBot) return false
        let list = chat.list
        let key = m.text.toLowerCase()
        if (!(key in list)) return false
        // proses balikin buffer media
        let raw = JSON.parse(JSON.stringify(list[key]), (_, v) => {
            if (v && typeof v === "object" && "type" in v && Array.isArray(v.data)) {
                return Buffer.from(v.data);
            }
            return v;
        });
        // serializeM versi lokal wwkkw
        const msg = {
            key: raw.key,
            message: raw.message,
            pushName: raw.pushName || "",
            broadcast: raw.broadcast || false,
            messageTimestamp: raw.messageTimestamp || undefined,
            participant: raw.participant || undefined,
            type: Object.keys(raw.message)[0],
            sender: raw.key.participant || raw.key.remoteJid,
            fromMe: raw.key.fromMe || false,
            chat: raw.key.remoteJid,
            isGroup: raw.key.remoteJid.endsWith("@g.us"),
            isBot: false,
            reply: async (text, options = {}) => {
                return sius.sendMessage(raw.key.remoteJid, { text, ...options }, { quoted: msg })
            }
        }
        await sius.sendMessage(m.chat, { forward: msg }, { quoted: m });
        return true
    }
}