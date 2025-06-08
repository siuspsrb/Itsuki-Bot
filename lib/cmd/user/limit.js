commands.add({
    name: ["buylimit"],
    command: ["buylimit"],
    category: "user",
    alias: ["blimit", "belilimit"],
    desc: "membeli limit dengan uang",
    run: async({ sius, m, args, Func }) => {
        if (!args[0]) return m.reply("[×] Sertakan jumlah limit yang ingin dibeli")
        let user = db.users[m.sender]
	    let count = parseInt(args[0])
	    if (user && user.money >= count * 1) {
		    user.limit += count * 1
		    user.money -= count * 500
		    m.reply(`[√] Berhasil membeli limit sebanyak ${args[0] * 1} dengan harga ${Func.formatUang(args[0] * 500)}`)
	    } else m.reply(`[×] Uang kamu tidak cukup untuk membeli limit!\n\n> Dimiliki : ${Func.formatUang(user.money)} | Harga ${Func.formatUang(args[0] * 500)}`)
    }
})

commands.add({
    name: ["limit"],
    command: ["limit"],
    category: "info",
    alias: ["ceklimit", "sisalimit"],
    desc: "melihat sisa limit user",
    run: async({ sius, m }) => {
        let limit = db.users[m.sender].limit || 0
        m.reply(`*Limit kamu tersisa:* ${limit}`)
    }
})