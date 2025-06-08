commands.add({
    name: ["afk"],
    command: ["afk"],
    param: "<reason>",
    category: "fun",
    desc: "menandai akun kamu offline sementara",
    run: async({ sius, m, args }) => {
        let user = db.users[m.sender]
        const res = args.join(" ") || "-"
		user.afkTime = + new Date
		user.afkReason = res
		m.reply(`@${m.sender.split('@')[0]} telah afk${res ? ': ' + res : ''}`)
	}
})