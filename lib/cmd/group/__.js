commands.add({
    name: ["antilink"],
    command: ["antilink"],
    param: "<on/off>",
    category: "group",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan antilink grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.antilink) return m.reply("*Sudah Aktif Sebelumnya*")
            set.antilink = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.antilink = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".antilink on"],
            ["Off",".antilink off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["antivirtex"],
    command: ["antivirtex"],
    category: "group",
    param: "<on/off>",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan antivirtex grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.antivirtex) return m.reply("*Sudah Aktif Sebelumnya*")
            set.antivirtex = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.antivirtex = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".antivirtex on"],
            ["Off",".antivirtex off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["antidelete"],
    command: ["antidelete"],
    category: "group",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan antidelete grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.antidelete) return m.reply("*Sudah Aktif Sebelumnya*")
            set.antidelete = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.antidelete = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".antidelete on"],
            ["Off",".antidelete off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["welcome"],
    command: ["welcome"],
    category: "group",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan welcome grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.welcome) return m.reply("*Sudah Aktif Sebelumnya*")
            set.welcome = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.welcome = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".welcome on"],
            ["Off",".welcome off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["antitoxic"],
    command: ["antitoxic"],
    category: "group",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan antitoxic grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.antitoxic) return m.reply("*Sudah Aktif Sebelumnya*")
            set.antitoxic = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.antitoxic = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".antitoxic on"],
            ["Off",".antitoxic off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["nsfw"],
    command: ["nsfw"],
    category: "group",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan nsfw grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.nsfw) return m.reply("*Sudah Aktif Sebelumnya*")
            set.nsfw = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.nsfw = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".nsfw on"],
            ["Off",".nsfw off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["antihidetag"],
    command: ["antihidetag"],
    category: "group",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan antihidetag grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.antihidetag) return m.reply("*Sudah Aktif Sebelumnya*")
            set.antihidetag = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.antihidetag = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".antihidetag on"],
            ["Off",".antihidetag off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})

commands.add({
    name: ["antitagsw"],
    command: ["antitagsw"],
    category: "group",
    param: "<on/off>",
    admin: true,
    group: true,
    botAdmin: true,
    desc: "Mengaktifkan/menonaktifkan antitagsw grup",
    run: async({ sius, m, args }) => {
        const set = db.groups[m.chat]
        if (/on|true/i.test(args[0])) {
            if (set.antitagsw) return m.reply("*Sudah Aktif Sebelumnya*")
            set.antitagsw = true
            m.reply("*Berhasil diaktifkan !!*")
        } else if (/off|false/i.test(args[0])) {
            set.antitagsw = false
            m.reply("*Berhasil dinonaktifkan !!*")
        } else sius.sendButton(m.chat, [
            ["On",".antitagsw on"],
            ["Off",".antitagsw off"]
        ], {
            text: "*Silahkan pilih opsi di bawah*\n\n> On: Mengaktifkan\n> Off: Menonaktifkan", 
            quoted: m 
        })
    }
})