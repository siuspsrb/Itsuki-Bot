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