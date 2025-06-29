export default {
    name: "afk",
    exec: async({ sius, m, Func }) => {
        const mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
        if (!db.users) return false;
        if (m.key.fromMe || m.isBot) return false;
        for (let jid of mentionUser) {
            let user = db.users[jid]
            if (!user) continue;
            const afkTime = user.afkTime
            if (m.key.fromMe || !afkTime || afkTime < 0) continue;
            const reason = user.afkReason || ""
            await m.reply(`⚠️ Jangan tag dia!\nDia sedang AFK ${reason ? "dengan alasan " + reason : "tanpa alasan"}\nSelama ${Func.clockString(new Date - afkTime)}`.trim())
            return true;
        }
        let user = db.users[m.sender]
        if (user.afkTime > -1) {
            await m.reply(`@${m.sender.split("@")[0]} berhenti AFK${user.afkReason ? " setelah " + user.afkReason : ""}\nSelama ${Func.clockString(new Date - user.afkTime)}`)
            user.afkTime = -1
            user.afkReason = ""
            return true;
        }
        return false;
    }
}