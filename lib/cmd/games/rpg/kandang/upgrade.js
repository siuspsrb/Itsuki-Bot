commands.add({
    name: ["upgradekandang"],
    command: ["upgradekandang"],
    category: "rpg",
    desc: "Meningkatkan Kandang Bintang Liar di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        user.kandangLevel = user.kandangLevel || 1
        user.kandangCapacity = user.kandangCapacity || 10
        user.kandangEfficiency = user.kandangEfficiency || 1.0
        user.kandangProduceCooldown = user.kandangProduceCooldown || 86400000
        const now = Date.now()
        
        if (!args[0]) return m.reply("Apa yang ingin kamu upgrade? Contoh: !upgradekandang kapasitas\n\n> Tersedia: kapasitas|efisiensi")
        
        const typeInput = args[0].toLowerCase()
        const validTypes = ["kapasitas", "efisiensi"]
        if (!validTypes.includes(typeInput)) {
            return m.reply("Jenis upgrade tidak valid! Pilih: kapasitas, efisiensi")
        }
        
        // cek cooldown (1 jam = 3600000 ms)
        if (user.lastKandangUpgrade && now < user.lastKandangUpgrade + 3600000) {
            const timeLeft = Func.clockString(user.lastKandangUpgrade + 3600000 - now)
            return m.reply(`🌾 Kandang masih dalam proses peningkatan! Coba lagi dalam ${timeLeft}`)
        }
        
        // hitung biaya dan manfaat
        const baseCosts = {
            kapasitas: {
                materials: { wood: 5 * user.kandangLevel, iron: 3 * user.kandangLevel },
                money: 1000 * user.kandangLevel,
                benefit: user.kandangLevel * 5 // +5 slot per level
            },
            efisiensi: {
                materials: { iron: 2 * user.kandangLevel, string: 2 * user.kandangLevel },
                money: 800 * user.kandangLevel,
                benefit: user.kandangLevel >= 5 ? 43200000 : 64800000 // kurangi cooldown atau tambah pengali
            }
        }
        const cost = baseCosts[typeInput]
        const materialCost = cost.materials
        const moneyCost = Func.getDynamicPrice(cost.money, user.level)
        
        // cek bahan atau uang
        const useMaterials = user.wood >= (materialCost.wood || 0) && user.iron >= materialCost.iron && user.string >= (materialCost.string || 0)
        if (!useMaterials && user.money < moneyCost) {
            let materialText = Object.entries(materialCost)
                .map(([mat, qty]) => `${mat === "wood" ? "🪵 Wood" : mat === "iron" ? "⛓️ Iron" : "🧵 String"}: ${qty}`)
                .join(", ")
            return m.reply(`Kamu tidak punya cukup bahan atau koin!\nPerlu: ${materialText} atau 💸 ${moneyCost} Money\nKamu punya: 🪵 ${user.wood}, ⛓️ ${user.iron}, 🧵 ${user.string}, 💸 ${user.money}`)
        }
        
        // proses upgrade
        let benefitText = ""
        if (typeInput === "kapasitas") {
            user.kandangCapacity += cost.benefit
            benefitText = `Kapasitas kandang meningkat menjadi ${user.kandangCapacity} hewan!`
        } else {
            if (user.kandangLevel >= 5) {
                user.kandangProduceCooldown = Math.max(43200000, user.kandangProduceCooldown - 21600000) // Min 12 jam
                benefitText = `Cooldown produksi kandang berkurang menjadi ${Math.floor(user.kandangProduceCooldown / 3600000)} jam!`
            } else {
                user.kandangEfficiency += 0.2
                benefitText = `Efisiensi produksi kandang meningkat menjadi ${Math.floor(user.kandangEfficiency * 100)}%!`
            }
        }
        
        // terapkan biaya
        let repairMethod = ""
        if (useMaterials) {
            if (materialCost.wood) user.wood -= materialCost.wood
            user.iron -= materialCost.iron
            if (materialCost.string) user.string -= materialCost.string
            repairMethod = `Menggunakan ${Object.entries(materialCost).map(([mat, qty]) => `${qty} ${mat === "wood" ? "🪵 Wood" : mat === "iron" ? "⛓️ Iron" : "🧵 String"}`).join(", ")}`
        } else {
            user.money -= moneyCost
            repairMethod = `Menggunakan 💸 ${moneyCost} Money`
        }
        
        // peluang bonus (5% untuk +1% peluang goldenEgg)
        let bonusText = ""
        if (useMaterials && Math.random() < 0.05) {
            user.kandangEfficiency += 0.01
            bonusText = `\n✨ *Keajaiban alam!* Bahan berkualitas meningkatkan peluang Golden Egg sebesar 1%!`
        }
        
        // tingkatkan level kandang
        user.kandangLevel += 1
        
        // berikan EXP
        const expGain = useMaterials ? 100 : 60
        Func.addExp(user, expGain)
        if (user.activePet) {
            Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5))
        }
        
        // set cooldown
        user.lastKandangUpgrade = now
        
        // simpan ke database
        db.users[userId] = user
        
        // narasi acak
        const upgradeStories = {
            kapasitas: [
                `Pandai besi dan penyihir bekerja di Kandang Bintang Liar, memperluas pagar dengan 🪵 *Wood* dan ⛓️ *Iron*. Ladang kini lebih luas, siap menampung lebih banyak hewan! ${user.activePet ? `*${user.activePet.toUpperCase()}* berlarian, menguji pagar baru!` : ""}`,
                `Roh alam Arvandor menyihir Kandang Bintang Liar, memperluas ladang dengan cahaya bintang. Pagar baru berkilau, dan lebih banyak hewan bisa tinggal! ${user.activePet ? `*${user.activePet.toUpperCase()}* menggonggong gembira!` : ""}`,
                `Dengan kerja keras, kamu memperluas Kandang Bintang Liar menggunakan bahan terbaik. Ladang kini lebih besar, penuh potensi! ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat di ladang yang lebih luas!` : ""}`
            ],
            efisiensi: [
                `Penyihir alam menaburkan mantra pada Kandang Bintang Liar, menggunakan ⛓️ *Iron* dan 🧵 *String*. Hewan-hewanmu kini lebih produktif, menghasilkan lebih banyak! ${user.activePet ? `*${user.activePet.toUpperCase()}* menari di bawah cahaya mantra!` : ""}`,
                `Dengan sihir kuno dan bahan berkualitas, Kandang Bintang Liar menjadi lebih efisien. Produk mengalir lebih cepat, dan ladang bersinar! ${user.activePet ? `*${user.activePet.toUpperCase()}* mengawasi dengan bangga!` : ""}`,
                `Kamu memperkuat Kandang Bintang Liar dengan bahan magis. Hewan-hewanmu bersorak, siap menghasilkan lebih banyak produk! ${user.activePet ? `*${user.activePet.toUpperCase()}* berlari bersama hewan lain!` : ""}`
            ]
        }
        
        const story = upgradeStories[typeInput][Math.floor(Math.random() * upgradeStories[typeInput].length)]
        let replyText = `🌾 *Kandang Ditingkatkan!*\n\n`
        replyText += `${story.trim()}\n\n`
        replyText += `🎁 Hasil:\n`
        replyText += `   ▢ ${benefitText}\n`
        replyText += `   ▢ Level Kandang: ${user.kandangLevel}\n`
        replyText += `   ▢ ${expGain} EXP\n`
        if (user.activePet) replyText += `   ▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP\n`
        replyText += `\n💵 Biaya: ${repairMethod}`
        replyText += bonusText
        
        m.reply(replyText)
    }
})