commands.add({
    name: ["createguild"],
    command: ["createguild"],
    param: "<name>",
    category: "rpg",
    register: true,
    level: 10,
    desc: "Membentuk Persekutuan Bintang di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        let guilds = global.db.guilds || {}
        global.db.guilds = guilds
        const now = Date.now()
        
        if (!args[0]) return m.reply("Masukkan nama guild! Contoh: !createguild BintangAbadi")
        const guildName = args.join(" ").replace(/\s+/g, "").slice(0, 20)
        if (guildName.length < 3) return m.reply("Nama guild minimal 3 karakter!")
        if (guilds[guildName.toLowerCase()]) return m.reply("Guild dengan nama itu sudah ada! Pilih nama lain.")
        if (user.guild) return m.reply(`Kamu sudah bergabung di *${user.guild}*! Keluar dulu dengan !leaveguild.`)
        
        const moneyCost = 5000
        const limitCost = 1
        const useLimit = user.money < moneyCost && user.limit >= limitCost
        if (user.money < moneyCost && !useLimit) {
            return m.reply(`Kamu perlu 💸 ${moneyCost} Money atau ⏳ ${limitCost} Limit untuk membuat guild! Kamu punya: 💸 ${user.money}, ⏳ ${user.limit}`)
        }
        
        guilds[guildName.toLowerCase()] = {
            ...guilds.template,
            name: guildName,
            leader: userId,
            members: [userId]
        }
        user.guild = guildName
        if (useLimit) {
            user.limit -= limitCost
        } else {
            user.money -= moneyCost
        }
        
        const expGain = 100
        Func.addExp(user, expGain)
        db.users[userId] = user
        
        let replyText = `🌟 *Persekutuan Bintang Dibentuk!*\n\n`
        replyText += `Kamu mengibarkan spanduk *${guildName}* di Lembah Arvandor. Sebagai pemimpin, kamu bersumpah memimpin Persekutuan Bintang menuju kejayaan! ${user.activePet ? `*${user.activePet.toUpperCase()}* mengaum, menyambut spanduk baru!` : ""}\n\n`
        replyText += `💥 Biaya: ${useLimit ? `⏳ ${limitCost} Limit` : `💸 ${moneyCost} Money`}\n`
        replyText += `🎁 Kamu mendapatkan: ${expGain} EXP\n`
        replyText += `\n\n> Undang anggota dengan !joinguild ${guildName} atau lihat detail dengan !infoguild!`
        
        m.reply(replyText)
    }
})

