export default {
    name: "menfes",
    exec: async({ sius, m }) => {
        const menfes = db.game.menfes
        if (!menfes[m.sender]) return;
        if (!m.msg) return;
        if (m.key.remoteJid === "status@broadcast" || m.isGroup) return;
        const allowCmd = /^(del(menfe(s|ss)|confe(s|ss))|<|>|$)$/i
        if (allowCmd.test(m.command)) return;
        m.msg.contextInfo = {
            isForwarded: true,
            forwardingScore: 1,
            quotedMessage: {
                conversation: `*Pesan Dari ${menfes[m.sender].nama || "Seseorang"}*`
            },
            key: {
                remoteJid: "0@s.whatsapp.net",
                fromMe: false,
                participant: "0@s.whatsapp.net"
            }
        }
        const pesan = m.type === "conversation" ? {
                extendedTextMessage: {
                    text: m.msg,
                    contextInfo: m.msg.contextInfo
                }
            }
            : { [m.type]: m.msg }
        await sius.relayMessage(menfes[m.sender].tujuan, pesan, {})
    }
}