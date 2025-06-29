commands.add({
    name: ["contribute"],
    command: ["contribute"],
    category: "rpg",
    register: true,
    desc: "Menyumbang ke Festival Bintang Jatuh",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        db.events = db.events || {}
        const now = Date.now()        
        if (!db.events.activeEvent || now > db.events.activeEvent.endTime) {
            return m.reply("🌌 Festival Bintang Jatuh telah berakhir! Tunggu bintang-bintang turun lagi.")
        }        
        if (!db.events.activeEvent.participants.includes(userId)) {
            return m.reply("Kamu belum bergabung! Gunakan !joinevent untuk ikut *Festival Bintang Jatuh*.")
        }        
        if (!args[0] || args[0].toLowerCase() !== "serang") {
            return m.reply("Aksi tidak valid! Gunakan: .contribute serang")
        }        
        // Cek cooldown (30 menit = 1800000 ms)
        if (user.lastEventAction && now < user.lastEventAction + 1800000) {
            const timeLeft = Func.clockString(user.lastEventAction + 1800000 - now)
            return m.reply(`⚔️ Kamu masih pulih dari serangan sebelumnya! Serang lagi dalam ${timeLeft}`)
        }        
        // Cek senjata
        const weapons = [
            { name: "sword", count: user.sword, durability: user.sworddurability, damage: 100 },
            { name: "bow", count: user.bow, durability: user.bowdurability, damage: 80 },
            { name: "magicWand", count: user.magicWand, durability: user.magicWanddurability, damage: 120 }
        ]
        const availableWeapon = weapons.find(w => w.count > 0 && w.durability > 0)
        if (!availableWeapon) {
            return m.reply("Kamu tidak punya senjata yang bisa digunakan! Craft dengan !craft atau perbaiki dengan !repair.")
        }        
        // Cek health
        if (user.health < 20) {
            return m.reply("❤️ Health terlalu rendah! Pulihkan dengan !use potion sebelum menyerang naga.")
        }        
        // Hitung damage
        let baseDamage = availableWeapon.damage * (user.level / 2)
        if (user.activePet) {
            baseDamage *= 1.1 // Bonus 10% dari pet
        }
        if (user.kandang.length > 0) {
            const productBoost = Math.min(user.kandang.length * 10, 100) // Maks 100% dari kandang
            baseDamage *= (1 + productBoost / 100)
        }
        const damage = Math.floor(baseDamage * (0.8 + Math.random() * 0.4)) // Variasi ±20%        
        // Kurangi durabilitas senjata
        user[`${availableWeapon.name}durability`] -= 10
        if (user[`${availableWeapon.name}durability`] <= 0) {
            user[`${availableWeapon.name}durability`] = 0
            user[availableWeapon.name] -= 1
        }        
        // Kurangi health
        const healthLoss = Math.floor(10 + Math.random() * 10)
        user.health = Math.max(0, user.health - healthLoss)        
        // Tambah kontribusi
        user.eventContribution = (user.eventContribution || 0) + damage
        db.events.activeEvent.progress.damageDealt += damage
        db.events.activeEvent.progress.hp = Math.max(0, db.events.activeEvent.progress.hp - damage)
        // Berikan hadiah kecil
        const expGain = Math.floor(damage / 10)
        const moneyGain = Math.floor(damage / 5)
        const potionChance = Math.random() < 0.1 ? 1 : 0
        const limitChance = Math.random() < 0.05 ? 1 : 0
        user.money += moneyGain
        user.potion += potionChance
        user.limit += limitChance
        Func.addExp(user, expGain)
        if (user.activePet) {
            Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5))
        }        
        // cek apakah bos dikalahkan
        let bossDefeated = false
        if (db.events.activeEvent.progress.hp <= 0 && !db.events.activeEvent.completed) {
            db.events.activeEvent.completed = true
            bossDefeated = true
            const participants = db.events.activeEvent.participants
            const sortedParticipants = participants
                .map(id => ({ id, contribution: db.users[id]?.eventContribution || 0 }))
                .sort((a, b) => b.contribution - a.contribution)            
            // Hadiah kolaboratif
            for (let p of participants) {
                const pUser = db.users[p]
                pUser.eventRewards = pUser.eventRewards || []
                pUser.eventRewards.push({ type: "money", value: 5000 })
                pUser.eventRewards.push({ type: "potion", value: 3 })
                pUser.eventRewards.push({ type: "limit", value: 2 })
                pUser.money += 5000
                pUser.potion += 3
                pUser.limit += 2
                Func.addExp(pUser, 1000)
                db.users[p] = pUser
            }            
            // Hadiah top kontributor
            if (sortedParticipants[0]?.id === userId) {
                user.eventRewards.push({ type: "title", value: "Pembunuh Naga" })
                user.title = "Pembunuh Naga"
            }
        }        
        user.lastEventAction = now
        db.users[userId] = user        
        // narasi acak
        const contributeStories = [
            `Kamu mengayunkan *${availableWeapon.name}* ke arah *Naga Bintang*! Pukulanmu menggetarkan langit, menyebabkan ${damage} damage! ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat, memperkuat seranganmu!` : ""}`,
            `Dengan keberanian, kamu menyerang *Naga Bintang* menggunakan *${availableWeapon.name}*. Ledakan cahaya menyala, memberikan ${damage} damage! ${user.activePet ? `*${user.activePet.toUpperCase()}* mengaum mendukungmu!` : ""}`,
            `Di tengah Festival Bintang Jatuh, kamu menghantam *Naga Bintang* dengan *${availableWeapon.name}*. Naga itu meraung, menerima ${damage} damage! ${user.activePet ? `*${user.activePet.toUpperCase()}* berlari di sampingmu!` : ""}`
        ]        
        let replyText = `⚔️ *Serangan ke Naga Bintang!*\n\n`
        replyText += `${contributeStories[Math.floor(Math.random() * contributeStories.length)]}\n\n`
        replyText += `🎯 Kontribusi:\n`
        replyText += `   ▢ Damage: ${damage}\n`
        replyText += `   ▢ Total Kontribusimu: ${user.eventContribution}\n`
        replyText += `\n💥 Efek:\n`
        replyText += `   ▢ ❤️ Health: -${healthLoss}\n`
        replyText += `   ▢ *${availableWeapon.name}* Durabilitas: -10\n`
        replyText += `\n🎁 Hadiah:\n`
        replyText += `   ▢ 💸 Money: ${Func.formatUang(moneyGain)}\n`
        replyText += `   ▢ ${expGain} EXP\n`
        if (potionChance) replyText += `   ▢ 🧪 Potion: ${potionChance}\n`
        if (limitChance) replyText += `   ▢ ⏳ Limit: ${limitChance}\n`
        if (user.activePet) replyText += `   ▢ *${user.activePet.toUpperCase()}*: ${Math.floor(expGain * 0.5)} EXP\n`
        if (bossDefeated) {
            replyText += `\n🏆 *Naga Bintang Dikalahkan!*\n`
            replyText += `Petualang Arvandor bersorak! Semua peserta mendapatkan 💸 5000 Money, 🧪 3 Potion, ⏳ 2 Limit, dan 1000 EXP!\n`
            if (user.eventContribution === Math.max(...db.events.activeEvent.participants.map(id => db.users[id]?.eventContribution || 0))) {
                replyText += `Kamu adalah *Pembunuh Naga*! Gelar baru: *Pembunuh Naga*!`
            }
        }        
        m.reply(replyText)
    }
})

commands.add({
    name: ["statusevent"],
    command: ["statusevent"],
    category: "rpg",
    register: true,
    desc: "Melihat progres Festival Bintang Jatuh",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        db.events = db.events || {}
        const now = Date.now()        
        if (!db.events.activeEvent || now > db.events.activeEvent.endTime) {
            return m.reply("🌌 Festival Bintang Jatuh telah berakhir! Tunggu bintang-bintang turun lagi.")
        }        
        const event = db.events.activeEvent
        const timeLeft = Func.clockString(event.endTime - now)
        const sortedParticipants = event.participants
            .map(id => ({ id, name: db.users[id]?.name || "-", tag: `@${id.split("@")[0]}`, contribution: db.users[id]?.eventContribution || 0 }))
            .sort((a, b) => b.contribution - a.contribution)
            .slice(0, 5)        
        let replyText = `🌟 *Festival Bintang Jatuh: ${event.name}*\n\n`
        replyText += `Langit Arvandor bersinar terang, dan *Naga Bintang* masih mengaum! Petualang bersatu untuk mengalahkannya sebelum bintang-bintang memudar. ${user.activePet ? `*${user.activePet.toUpperCase()}* menatap langit, siap bertarung!` : ""}\n\n`
        replyText += `📊 *Progres Event*\n`
        replyText += `   ▢ HP Naga: ${event.progress.hp}/${event.goal.hp}\n`
        replyText += `   ▢ Total Damage: ${event.progress.damageDealt}\n`
        replyText += `   ▢ Waktu Tersisa: ${timeLeft}\n`
        replyText += `   ▢ Peserta: ${event.participants.length}\n`
        replyText += `\n🏅 *Top Kontributor*\n`
        sortedParticipants.forEach((p, i) => {
            replyText += `   ▢ ${i + 1}. ${p.tag}(${p.name}): ${p.contribution} damage\n`
        })
        replyText += `\n📈 *Kontribusimu*\n`
        replyText += `   ▢ Damage: ${user.eventContribution || 0}\n`
        replyText += `   ▢ Peringkat: ${sortedParticipants.findIndex(p => p.id === userId) + 1 || "Belum berkontribusi"}\n`
        replyText += `\nGunakan !contribute serang untuk menyerang naga!`        
        m.reply(replyText)
    }
})


commands.add({
    name: ["joinevent"],
    command: ["joinevent"],
    category: "rpg",
    register: true,
    desc: "Bergabung ke Festival Bintang Jatuh di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        db.events = initializeEventsDatabase(db)
        const now = Date.now()
        
        if (!db.events.activeEvent || db.events.activeEvent.completed) {
            let replyText = `🌌 Tidak ada Festival Bintang Jatuh saat ini! `
            if (db.events.lastEvent && now < db.events.lastEvent + 604800000) {
                const timeLeft = Func.clockString(db.events.lastEvent + 604800000 - now)
                replyText += `Bintang-bintang masih beristirahat. Festival berikutnya dalam ${timeLeft}.`
            } else {
                replyText += `Tunggu pengumuman Festival Bintang Jatuh berikutnya!`
            }
            return m.reply(replyText)
        }
        
        if (db.events.activeEvent.participants.includes(userId)) {
            return m.reply("Kamu sudah bergabung di *Festival Bintang Jatuh*! Gunakan !event status untuk melihat progres.")
        }
        
        db.events.activeEvent.participants.push(userId)
        user.eventContribution = user.eventContribution || 0
        user.eventRewards = user.eventRewards || []
        
        const expGain = 20
        Func.addExp(user, expGain)
        db.users[userId] = user
        
        let replyText = `🌟 *Bergabung dengan Festival Bintang Jatuh!*\n\n`
        replyText += `Kamu melangkah ke tengah Lembah Arvandor, di mana *${db.events.activeEvent.name}* sedang berlangsung. Langit berkilau, dan petualang lain bersiap. Naga Bintang mengaum di kejauhan! ${user.activePet ? `*${user.activePet.toUpperCase()}* menggonggong, siap bertarung!` : ""}\n\n`
        replyText += `🎁 Kamu mendapatkan: ${expGain} EXP\n`
        replyText += `\n> Gunakan *.contribute serang* serang untuk menyerang naga atau !event status untuk melihat progres!`
        
        m.reply(replyText)
    }
})

commands.add({
    name: ["startevent"],
    command: ["startevent"],
    category: "rpg",
    register: true,
    desc: "Memulai Festival Bintang Jatuh di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId] 
        db.events = initializeEventsDatabase(db)
        
        const isAdmin = user.role === "admin"
        const isGuildLeader = user.guild && db.guilds[user.guild.toLowerCase()]?.leader === userId
        if (!isAdmin && !isGuildLeader) {
            return m.reply("Hanya admin atau pemimpin guild yang bisa memulai Festival Bintang Jatuh!")
        }
        
        if (db.events.activeEvent) {
            const timeLeft = Func.clockString(db.events.activeEvent.endTime - Date.now())
            return m.reply(`🌌 Festival Bintang Jatuh sedang berlangsung: *${db.events.activeEvent.name}*! Selesai dalam ${timeLeft}`)
        }
        if (db.events.lastEvent && Date.now() < db.events.lastEvent + 604800000) {
            const timeLeft = Func.clockString(db.events.lastEvent + 604800000 - Date.now())
            return m.reply(`🌌 Bintang-bintang masih beristirahat! Festival berikutnya dalam ${timeLeft}`)
        }
        
        let eventStarted = false
        const eventType = args[0]?.toLowerCase() || "dragonHunt"
        if (eventType === "dragonHunt") {
            eventStarted = startDragonHuntEvent()
        } else if (eventType === "productionFestival") {
            eventStarted = startProductionFestival()
        } else {
            return m.reply("Jenis event tidak valid! \n\n> Pilih: dragonHunt, productionFestival")
        }
        
        if (!eventStarted) {
            return m.reply("Gagal memulai event! Mungkin ada event lain atau jeda belum selesai.")
        }
        
        let replyText = `🌟 *Festival Bintang Jatuh Dimulai!*\n\n`
        replyText += `Langit Arvandor bersinar terang, dan *${db.events.activeEvent.name}* telah dimulai! ${eventType === "dragonHunt" ? "Naga Bintang mengaum, menantang petualang!" : "Ladang bersinar, menanti hasil panen terbaik!"} ${user.activePet ? `*${user.activePet.toUpperCase()}* bersiap untuk bertarung!` : ""}\n\n`
        replyText += `📅 Berlangsung hingga: ${Func.clockString(db.events.activeEvent.endTime - Date.now())} tersisa\n`
        replyText += `\n> Gunakan *.joinevent*  untuk ikut atau !event status untuk melihat progres!`
        
        m.reply(replyText)
    }
})

// Inisialisasi db.events
function initializeEventsDatabase(db) {
    // Pastikan db ada // Gw capeee
    db.events = db.events || {}
    // Struktur default untuk db.events
    const defaultEvents = {
        activeEvent: null, // null berarti tidak ada event aktif
        lastEvent: 0
    }
    // Inisialisasi field utama
    Object.keys(defaultEvents).forEach(key => {
        if (!(key in db.events)) {
            db.events[key] = defaultEvents[key]
        }
    })    
    // Struktur default untuk activeEvent (digunakan saat membuat event baru)
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
    // Jika activeEvent ada tapi tidak valid (misalnya, waktu habis), reset
    if (db.events.activeEvent && Date.now() > db.events.activeEvent.endTime) {
        db.events.lastEvent = db.events.activeEvent.endTime
        db.events.activeEvent = null
    }    
    return db.events
}

function startDragonHuntEvent() {
    db.events = initializeEventsDatabase(db)
    if (db.events.activeEvent || (db.events.lastEvent && Date.now() < db.events.lastEvent + 604800000)) {
        return false // Event sedang berlangsung atau jeda
    }
    
    db.events.activeEvent = {
        ...db.events.defaultActiveEvent,
        type: "dragonHunt",
        name: "Perburuan Naga Bintang",
        startTime: Date.now(),
        endTime: Date.now() + 259200000, // 3 hari
        goal: { hp: 100000 },
        progress: { hp: 100000, damageDealt: 0 },
        participants: [],
        completed: false
    }
    return true
}

function startProductionFestival() {
    db.events = initializeEventsDatabase(db)
    if (db.events.activeEvent || (db.events.lastEvent && Date.now() < db.events.lastEvent + 604800000)) {
        return false
    }
    
    db.events.activeEvent = {
        ...db.events.defaultActiveEvent,
        type: "productionFestival",
        name: "Festival Produksi Arvandor",
        startTime: Date.now(),
        endTime: Date.now() + 259200000, // 3 hari
        goal: { products: 10000 }, // Target 10,000 produk
        progress: { products: 0, milk: 0, wool: 0, egg: 0, goldenEgg: 0 },
        participants: [],
        completed: false
    }
    return true
}

/*
// Scheduler untuk memulai event otomatis
setInterval(() => {
    db.events = initializeEventsDatabase(db)
    if (!db.events.activeEvent && (!db.events.lastEvent || Date.now() >= db.events.lastEvent + 604800000)) {
        if (startDragonHuntEvent()) {
            console.log(`[EVENT] Festival Bintang Jatuh dimulai: Perburuan Naga Bintang`)
            // Opsional: Kirim broadcast ke grup
            // sius.sendMessage("groupId@group.whatsapp.net", { text: "🌟 Festival Bintang Jatuh dimulai! Gunakan *.joinevent*  untuk ikut!" })
        }
    }
}, 3600000) // Cek setiap jam
*/