commands.add({
    name: ["joinguild"],
    command: ["joinguild"],
    param: "<name>",
    category: "rpg",
    register: true,
    level: 10,
    desc: "Bergabung ke Persekutuan Bintang",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        let guilds = global.db.guilds || {}
        global.db.guilds = guilds
        
        if (!args[0]) return m.reply("Masukkan nama guild! Contoh: !joinguild BintangAbadi")
        const guildName = args.join(" ").replace(/\s+/g, "").slice(0, 20).toLowerCase()
        const guild = guilds[guildName]
        if (!guild) return m.reply("Guild tidak ditemukan! Periksa nama guild.")
        if (user.guild) return m.reply(`Kamu sudah bergabung di *${user.guild}*! Keluar dulu dengan !leaveguild.`)
        if (guild.members.length >= 20) return m.reply(`*${guild.name}* sudah penuh (maks 20 anggota)!`)
        
        guild.members.push(userId)
        user.guild = guild.name
        
        const expGain = 50
        Func.addExp(user, expGain)
        db.users[userId] = user
        
        let replyText = `🌟 *Bergabung dengan Persekutuan Bintang!*\n\n`
        replyText += `Kamu bersumpah setia pada *${guild.name}*, bergabung dengan petualang lain di bawah spanduk berkilau! ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat gembira di markas guild!` : ""}\n\n`
        replyText += `🎁 Kamu mendapatkan: ${expGain} EXP\n`
        replyText += `Lihat detail guild dengan !infoguild atau sumbang sumber daya dengan !contributeguild!`
        
        m.reply(replyText)
    }
})

commands.add({
    name: ["leaveguild"],
    command: ["leaveguild"],
    param: "<name>",
    category: "rpg",
    register: true,
    level: 10,
    desc: "Meninggalkan Persekutuan Bintang",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        let guilds = global.db.guilds || {}
        global.db.guilds = guilds
        
        if (!user.guild) return m.reply("Kamu tidak bergabung di guild mana pun!")
        const guild = guilds[user.guild.toLowerCase()]
        if (!guild) {
            user.guild = null
            db.users[userId] = user
            return m.reply("Guild tidak ditemukan! Kamu sekarang bebas dari guild.")
        }
        if (guild.leader === userId) return m.reply("Pemimpin tidak bisa meninggalkan guild! Tunjuk pemimpin baru terlebih dahulu.")
        
        guild.members = guild.members.filter(id => id !== userId)
        user.guild = null
        
        db.users[userId] = user
        
        let replyText = `🌌 *Meninggalkan Persekutuan Bintang*\n\n`
        replyText += `Kamu menurunkan spanduk *${guild.name}* dan memilih berjalan sendiri di Lembah Arvandor. ${user.activePet ? `*${user.activePet.toUpperCase()}* mengikuti dengan setia!` : ""}\n\n`
        replyText += `Bergabung dengan guild lain dengan !joinguild atau buat sendiri dengan !createguild!`
        
        m.reply(replyText)
    }
})

commands.add({
    name: ["contributeguild"],
    command: ["contributeguild"],
    category: "rpg",
    register: true,
    level: 10,
    desc: "Menyumbang sumber daya ke Persekutuan Bintang",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId] 
        let guilds = global.db.guilds || {}
        global.db.guilds = guilds
        const now = Date.now()
        
        if (!user.guild) return m.reply("Kamu tidak bergabung di guild mana pun! Gunakan !joinguild.")
        const guild = guilds[user.guild.toLowerCase()]
        if (!guild) return m.reply("Guild tidak ditemukan! Hubungi pemimpin guild.")
        
        if (!args[0] || !args[1] || isNaN(args[1])) {
            return m.reply("Masukkan item dan jumlah! Contoh: !contributeguild money 1000\n\n> *Item tersedia:* money, wood, iron, string, milk, wool, egg, goldenEgg")
        }
        
        const item = args[0].toLowerCase()
        const amount = Math.floor(Number(args[1]))
        if (amount <= 0) return m.reply("Jumlah harus lebih dari 0!")
        
        const validItems = ["money", "wood", "iron", "string", "milk", "wool", "egg", "goldenEgg"]
        if (!validItems.includes(item)) return m.reply("Item tidak valid! Pilih: money, wood, iron, string, milk, wool, egg, goldenEgg")
        
        if (user.guildLastContribute && now < user.guildLastContribute + 3600000) {
            const timeLeft = Func.clockString(user.guildLastContribute + 3600000 - now)
            return m.reply(`🌟 Kamu baru saja menyumbang! Sumbang lagi dalam ${timeLeft}`)
        }
        
        const userField = item === "money" || item === "wood" || item === "iron" || item === "string" ? item : `products.${item}`
        const userAmount = item === "money" || item === "wood" || item === "iron" || item === "string" ? user[item] : user.products[item]
        if (userAmount < amount) {
            return m.reply(`Kamu tidak punya cukup ${item}! Kamu punya: ${userAmount}`)
        }
        
        if (item === "money" || item === "wood" || item === "iron" || item === "string") {
            user[item] -= amount
            guild.bank[item] += amount
        } else {
            user.products[item] -= amount
            guild.bank[item] += amount
        }
        
        user.guildLastContribute = now
        const expGain = Math.floor(amount / 10)
        Func.addExp(user, expGain)
        if (user.activePet) {
            Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5))
        }
        db.users[userId] = user
        
        let replyText = `🌟 *Sumbangan ke Persekutuan Bintang!*\n\n`
        replyText += `Kamu menyumbangkan ${item === "money" ? Func.formatUang(amount) : amount} *${item}* ke bank *${guild.name}*. Spanduk guild bersinar lebih terang! ${user.activePet ? `*${user.activePet.toUpperCase()}* membawa sumbangan dengan bangga!` : ""}\n\n`
        replyText += `🎁 Kamu mendapatkan: ${expGain} EXP\n`
        if (user.activePet) replyText += `    ▢  *${user.activePet.toUpperCase()}*: ${Math.floor(expGain * 0.5)} EXP\n`
        replyText += `\n> Lihat bank guild dengan !infoguild!`
        
        m.reply(replyText)
    }
})

commands.add({
    name: ["upgradeguild"],
    command: ["upgradeguild"],
    category: "rpg",
    register: true,
    level: 10,
    desc: "Meningkatkan level Persekutuan Bintang",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        let guilds = global.db.guilds || {}
        global.db.guilds = guilds
        const now = Date.now()
        
        if (!user.guild) return m.reply("Kamu tidak bergabung di guild mana pun! Gunakan !joinguild.")
        const guild = guilds[user.guild.toLowerCase()]
        if (!guild) return m.reply("Guild tidak ditemukan! Hubungi pemimpin guild.")
        if (guild.leader !== userId) return m.reply("Hanya pemimpin guild yang bisa melakukan upgrade!")
        
        if (guild.lastUpgrade && now < guild.lastUpgrade + 86400000) {
            const timeLeft = Func.clockString(guild.lastUpgrade + 86400000 - now)
            return m.reply(`🌟 Markas guild masih ditingkatkan! Coba lagi dalam ${timeLeft}`)
        }
        
        const baseCosts = {
            money: 10000 * guild.level,
            wood: 50 * guild.level,
            iron: 30 * guild.level,
            string: 20 * guild.level
        }
        const missingResources = Object.entries(baseCosts)
            .filter(([item, amount]) => guild.bank[item] < amount)
            .map(([item, amount]) => `${item}: ${guild.bank[item]}/${amount}`)
        if (missingResources.length > 0) {
            return m.reply(`Bank guild tidak cukup! Perlu: ${missingResources.join(", ")}\nSumbang dengan !contributeguild!`)
        }
        
        guild.level += 1
        guild.bank.money -= baseCosts.money
        guild.bank.wood -= baseCosts.wood
        guild.bank.iron -= baseCosts.iron
        guild.bank.string -= baseCosts.string
        guild.lastUpgrade = now
        
        const expGain = 200
        for (let memberId of guild.members) {
            const member = db.users[memberId]
            Func.addExp(member, expGain)
            db.users[memberId] = member
        }
        
        let replyText = `🌟 *Persekutuan Bintang Ditingkatkan!*\n\n`
        replyText += `Markas *${guild.name}* kini lebih megah, mencapai Level ${guild.level}! Cahaya bintang memperkuat spanduk, memberikan bonus ${guild.level * 5}% damage di event! ${user.activePet ? `*${user.activePet.toUpperCase()}* menari di markas baru!` : ""}\n\n`
        replyText += `💥 Biaya: 💸 ${baseCosts.money}, 🪵 ${baseCosts.wood}, ⛓️ ${baseCosts.iron}, 🧵 ${baseCosts.string}\n`
        replyText += `🎁 Semua anggota mendapatkan: ${expGain} EXP\n`
        replyText += `Lihat detail guild dengan !infoguild!`
        
        m.reply(replyText)
    }
})

commands.add({
    name: ["infoguild"],
    command: ["infoguild"],
    category: "rpg",
    register: true,
    level: 10,
    desc: "Melihat detail Persekutuan Bintang",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        let guilds = global.db.guilds || {}
        global.db.guilds = guilds
        
        if (!user.guild) return m.reply("Kamu tidak bergabung di guild mana pun! Gunakan !joinguild.")
        const guild = guilds[user.guild.toLowerCase()]
        if (!guild) return m.reply("Guild tidak ditemukan! Hubungi pemimpin guild.")
        
        let replyText = `🌟 *PERSEKUTUAN BINTANG: ${guild.name}*\n\n`
        replyText += `Spanduk *${guild.name}* berkibar gagah di Lembah Arvandor, menyatukan petualang dalam kejayaan! ${user.activePet ? `*${user.activePet.toUpperCase()}* berjaga di markas guild!` : ""}\n\n`
        replyText += `📊 *DETAIL GUILD*\n`
        replyText += `    ▢ Level: ${guild.level} (Bonus: ${guild.level * 5}% damage event)\n`
        replyText += `    ▢ Pemimpin: ${db.users[guild.leader]?.name || guild.leader.split("@")[0]}\n`
        replyText += `    ▢ Anggota: ${guild.members.length}/20\n`
        replyText += guild.members.map(id => `        · @${id.split("@")[0]}`).join("\n") + "\n"
        replyText += `    ▢ Kontribusi Event: ${guild.eventContribution}\n`
        replyText += `\n🏦 *BANK GUILD*\n`
        replyText += `    ▢ 💸 Money: ${Func.formatUang(guild.bank.money)}\n`
        replyText += `    ▢ 🪵 Wood: ${guild.bank.wood}\n`
        replyText += `    ▢ ⛓️ Iron: ${guild.bank.iron}\n`
        replyText += `    ▢ 🧵 String: ${guild.bank.string}\n`
        replyText += `    ▢ 🥛 Milk: ${guild.bank.milk}\n`
        replyText += `    ▢ 🧶 Wool: ${guild.bank.wool}\n`
        replyText += `    ▢ 🥚 Egg: ${guild.bank.egg}\n`
        replyText += `    ▢ 🌟 Golden Egg: ${guild.bank.goldenEgg}\n`
        replyText += `\n> Gunakan !contributeguild untuk menyumbang atau !upgradeguild untuk meningkatkan guild!`
        
        m.reply(replyText)
    }
})

commands.add({
    name: ["topguild"],
    command: ["topguild"],
    category: "rpg",
    register: true,
    level: 10,
    desc: "Melihat peringkat Persekutuan Bintang di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId] || { ...defaultUser }
        let guilds = global.db.guilds || {}
        global.db.guilds = guilds
        db.events = initializeEventsDatabase(db)
        const now = Date.now()
        
        // cek cooldown (5 menit = 300000 ms)
        if (user.lastTopGuild && now < user.lastTopGuild + 300000) {
            const timeLeft = Func.clockString(user.lastTopGuild + 300000 - now)
            return m.reply(`🌟 Spanduk guild masih bersinar! Lihat lagi dalam ${timeLeft}`)
        }        
        user.lastTopGuild = now
        db.users[userId] = user       
        // ambil dan urutkan guild
        const sortedGuilds = Object.values(guilds)
            .filter(g => g.eventContribution > 0) // Hanya guild dengan kontribusi
            .sort((a, b) => b.eventContribution - a.eventContribution || b.level - a.level) // tiebreaker: level guild
            .slice(0, 5)        
        let replyText = `🌟 *Papan Spanduk Persekutuan Bintang*\n\n`
        replyText += `Di Lembah Arvandor, spanduk-spanduk berkilau menandakan kejayaan guild terkuat dalam Festival Bintang Jatuh! ${user.activePet ? `*${user.activePet.toUpperCase()}* mengaum melihat spanduk megah!` : ""}\n\n`        
        if (sortedGuilds.length === 0) {
            replyText += `Belum ada Persekutuan Bintang yang berkontribusi! Buat guild dengan !createguild atau ikut event dengan !event join.`
        } else {
            replyText += `🏅 *Top Persekutuan Bintang*\n`
            sortedGuilds.forEach((guild, i) => {
                replyText += `- ${i + 1}. ${guild.name} (Level ${guild.level}): ${guild.eventContribution} kontribusi\n`
            })
            if (user.guild) {
                const userGuild = guilds[user.guild.toLowerCase()]
                if (userGuild) {
                    const rank = sortedGuilds.findIndex(g => g.name.toLowerCase() === user.guild.toLowerCase()) + 1
                    replyText += `\n📈 *Guildmu*\n`
                    replyText += `- ${user.guild}: ${userGuild.eventContribution} kontribusi (Peringkat: ${rank || "Tidak masuk top 5"})\n`
                }
            }
        }        
        replyText += `\n\n> Ketik *!infoguild* untuk detail guild atau !event contribute untuk menambah kontribusi!`
        m.reply(replyText)
    }
})

function initializeEventsDatabase(db) {
    // pastikan db ada // Gw capeee
    db.events = db.events || {}
    // struktur default untuk db.events
    const defaultEvents = {
        activeEvent: null, // null berarti tidak ada event aktif
        lastEvent: 0
    }
    // inisialisasi field utama
    Object.keys(defaultEvents).forEach(key => {
        if (!(key in db.events)) {
            db.events[key] = defaultEvents[key]
        }
    })    
    // struktur default untuk activeEvent (digunakan saat membuat event baru)
    db.events.defaultActiveEvent = {
        type: "",
        name: "",
        startTime: 0,
        endTime: 0,
        goal: {},
        progress: {},
        participants: [],
        completed: false
    }    
    // jika activeEvent ada tapi tidak valid (misalnya, waktu habis), reset
    if (db.events.activeEvent && Date.now() > db.events.activeEvent.endTime) {
        db.events.lastEvent = db.events.activeEvent.endTime
        db.events.activeEvent = null
    }    
    return db.events
}