commands.add({
    name: ["pesansementara"],
    command: ["pesansementara"],
    param: "<on/off>",
    category: "group",
    desc: "Mengaktifkan mode pesan sementara group",
    admin: true,
    botAdmin: true,
    group: true,
    run: async({ sius, m, args }) => {
        if (/90|7|1|24|on/i.test(args[0])) {
			sius.sendMessage(m.chat, { disappearingMessagesInChat: /90/i.test(args[0]) ? 7776000 : /7/i.test(args[0]) ? 604800 : 86400 })
			m.reply("Berhasil!")
		} else if (/0|off|false/i.test(args[0])) {
			sius.sendMessage(m.chat, { disappearingMessagesInChat: 0 })
			m.reply("Berhasil!")
		} else m.reply("Silahkan Pilih :\n\n*90 hari, 7 hari, 1 hari, off*")
	}
})