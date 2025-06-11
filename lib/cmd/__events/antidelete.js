export default {
    name: "anti-delete",
    exec: async ({ 
        sius, 
        m, 
        Func, 
        msg, 
        store 
    }) => {
        const isOwner = config.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        if (m.key.fromMe || !m.isGroup || m.isAdmin || !m.isBotAdmin || isOwner) return false;
        const setgroups = db.groups[m.chat] || {}
        if (m.type == "protocolMessage" && setgroups.antidelete) {
    		const mess = msg.message.protocolMessage
    		if (store.messages && store.messages[m.chat] && store.messages[m.chat].array) {
        		const chats = store.messages[m.chat].array.find(a => a.id === mess.key.id)
        		if (!chats.msg) return false;
        		chats.msg.contextInfo = { mentionedJid: [chats.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Delete❗*"}, ...chats.key }
        		const pesan = chats.type === "conversation" ? { extendedTextMessage: { text: chats.msg, contextInfo: { mentionedJid: [chats.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Delete❗*"}, ...chats.key }}} : { [chats.type]: chats.msg }
        		await sius.relayMessage(m.chat, pesan, {})
        		return true;
    		}
        }
        return false;
    }
}