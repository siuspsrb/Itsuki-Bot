commands.add({
    name: ["status","statistik"],
    command: ["status","statistik"],
    category: "user",
    register: true,
    desc: "Melihat cerminan jiwa di Cermin Bintang Abadi Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
        let user = db.users[userId]
        if (!user) return m.reply("[×] User tidak terdaftar di database bot")
        const now = Date.now()
        if (user.lastStatus && now < user.lastStatus + 120000) {
            const timeLeft = Func.clockString(user.lastStatus + 120000 - now)
            return m.reply(`🌟 Cermin Bintang Abadi masih bersinar! Lihat lagi dalam beberapa saat* \n\nTimeout: [ *${timeLeft}* ]`)
        }
        const statusStories = [
            `Kamu berdiri di depan *Cermin Bintang Abadi*, artefak kuno yang mencerminkan jiwamu. Kekuatan, keberanian, dan harta terpampang jelas di hadapanmu! ${user.activePet ? `*${user.activePet.toUpperCase()}* menatap cermin dengan penuh semangat!` : ""}`,
            `Cahaya bintang menyinari *Cermin Bintang Abadi*. Kamu melihat bayangan petualang sejati, siap menghadapi tantangan Arvandor! ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat di sampingmu, penuh kebanggaan!` : ""}`,
            `Di bawah langit malam Arvandor, *Cermin Bintang Abadi* menunjukkan kekuatanmu. Jiwa petualangmu bersinar, menanti petualangan berikutnya! ${user.activePet ? `*${user.activePet.toUpperCase()}* menggonggong, mendukungmu!` : ""}`
        ]
        const expGain = 3
        Func.addExp(user, expGain)
        user.lastStatus = now
        db.users[userId] = user
        //let name = await sius.getName(userId) || "-"
        let replyText = `${statusStories[Math.floor(Math.random() * statusStories.length)].trim()}\n\n`
        replyText += `*STATISTIK PETUALANG*\n`
        replyText += `[🪽] Nama: ${user.name}\n`
        replyText += `[🎓] Level: ${user.level} (EXP: ${user.exp}/${user.level * 100})\n`
        replyText += `[❤️] Health: ${user.health}/100${user.health < 30 ? " ⚠️ Pulihkan dengan *.heal*" : ""}\n`
        replyText += `[💵] Money: ${Func.formatUang(user.money)}\n`
        replyText += `[🎖️] Point: ${user.point}\n`
        replyText += `\n*PET AKTIF*\n`
        if (!user.activePet) {
            replyText += "> Tidak ada pet aktif. Aktifkan dengan !pet activate!\n"
        } else {
            const pet = {
                dog: { emoji: "🐶", level: user.dogLevel, exp: user.dogexp },
                cat: { emoji: "🐱", level: user.catLevel, exp: user.catExp },
                fox: { emoji: "🦊", level: user.foxLevel, exp: user.foxexp },
                horse: { emoji: "🐎", level: user.horseLevel, exp: user.horseexp }
            }[user.activePet]
            replyText += `[${pet.emoji}] ${user.activePet.toUpperCase()}: Level ${pet.level} (EXP: ${pet.exp}/${pet.level * 100})\n`
        }
        replyText += `\n*STATISTIK KANDANG*\n`
        replyText += `[🍂] Level Kandang: ${user.kandangLevel}\n`
        replyText += `[🫎] Hewan: ${user.kandang.length}/${user.kandangCapacity}\n`
        const hungryAnimals = user.kandang.filter(a => !a.fed).length
        replyText += `[🍁] Status: ${hungryAnimals > 0 ? `\n> ${hungryAnimals} hewan lapar Beri makan dengan !carekandang!` : "Semua hewan sehat"}\n`
        replyText += `\n*PENCAPAIAN*\n`
        replyText += `[⚔️] Battle Wins: ${user.battleWins}\n`
        replyText += `[🌾] Total Produk: ${user.totalProducts}\n`
        replyText += `[🎰] Slot Wins: ${user.slotWins}\n`
        replyText += `\n*STATUS PETUALANGAN*\n`
        const cooldowns = [
            { name: "Berburu", field: "lastHunt", duration: 1800000, command: ".berburu" },
            { name: "Adventure", field: "lastAdventure", duration: 3600000, command: ".adventure" },
            { name: "Battle", field: "lastbattle", duration: 1800000, command: ".battle" },
            { name: "Repair", field: "lastrepair", duration: 300000, command: ".repair" },
            { name: "Care Kandang", field: "lastCare", duration: 43200000, command: ".carekandang" },
            { name: "Upgrade Kandang", field: "lastKandangUpgrade", duration: 3600000, command: ".upgradekandang" },
            { name: "Leaderboard", field: "lastLeaderboard", duration: 300000, command: ".leaderboard" },
            { name: "Inventory", field: "lastInventory", duration: 180000, command: "!inventory" }
        ]
        let hasCooldown = false
        for (let c of cooldowns) {
            if (user[c.field] && now < user[c.field] + c.duration) {
                hasCooldown = true
                const timeLeft = Func.clockString(user[c.field] + c.duration - now)
                replyText += `▢ ${c.name}: √\n`
            } else {
                replyText += `▢ ${c.name}: ×\n`
            }
        }
        if (!hasCooldown) replyText += "\n> Tidak ada aktivitas yang telah dilakukan!"
        replyText += `\n> Ketik *.inventory* untuk detail harta atau ${cooldowns.find(c => now >= (user[c.field] || 0) + c.duration)?.command || "!leaderboard"} untuk melanjutkan!`
        replyText += `> *+${expGain} EXP*`
        sius.reply(m.chat, replyText, "🌟 CERMIN BINTANG ABADI", false)
    }
})