commands.add({
    name: ["+block","block"],
    command: ["+block","block"],
    alias: ["addblock","blokir","blockir"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let text = args.join(" ")
        let target = m.mentionedJid?.[0] || m.quoted?.sender || text?.replace(/\D/g, "") + "@s.whatsapp.net"
		if (target) {
			await sius.updateBlockStatus(target, "block").then((a) => m.reply(config.mess.success)).catch((err) => m.reply("[×] Gagal"))
		} else m.reply("[×] Reply/Tag/Sertakan target yang ingin di ban")
	}
})

commands.add({
    name: ["listblock"],
    command: ["listblock"],
    alias: ["blocklist","listblockir","listblokir"],
    category: "info",
    run: async({ sius, m, args }) => {
		let anu = await sius.fetchBlocklist()
		m.reply(`Total Block : ${anu.length}\n` + anu.map(v => "• " + v.replace(/@.+/, "")).join`\n`)
	}
})

commands.add({
    name: ["-block","unblock"],
    command: ["-block","unblock"],
    alias: ["unblockir","unblokir"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let text = args.join(" ")
        let target = m.mentionedJid?.[0] || m.quoted?.sender || text?.replace(/\D/g, "") + "@s.whatsapp.net"
		if (target) {
			await sius.updateBlockStatus(target, "unblock").then((a) => m.reply(config.mess.success)).catch((err) => m.reply("[×] Gagal!"))
		} else m.reply("[×] Reply/Tag/Sertakan target yang ingin di unblock")
	}
})