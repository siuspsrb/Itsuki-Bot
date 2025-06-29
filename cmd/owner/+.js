commands.add({
    name: ["+money", "addmoney"],
    param: "<amount>",
    command: ["+money", "addmoney"],
    category: "owner",
    owner: true,
    desc: "memberi money tambahan kepada pengguna (dari reply)",
    run: async ({ sius, m, args, Func }) => {
        try {
            if (!m.quoted || !m.quoted.sender) return m.reply("[×] Reply pesan user yg mau dikasih money!")
            const amountRaw = args.join(" ")
            if (!amountRaw) return m.reply("[×] Sertakan jumlah uangnya!\n\ncontoh: .+money 10000 atau .+money Rp 1.000.000")
            const cleanAmount = parseInt(amountRaw.replace(/[^0-9]/g, ""))
            if (isNaN(cleanAmount) || cleanAmount < 1) return m.reply("[×] Jumlah uang tidak valid!")
            const target = m.quoted.sender
            if (!db.users[target]) return m.reply("[×] User tidak terdaftar di database!")
            db.users[target].money += cleanAmount
            m.reply(`[√] Berhasil memberi ${Func.formatUang(cleanAmount)} kepada @${target.split("@")[0]}`)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["+limit","addlimit"],
    param: "<amount>",
    command: ["+limit","addlimit"],
    category: "owner",
    owner: true,
    desc: "Memberi limit tambahan kepada pengguna",
    run: async ({ sius, m, args, Func }) => {
        try {
            if (!m.quoted || !m.quoted.sender) return m.reply("[×] Reply pesan user yg mau dikasih limit!")
            const amountRaw = args.join(" ")
            if (!amountRaw) return m.reply("[×] Sertakan jumlah uangnya!\n\ncontoh: .+limit 10000")
            const cleanAmount = parseInt(amountRaw.replace(/[^0-9]/g, ""))
            if (isNaN(cleanAmount) || cleanAmount < 1) return m.reply("[×] Jumlah limit tidak valid!")
            const target = m.quoted.sender
            if (!db.users[target]) return m.reply("[×] User tidak terdaftar di database!")
            db.users[target].limit += cleanAmount
            m.reply(`[√] Berhasil memberi ${cleanAmount} limit kepada @${target.split("@")[0]}`)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})