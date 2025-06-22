commands.add({
    name: ["mode"],
    command: ["mode"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let jud = await sius.decodeJid(sius.user.id)
        let set = db.set[jud]
		let mode = args[0]
		if (mode && mode == "public") {
		    sius.public = set.public = true
			set.grouponly = false
			set.privateonly = false
			m.reply('*[√] Berhasil diubah ke mode public*')
		} else if (mode && mode == "self") {
			set.grouponly = false
			set.privateonly = false
			sius.public = set.public = false
			m.reply("*[√] Berhasil diubah ke mode self")
		} else if (mode && mode == "group") {
			set.grouponly = true
			set.privateonly = false
			m.reply('*[√] Berhasil diubah ke mode group*')
		} else if (mode && mode == "private") {
			set.grouponly = false
			set.privateonly = true
			m.reply('*[√] Sukses change to private only*')
		} else {
		    m.reply("• Silahkan pilih mode bot dibawah ini!\n▢ self\n▢ group\n▢ private\n▢ public")
		}
    }
})

commands.add({
    name: ["self"],
    command: ["self"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let jud = await sius.decodeJid(sius.user.id)
        let set = db.set[jud]
		set.grouponly = false
		set.privateonly = false
		sius.public = false
		set.public = false
		m.reply("*[√] Berhasil diubah ke mode self*")
	}
})

commands.add({
    name: ["public"],
    command: ["public"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let jud = await sius.decodeJid(sius.user.id)
        let set = db.set[jud]
		sius.public = true
		set.public = true
		set.grouponly = false
		set.privateonly = false
		m.reply('*[√] Berhasil diubah ke mode public*')
	}
})

commands.add({
    name: ["grouponly"],
    command: ["grouponly"],
    alias: ["gconly"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let jud = await sius.decodeJid(sius.user.id)
        let set = db.set[jud]    
    	set.grouponly = true
		set.privateonly = false
		m.reply('*[√] Berhasil diubah ke mode group*')
	}
})

commands.add({
    name: ["privateonly"],
    command: ["privateonly"],
    alias: ["pconly"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let jud = await sius.decodeJid(sius.user.id)
        let set = db.set[jud]    
		set.grouponly = false
		set.privateonly = true
		m.reply('*[√] SukseS Change To Private Only*') 
	}
})

commands.add({
    name: ["shutdown"],
    command: ["shutdown"],
    category: "owner",
    owner: true,
    run: async({ m }) => {
        m.reply(`*Process Shutdown...*`).then(() => {
			process.exit(0)
		})
	}
})
