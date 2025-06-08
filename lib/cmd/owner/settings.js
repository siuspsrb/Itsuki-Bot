commands.add({
    name: ["anticall"],
    command: ["anticall"],
    category: "owner",
    owner: true,
    desc: "Mengaktifkan/menonaktifkan anticall ",
    run: async({ sius, m, args }) => {
		const botNumber = await sius.decodeJid(sius.user.id)
		const set = db.set[botNumber]
        if (args[0] == 'on') {
            if (set.anticall) return m.reply("*Sudah Aktif Sebelumnya*")
            set.anticall = true
            m.reply(config.mess.success)
        } else if (args[0] == 'off') {
            set.anticall = false
            m.reply(config.mess.success)
        } else sius.sendButton(m.chat, [
            ["On",".anticall on"],
            ["Off",".anticall off"]
        ], {
            text: "*Silahkan pilih opsi di bawah\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["autobackup"],
    command: ["autobackup"],
    category: "owner",
    owner: true,
    desc: "Mengaktifkan/menonaktifkan autobackup database",
    run: async({ sius, m, args }) => {
		const botNumber = await sius.decodeJid(sius.user.id)
		const set = db.set[botNumber]
        if (args[0] == 'on') {
            if (set.autobackup) return m.reply("*Sudah Aktif Sebelumnya*")
            set.autobackup = true
            m.reply(config.mess.success)
        } else if (args[0] == 'off') {
            set.autobackup = false
            m.reply(config.mess.success)
        } else sius.sendButton(m.chat, [
            ["On",".autobackup on"],
            ["Off",".autobackup off"]
        ], {
            text: "*Silahkan pilih opsi di bawah\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["autobio"],
    command: ["autobio"],
    category: "owner",
    owner: true,
    desc: "Mengaktifkan/menonaktifkan autobio ",
    run: async({ sius, m, args }) => {
		const botNumber = await sius.decodeJid(sius.user.id)
		const set = db.set[botNumber]
        if (args[0] == 'on') {
            if (set.autobio) return m.reply("*Sudah Aktif Sebelumnya*")
            set.autobio = true
            m.reply(config.mess.success)
        } else if (args[0] == 'off') {
            set.autobio = false
            m.reply(config.mess.success)
        } else sius.sendButton(m.chat, [
            ["On",".autobio on"],
            ["Off",".autobio off"]
        ], {
            text: "*Silahkan pilih opsi di bawah\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["setmenu"],
    command: ["setmenu"],
    category: "owner",
    owner: true,
    desc: "Mengubah tampilan menu",
    run: async({ sius, m, args }) => {
        let jud = await sius.decodeJid(sius.user.id)
        let set = db.set[jud]    
        if (args[0] == 'buttonList') {
            set.template = "buttonList"
            m.reply(config.mess.success)
        } else if (args[0] == 'replyAd') {
            set.template = "replyAd"
            m.reply(config.mess.success)
        } else if (args[0] == 'documentButton') {
            set.template = "documentButtonList"
            m.reply(config.mess.success)
        } else if (args[0] == 'documentButtonWithAdReply') {
            set.template = "documentButtonWithAdReply"
            m.reply(config.mess.success)            
        } else if (args[0] == 'simple') {
            set.template = "simple"
            m.reply(config.mess.success) 
        } else sius.sendButton(m.chat, [
            ["Tampilan 1",".setmenu replyAd"],
            ["Tampilan 2",".setmenu buttonList"],
            ["Tampilan 3",".setmenu documentButton"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> 1: ExternalAddReply\n> 2: ButtonList\n> 3: DocumentButtonList\n> 4: documentButtonWithAdReply\n> 5. simple\n\n> Opsi lain: documentButtonWithAdReply\n> Contoh: .setmenu adReply", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["autoread"],
    command: ["autoread"],
    category: "owner",
    owner: true,
    desc: "Mengaktifkan/menonaktifkan autoread ",
    run: async({ sius, m, args }) => {
		const botNumber = await sius.decodeJid(sius.user.id)
		const set = db.set[botNumber]
        if (args[0] == 'on') {
            if (set.autoread) return m.reply("*[×] Sudah Aktif Sebelumnya*")
            set.autoread = true
            m.reply(config.mess.success)
        } else if (args[0] == 'off') {
            set.autoread = false
            m.reply(config.mess.success)
        } else sius.sendButton(m.chat, [
            ["On",".autoread on"],
            ["Off",".autoread off"]
        ], {
            text: "*Silahkan pilih opsi di bawah\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["autotyping"],
    command: ["autotyping"],
    category: "owner",
    owner: true,
    desc: "Mengaktifkan/menonaktifkan autotyping ",
    run: async({ sius, m, args }) => {
		const botNumber = await sius.decodeJid(sius.user.id)
		const set = db.set[botNumber]
        if (args[0] == 'on') {
            if (set.autotyping) return m.reply("*Sudah Aktif Sebelumnya*")
            set.autotyping = true
            m.reply(config.mess.success)
        } else if (args[0] == 'off') {
            set.autotyping = false
            m.reply(config.mess.success)
        } else sius.sendButton(m.chat, [
            ["On",".autotyping on"],
            ["Off",".autotyping off"]
        ], {
            text: "*Silahkan pilih opsi di bawah\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["readsw"],
    command: ["readsw"],
    category: "owner",
    owner: true,
    desc: "Mengaktifkan/menonaktifkan readsw ",
    run: async({ sius, m, args }) => {
		const botNumber = await sius.decodeJid(sius.user.id)
		const set = db.set[botNumber]
        if (args[0] == 'on') {
            if (set.readsw) return m.reply("*Sudah Aktif Sebelumnya*")
            set.readsw = true
            m.reply(config.mess.success)
        } else if (args[0] == 'off') {
            set.readsw = false
            m.reply(config.mess.success)
        } else sius.sendButton(m.chat, [
            ["On",".readsw on"],
            ["Off",".readsw off"]
        ], {
            text: "*Silahkan pilih opsi di bawah\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["antispam"],
    command: ["antispam"],
    category: "owner",
    owner: true,
    desc: "Mengaktifkan/menonaktifkan antispam ",
    run: async({ sius, m, args }) => {
		const botNumber = await sius.decodeJid(sius.user.id)
		const set = db.set[botNumber]
        if (args[0] == 'on') {
            if (set.antispam) return m.reply("*Sudah Aktif Sebelumnya*")
            set.antispam = true
            m.reply(config.mess.success)
        } else if (args[0] == 'off') {
            set.antispam = false
            m.reply(config.mess.success)
        } else sius.sendButton(m.chat, [
            ["On",".antispam on"],
            ["Off",".antispam off"]
        ], {
            text: "*Silahkan pilih opsi di bawah\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["settings"],
    command: ["settings"],
    category: "owner",
    alias: ["set"],
    desc: "ubah atau lihat pengaturan bot",
    owner: true,
    run: async({ sius, m, args, Func }) => {
        const jid = sius.decodeJid(sius.user.id)
        const bot = db.set[jid]
        if (!bot) return m.reply("[×] Data bot tidak ditemukan")
        if (!args[0]) {
            let teks = ""
            for (let [key, val] of Object.entries(bot)) {
                teks += `▢ ${key.charAt(0).toUpperCase() + key.slice(1)}: ${typeof val == "boolean" ? val ? "√" : "×" : val}\n`
            }
            teks += "\n> Ketik .settings <key> <value> untuk mengubah"
            return sius.adChannel(teks, { title: "S E T T I N G S - B O T" })
        }
        const key = args[0].toLowerCase()
        const value = args[1]
        if (!(key in bot)) return m.reply(`[×] Key "${key}" tidak dikenal`)
        const type = typeof bot[key]
        let newValue
        if (type == "boolean") {
            if (value !== "true" && value !== "false")
                return m.reply("[×] Nilai harus 'true' atau 'false'")
            newValue = value === "true"
        } else if (type == "number") {
            if (isNaN(value)) return m.reply("[×] Nilai harus angka")
            newValue = parseInt(value)
        } else {
            newValue = value
        }

        bot[key] = newValue
        return m.reply(`[√] Pengaturan "${key}" berhasil diubah ke "${newValue}"`)
    }
})