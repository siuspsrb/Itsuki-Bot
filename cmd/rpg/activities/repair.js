commands.add({
    name: ["repair"],
    command: ["repair"],
    param: "<weapon>",
    category: "rpg",
    register: true,
    desc: "Memperbaiki senjata dan armor di Bengkel Cahaya Bintang",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        const now = Date.now()        
        if (!args[0]) return m.reply("Apa yang ingin kamu perbaiki?\n\n> *Contoh:* !repair sword")        
        const itemInput = args[0].toLowerCase()
        const repairableItems = [
            { name: "sword", emoji: "⚔️", field: "sword", durabilityField: "sworddurability", maxDurability: 100, moneyCost: 500 },
            { name: "bow", emoji: "🏹", field: "bow", durabilityField: "bowdurability", maxDurability: 100, moneyCost: 400 },
            { name: "magicWand", emoji: "🪄", field: "magicWand", durabilityField: "magicWanddurability", maxDurability: 100, moneyCost: 600 },
            { name: "armor", emoji: "🛡️", field: "armor", durabilityField: "armordurability", maxDurability: 100, moneyCost: 700 }
        ]        
        const item = repairableItems.find(i => i.name.toLowerCase() === itemInput)
        if (!item) return m.reply("Item tidak bisa diperbaiki!\n\n> Daftar item: sword, bow, magicWand, armor") 
        // cek apakah pengguna punya item
        if (user[item.field] < 1) {
            return m.reply(`Kamu tidak punya ${item.emoji} *${item.name}*! Craft dulu dengan !craft`)
        }        
        // cek apakah durabilitas penuh
        if (user[item.durabilityField] >= item.maxDurability) {
            return m.reply(`${item.emoji} *${item.name}* milikmu masih dalam kondisi sempurna!`)
        }        
        // cek cooldown (5 menit = 300000 ms)
        if (user.lastrepair && now < user.lastrepair + 300000) {
            const timeLeft = Func.clockString(user.lastrepair + 300000 - now)
            return m.reply(`🔨 Bengkel masih sibuk dengan pesananmu! Tunggu *${timeLeft}* lagi`)
        }        
        // hitung biaya
        const materialCost = getRepairMaterials(item.name)
        const moneyCost = getDynamicPrice(item.moneyCost, user.level)
        const useMaterials = user.iron >= materialCost.iron && user.wood >= (materialCost.wood || 0) && user.string >= (materialCost.string || 0)
        
        if (!useMaterials && user.money < moneyCost) {
            let materialText = Object.entries(materialCost)
                .map(([mat, qty]) => `${mat === "iron" ? "⛓️ Iron" : mat === "wood" ? "🪵 Wood" : "🧵 String"}: ${qty}`)
                .join(", ")
            return m.reply(`Kamu tidak punya cukup bahan atau koin!\nPerlu: ${materialText} atau 💸 ${moneyCost} Money\nKamu punya: ⛓️ ${user.iron}, 🪵 ${user.wood}, 🧵 ${user.string}, 💸 ${Func.formatUang(user.money)}`)
        }        
        // narasi acak untuk perbaikan
        const repairStories = {
            sword: [
                "Pandai besi di Bengkel Cahaya Bintang menempa ⚔️ *Sword* milikmu dengan api bintang. Percikan beterbangan, dan pedangmu kini berkilau seperti baru!",
                "Seorang pengrajin legendaris memeriksa ⚔️ *Sword* milikmu. Dengan palu dan mantra, pedang itu kembali tajam, siap menebas monster!",
                "Di bawah cahaya bulan, pandai besi menyempurnakan ⚔️ *Sword* milikmu. 'Ini akan memotong bayangan!' katanya, menyerahkan pedang yang berkilau!"
            ],
            bow: [
                "Pembuat busur di bengkel meregangkan 🏹 *Bow* milikmu dengan 🧵 *String* baru. Busur itu kini siap melesatkan panah ke jantung musuh!",
                "Seorang pengrajin hutan memoles 🏹 *Bow* milikmu dengan 🪵 *Wood* segar. 'Panahmu akan terbang sejauh bintang!' katanya!",
                "Di kios bengkel yang harum kayu, 🏹 *Bow* milikmu diperbaiki dengan tali dan kayu terbaik. Busur itu kini terasa hidup di tanganmu!"
            ],
            magicWand: [
                "Penyihir di Bengkel Cahaya Bintang menyihir 🪄 *MagicWand* milikmu dengan mantra kuno. Tongkat itu kini menyala, penuh kekuatan magis!",
                "Seorang alkemis memadukan 🧵 *String* dan ⛓️ *Iron* untuk memperbaiki 🪄 *MagicWand* milikmu. 'Sihirmu akan mengguncang langit!' katanya!",
                "Di sudut bengkel yang penuh kabut, penyihir memulihkan 🪄 *MagicWand* milikmu. Cahaya bintang menyatu, dan tongkat itu siap lagi!"
            ],
            armor: [
                "Pandai besi raksasa menempa 🛡️ *Armor* milikmu dengan ⛓️ *Iron* dan 🧵 *String*. Armor itu kini kokoh, siap menahan pukulan naga!",
                "Pengrajin armor di bengkel memoles 🛡️ *Armor* milikmu hingga berkilau. 'Ini akan melindungimu dari kematian!' katanya!",
                "Di bawah lampu bengkel, 🛡️ *Armor* milikmu diperbaiki dengan bahan terbaik. Kini, kamu siap menghadapi badai di Arena Bayang-Bayang!"
            ]
        }        
        // proses perbaikan
        let repairMethod = ""
        if (useMaterials) {
            user.iron -= materialCost.iron
            if (materialCost.wood) user.wood -= materialCost.wood
            if (materialCost.string) user.string -= materialCost.string
            repairMethod = `Menggunakan ${Object.entries(materialCost).map(([mat, qty]) => `${qty} ${mat === "iron" ? "⛓️ Iron" : mat === "wood" ? "🪵 Wood" : "🧵 String"}`).join(", ")}`
        } else {
            user.money -= moneyCost
            repairMethod = `*$${Func.formatUang(moneyCost)}*`
        }       
        // pulihkan durabilitas
        user[item.durabilityfield] = item.maxDurability
        // peluang upgrade (5% untuk +10 maxDurability)
        let upgradeText = ""
        if (useMaterials && Math.random() < 0.05) {
            item.maxDurability += 10
            user[item.durabilityField] = item.maxDurability
            upgradeText = `\n✨ *Keajaiban terjadi!* Bahan berkualitas membuat ${item.emoji} *${item.name}* lebih kuat! Durabilitas maksimum bertambah menjadi ${item.maxDurability}!`
        }        
        // berikan EXP
        const expGain = useMaterials ? 50 : 30
        Func.addExp(user, expGain)        
        // set cooldown
        user.lastrepair = now        
        // simpan ke database
        db.users[userId] = user        
        // balasan dengan narasi
        const story = repairStories[item.name][Math.floor(Math.random() * repairStories[item.name].length)]
        let replyText = `🔨 *Perbaikan Berhasil!*\n\n`
        replyText += `${story.trim()}\n\n`
        replyText += `*🎁 Hasil:*\n`
        replyText += `  ▢ ${item.emoji} *${item.name}* durabilitas: ${user[item.durabilityField]}/${item.maxDurability}\n`
        replyText += `  ▢ ${expGain} EXP\n`
        replyText += `\n*💸 Biaya:* ${repairMethod}`
        replyText += upgradeText        
        m.reply(replyText)
    }
})

// fungsi menghitung harga dinamis
function getDynamicPrice(basePrice, userLevel) {
    const variation = Math.random() * 0.1 - 0.05 // ±5%
    return Math.floor(basePrice * (1 + variation + userLevel * 0.01))
} //hyzer stecu stecu

// fungsi menentukan biaya materials
function getRepairMaterials(item) {
    const materialCosts = {
        sword: { iron: 2, wood: 1 },
        bow: { wood: 2, string: 1 },
        magicWand: { string: 2, iron: 1 },
        armor: { iron: 3, string: 1 }
    }
    return materialCosts[item] || { iron: 1, wood: 1 }
}