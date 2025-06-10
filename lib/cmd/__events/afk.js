export default {
    name: "afk-handler",
    exec: async({ sius, m, Func }) => {
        const mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
        for (let jid of mentionUser) {
            let user = db.users[jid]
            if (!user) continue;
            const afkTime = user.afkTime
            if (!afkTime || afkTime < 0) continue;
            const reason = user.afkReason || ""
            await m.reply(`Jangan tag dia!\nDia sedang AFK ${reason ? "dengan alasan " + reason : "tanpa alasan"}\nSelama ${Func.clockString(new Date - afkTime)}`.trim())
        }
        let user = db.users[m.sender]
        if (user.afkTime > -1) {
            await m.reply(`@${m.sender.split("@")[0]} berhenti AFK${user.afkReason ? " setelah " + user.afkReason : ""}\nSelama ${Func.clockString(new Date - user.afkTime)}`)
            user.afkTime = -1
            user.afkReason = ""
        }
    }
}