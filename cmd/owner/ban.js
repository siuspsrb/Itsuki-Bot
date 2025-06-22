commands.add({
    name: ["ban","+ban"],
    param: "<number>",
    command: ["ban","+ban"],
    category: "owner",
    owner: true,
    desc: "Melakukan banning terhadap nomor tertentu",
    run: async ({ sius, m, args, Func }) => {
        try {
            let target = m.mentionedJid?.[0] || m.quoted?.sender || args[0] ? args[0] + "@s.whatsapp.net" : m.sender
            let number = Func.formatNumber(target)
            if (!number) return m.reply('[×] Sertakan nomor target')
            if (global.db.users[number]) {
                global.db.users[number].ban = true
                await m.reply('[√] User telah dibanned')
            } else {
                await m.reply('[×] User tidak terdaftar')
            }
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["-ban","unban"],
    param: "<number>",
    command: ["-ban","unban"],
    category: "owner",
    owner: true,
    desc: "Menghilangkan banning kepada nomor tertentu",
    run: async ({ sius, m, args, Func }) => {
        try {
            m.mentionedJid?.[0] || m.quoted?.sender || args[0] ? args[0] + "@s.whatsapp.net" : m.sender
            let number = Func.formatNumber(target)
            if (!number) return m.reply('[×] Sertakan nomor target');            
            if (global.db.users[number]) {
                global.db.users[number].ban = false;
                await m.reply('[√] User telah di-unbanned');
            } else {
                await m.reply('[×] User tidak terdaftar')
            }
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});