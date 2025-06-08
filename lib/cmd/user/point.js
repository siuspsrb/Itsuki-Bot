commands.add({
    name: ["point"],
    command: ["point"],
    alias: ["poin"],
    category: "user",
    desc: "Melihat jumlah point kamu atau user yang kamu tag",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
        let user = db.users[userId]
        if (!user) return m.reply("[×] User tidak terdapat di database bot")
        let siapa = userId === m.sender ? "kamu miliki" : "dia miliki"
        let text = `> 🥏 Point yang ${siapa}: *${user.point || 0}*`
        m.reply(text)
    }
})