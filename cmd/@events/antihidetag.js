export default {
    name: "anti-hidetag",
    exec: async ({ sius, m }) => {
        const isOwner = config.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        if (m.key.fromMe || !m.isGroup || m.isAdmin || !m.isBotAdmin || isOwner) return false;
        const setting = db.groups[m.chat] || {}
        const antihidetagAktif = setting.antihidetag
        const semuaDisebut = m.mentionedJid?.length && m.metadata?.participants && m.mentionedJid.length === m.metadata.participants.length
        if (antihidetagAktif && semuaDisebut) {
            await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
            await m.reply("*Anti Hidetag Aktif!* 🚫")
            return true;
        }
        return false;
    }
}