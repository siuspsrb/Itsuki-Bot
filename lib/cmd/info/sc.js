commands.add({
    name: ["sourcecode"],
    command: ["sourcecode"],
    alias: ["scbot","sc"],
    category: "info",
    desc: "Source code bot",
    run: async({ sius, m, args, Func }) => {
        sius.relayMessage(m.chat, {
                requestPaymentMessage: {
                    currencyCodeIso4217: "IDR",
                    amount: {
                        value: 20000000, 
                        offset: 100, 
                        currencyCode: "IDR"
                    },
                    amount1000: 20000000, 
                    expiryTimestamp: Math.floor(Date.now() / 1000) + 3600,
                    requestFrom: config.creator,
                    noteMessage: {
                        extendedTextMessage: {
                            text: `Ini adalah *Itsuki Bot 4.0*\n\nhttps://github.com/siuspsrb/Itsuki-Bot`
                        }
                    }
                }
        }, {})
    }
        
})

commands.add({
    name: ["owner","pemilik","creator"],
    command: ["owner","pemilik","creator"],
    alias: ["o"],
    desc: "Akun pemilik bot",
    category: "info",
    run: async ({ sius, m }) => {
        return sius.sendContact(m.chat, config.owner, m);
    }
});

commands.add({
    name: ["hitcmd"],
    command: ["hitcmd"],
    category: "info",
    alias: ["hitcommands","hitcommand","cmdhit"],
    desc: "menampilkan statistik penggunaan fitur bot",
    run: async ({ sius, m }) => {
        try {
            const hits = Object.entries(db.hit)
            if (!hits.length) {
                return m.reply("Belum ada data penggunaan fitur!")
            }
            hits.sort((a, b) => b[1] - a[1])
            let output = "*TOP 5*\n"
            hits.slice(0, 5).forEach(([fitur, jumlah], i) => {
                output += `${i + 1}. ${fitur}: ${jumlah} kali\n`
            })
            output += "\n*ALL COMMANDS*\n"
            hits.forEach(([fitur, jumlah], i) => {
                output += `${i + 1}. ${fitur}: ${jumlah} kali\n`
            })
            output += "\n> Statistik penggunaan fitur bot !"
            await sius.reply(m.chat, output, "D A S H B O A R D", false)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})