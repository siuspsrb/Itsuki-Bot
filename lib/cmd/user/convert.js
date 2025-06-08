commands.add({
    name: ["convert"],
    command: ["convert"],
    category: "user",
    desc: "konversi point / limit dengan money",
    use: "<point|limit> <jumlah>",
    alias: ["nukar", "tukar"],
    run: async ({ sius, m, args, users, Func }) => {
        if (!args[0] || !args[1]) return m.reply("CONVERT SYSTEM\n\n▢ Format: .convert <point|limit> <jumlah>\n▢ Contoh: .convert point 10")
        let type = args[0].toLowerCase()
        let count = parseInt(args[1])
        if (!["point", "limit"].includes(type)) return m.reply("[×] Tipe convert tidak valid!")
        if (isNaN(count) || count < 1) return m.reply("[×] Jumlah convert tidak valid!")
        let user = db.users[m.sender]
        if (!user) return m.reply("[×] Kamu belum terdaftar di database bot")
        let price = Func.getDynamicPrice(250, user.level) * count
        if (user.money < price) return m.reply(`[×] Money kamu kurang!\n▢ butuh: ${Func.formatUang(price)}\n▢ saldo: ${Func.formatUang(user.money)}`)
        user.money -= price
        if (type === "point") user.point += count
        if (type === "limit") user.limit += count
        db.users[m.sender] = user
        m.reply(`CONVERT BERHASIL\n\n[√] Berhasil menukar ${Func.formatUang(price)} money\n▢ Hasil: ${count} ${type}\n▢ Saldo sisa: ${Func.formatUang(user.money)}`)
    }
})
