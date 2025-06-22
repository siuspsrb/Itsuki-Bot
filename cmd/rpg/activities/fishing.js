commands.add({
    name: ["fish"],
    command: ["fish"],
    category: "rpg",
    register: true,
    desc: "Cast your rod into the Great Azure Expanse for epic catches",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        const groupId = m.key.remoteJid

        // inisialisasi user
        db.users[userId] = db.users[userId] || { ...defaultUser }
        const user = db.users[userId]

        // sesi fishing
        sius.fish = sius.fish || {}
        const session = sius.fish[groupId] || { active: false, lastfishing: 0 }
        sius.fish[groupId] = session

        // cek fishing rod
        if (!user.fishingrod) {
            return m.reply("*Kail pancing tidak ditemukan!*\n\n> Beli dengan *!buy fishingrod*")
        }

        // cek durability
        if (user.fishingroddurability <= 0) {
            return m.reply("*⚠️ Kail pancing rusak!*\n\n> Perbaiki dengan *!repair fishingrod* seharga 2000 money!")
        }

        // cek cooldown (10 menit, vip skip)
        const cooldown = user.vip ? 0 : 600000 // 10 min in ms
        if (Date.now() - user.lastfishing < cooldown) {
            const remaining = Math.ceil((cooldown - (Date.now() - user.lastfishing)) / 60000)
            return m.reply(`*⚠️ Kail masih basah!* \n\n> Tunggu selama *${remaining}* menit atau jadi VIP untuk skip cooldown!`)
        }

        // sub-command: fish, buy, repair, upgrade
        if (args[0]?.toLowerCase() === "buy") {
            if (user.fishingrod) return m.reply("*⚠️ Kamu sudah punya kail pancing!*")
            if (user.money < 5000) return m.reply("* ⚠️ Uang tidak cukup!* Butuh 5000 money.")
            user.money -= 5000
            user.fishingrod = 1
            user.fishingrodlevel = 1
            user.fishingroddurability = 100
            user.fishingrodmaxdurability = 100
            return m.reply("*Kail pancing dibeli!* 🎣 Siap menaklukkan Great Azure Expanse!", {
                externalAdReply: {
                    title: "Kail Pancing Baru!",
                    body: "Petualangan laut dimulai!",
                    thumbnailUrl: "https://i.pinimg.com/originals/bd/ca/6f/bdca6f49158cf30b6764ed6a9f8fc3ed.jpg", // fishing rod image
                    mediaType: 1,
                    sourceUrl: config.github
                }
            })
        } else if (args[0]?.toLowerCase() === "repair") {
            if (user.fishingroddurability >= user.fishingrodmaxdurability) return m.reply("*Kail pancing masih utuh!*")
            if (user.money < 2000) return m.reply("*⚠️ Uang tidak cukup!* Butuh 2000 money.")
            user.money -= 2000
            user.fishingroddurability = user.fishingrodmaxdurability
            return m.reply("*Kail pancing diperbaiki!* 🎣 Siap cast lagi!", {
                externalAdReply: {
                    title: "Kail Pancing Diperbaiki!",
                    body: "Kembali ke Great Azure Expanse!",
                    thumbnailUrl: "https://i.pinimg.com/originals/bd/ca/6f/bdca6f49158cf30b6764ed6a9f8fc3ed.jpg",
                    mediaType: 1,
                    sourceUrl: config.github
                }
            })
        } else if (args[0]?.toLowerCase() === "upgrade") {
            const cost = user.fishingrodlevel * 10000 // 10k, 20k, 30k, ...
            const maxLevel = 5
            if (user.fishingrodlevel >= maxLevel) return m.reply("*⚠️ Kail pancing sudah level maksimal!*")
            if (user.money < cost) return m.reply(`▢ *Uang tidak cukup!* Butuh ${cost} money.`)
            user.money -= cost
            user.fishingrodlevel += 1
            user.fishingrodmaxdurability += 50 // +50 per level
            user.fishingroddurability = user.fishingrodmaxdurability
            return m.reply(`*Kail pancing diupgrade ke level ${user.fishingrodlevel}!* 🎣 Durability: ${user.fishingrodmaxdurability}, peluang ikan langka naik!`, {
                externalAdReply: {
                    title: `Kail Level ${user.fishingrodlevel}!`,
                    body: "Menaklukkan laut lebih mudah!",
                    thumbnailUrl: "https://i.pinimg.com/originals/bd/ca/6f/bdca6f49158cf30b6764ed6a9f8fc3ed.jpg",
                    mediaType: 1,
                    sourceUrl: config.github
                }
            })
        }

        // fishing logic
        const rodLevel = user.fishingrodlevel
        const durabilityCost = Math.max(1, 5 - rodLevel) // 5 at level 1, 1 at level 5
        user.fishingroddurability -= durabilityCost
        user.lastfishing = Date.now()

        // hitung peluang berdasarkan rod level dan user level
        const baseChance = 0.3 + (rodLevel * 0.1) + (user.level * 0.01) // 30% + 10% per rod level + 1% per user level
        const rand = Math.random()
        let catchType, catchName, moneyReward, expReward, narrative

        // daftar ikan dan relic
        const catches = [
            { type: "trash", name: "Sampah Laut", chance: 0.4, money: 50, exp: 10 },
            { type: "common", name: "Crimson Snapper", chance: 0.3, money: 200, exp: 50 },
            { type: "uncommon", name: "Sapphire Tuna", chance: 0.2, money: 500, exp: 100 },
            { type: "mythic", name: "Abyssal Kraken", chance: 0.08, money: 2000, exp: 300 },
            { type: "legendary", name: "Leviathan Serpent", chance: 0.02, money: 5000, exp: 1000 },
            { type: "relic", name: "Mermaid Scale", chance: 0.01, money: 10000, exp: 2000 }
        ]

        // event acak (10% peluang)
        const eventRoll = Math.random()
        let eventMod = 1
        let eventText = ""
        if (eventRoll < 0.05) {
            eventMod = 0.5 // storm surge: harder but better rewards
            eventText = "🌩️ *Storm Surge!* Ombak mengamuk, ikan sulit ditangkap tapi hadiah berlipat!"
        } else if (eventRoll < 0.1) {
            eventMod = 2 // mermaid's blessing: easier catches
            eventText = "🧜‍♀️ *Mermaid’s Blessing!* Laut tenang, ikan langka mendekat!"
        }

        // tentukan hasil tangkapan
        let cumulativeChance = 0
        for (const c of catches) {
            cumulativeChance += c.chance * eventMod
            if (rand * baseChance < cumulativeChance) {
                catchType = c.type
                catchName = c.name
                moneyReward = c.money
                expReward = c.exp
                break
            }
        }
        if (!catchType) {
            catchType = "trash"
            catchName = "Sampah Laut"
            moneyReward = 50
            expReward = 10
        }

        // narasi berdasarkan tangkapan
        const narratives = {
            trash: "🎣 Kamu melempar kail ke Great Azure Expanse... tapi hanya sampah laut yang tersangkut! 😖 Coba lagi, angler!",
            common: "🎣 Kailmu bergetar hebat! 🌊 Seekor *Crimson Snapper* melompat dari air, sisiknya memantul sinar matahari! Keren!",
            uncommon: "🎣 Ombak bergoyang, kailmu ditarik kuat! 🐟 *Sapphire Tuna* yang berkilau muncul, tangkapan langka!",
            mythic: "🎣 Laut bergemuruh, kailmu nyaris patah! 🦑 *Abyssal Kraken* raksasa tertangkap, legenda laut milikmu!",
            legendary: "🎣 Langit menyala, laut terbelah! 🐉 *Leviathan Serpent* melilit kailmu, makhluk mitos kini di tanganmu!",
            relic: "🎣 Cahaya misterius dari dasar laut! 💎 Kamu menarik *Mermaid Scale*, relik kuno yang berbisik tentang rahasia lautan!"
        }
        narrative = eventText ? `${eventText}\n${narratives[catchType]}` : narratives[catchType]

        // update database
        user[catchType] = (user[catchType] || 0) + 1
        user.money += moneyReward
        user.exp += expReward
        user.totalFishCaught = (user.totalFishCaught || 0) + (catchType !== "trash" ? 1 : 0)
        if (catchType === "relic") {
            user.inventory = user.inventory || {}
            user.inventory[catchName] = (user.inventory[catchName] || 0) + 1
        }

        // simpan sesi
        sius.fish[groupId] = session

        // kirim hasil
        let resultText = `*FISHING QUEST* 🌊\n\n${narrative}\n\n`
        resultText += `🎁 *Hasil Tangkapan:*\n- ${catchName}\n- ${moneyReward} money\n- ${expReward} exp\n`
        resultText += `🎣 *Kail Pancing:*\n- Level: ${user.fishingrodlevel}\n- Durability: ${user.fishingroddurability}/${user.fishingrodmaxdurability}\n`
        resultText += `\nKetik *!fish* untuk cast lagi, *!fish buy* untuk beli kail, *!fish repair* untuk perbaiki, atau *!fish upgrade* untuk tingkatkan!`
        await m.reply(resultText, {
            externalAdReply: {
                title: `Tangkapan: ${catchName}!`,
                body: `Great Azure Expanse - Level ${user.fishingrodlevel}`,
                thumbnailUrl: `https://i.pinimg.com/originals/${catchType === "trash" ? "2c/7c/6e/2c7c6e8d5b3b6e1e8e5b1c2e9d4f5a1" : catchType === "relic" ? "5a/3b/2c/5a3b2c8e9f4d7b6a1c2e3d4f5a6b7c8" : "3d/4e/5f/3d4e5f6a7b8c9d0e1f2g3h4i5j6"}.jpg`, // placeholder, ganti per catch type kalau ada URL
                mediaType: 1,
                sourceUrl: config.github
            }
        })
    }
})