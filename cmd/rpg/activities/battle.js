commands.add({
    name: ["battle"],
    command: ["battle"],
    category: "rpg",
    register: true,
    desc: "Menguji keberanian di Arena Bayang-Bayang Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        const now = Date.now()
        if (user.health < 30) {
            return m.reply("[ ❤️ ] Tubuhmu terlalu lemah untuk bertarung di Arena Bayang-Bayang!\n\n> Ketik *.heal* untuk memulihkan diri kamu !!")
        }
        if (user.lastbattle && now < user.lastbattle + 1800000) { // setengah jam y
            const timeLeft = Func.clockString(user.lastbattle + 1800000 - now)
            return m.reply(`[ ⚔️ ] Kamu masih kelelahan dari pertarungan sebelumnya!\n\nTimeout : [ *${timeLeft}* ]`)
        }
        const monsters = [
            {
                name: "Serigala Bayangan",
                difficulty: 1,
                health: 50,
                attack: 15,
                stories: {
                    start: [
                        "Kamu melangkah ke Arena Bayang-Bayang, kabut hitam menyelimuti kakimu. Tiba-tiba, mata merah menyala *Serigala Bayangan* menggeram di depanmu!",
                        "Di bawah langit kelabu, *Serigala Bayangan* melompat dari kegelapan Arena Bayang-Bayang, cakarnya berkilau tajam!"
                    ],
                    mid: [
    `${user.sword > 0 ? "Pedangmu berkilau, menebas bulu serigala itu!" : user.bow > 0 ? "Panahmu melesat, mengenai sisi serigala!" : user.magicWand > 0 ? "Sihirmu menyala, membakar bulu serigala!" : "Tinju dan keberanianmu menahan serangan serigala!"} ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat, mengalihkan perhatian monster itu!` : ""}`,
    `${"Cakar serigala menggores udara, tapi kamu bertahan!"} ${user.armor > 0 ? "*Armor* melindungimu dari luka parah!" : "Kamu menghindar dengan susah payah!"}`
                    ],
                    win: [
                        "Dengan pukulan terakhir, *Serigala Bayangan* ambruk, matanya memudar. Arena bergemuruh, dan harta menantimu!",
                        "Serigala itu meraung sebelum jatuh. Kamu berdiri di Arena Bayang-Bayang, pemenang yang tak terkalahkan!"
                    ],
                    lose: [
                        "*Serigala Bayangan* mengaum, cakarnya terlalu cepat! Kamu terhuyung, arena memudar dalam kabut, dan luka-lukamu berbicara...",
                        "Kegelapan menelanmu saat serigala menyerang. Arena Bayang-Bayang tertawa, tapi semangatmu belum padam!"
                    ]
                }
            },
            {
                name: "Golem Batu",
                difficulty: 2,
                health: 80,
                attack: 25,
                stories: {
                    start: [
                        "Arena Bayang-Bayang berguncang saat *Golem Batu* bangkit dari tanah, matanya menyala seperti bara api!",
                        "Batu-batu di arena menyatu, membentuk *Golem Batu* yang menjulang. Tinjunya siap menghancurkanmu!"
                    ],
                    mid: [
    `${user.sword > 0 ? "Pedangmu memercik saat menghantam batu golem!" : user.bow > 0 ? "Panahmu memantul, tapi mengalihkan perhatian golem!" : user.magicWand > 0 ? "Sihirmu meretakkan batu golem!" : "Kamu menghindar dari pukulan golem dengan napas tersengal!"} ${user.activePet ? `*${user.activePet.toUpperCase()}* berlari, mengacaukannya!"` : ""}`,
    `${"Pukulan golem mengguncang arena!"} ${user.armor > 0 ? "*Armor* menahan hantaman maut itu!" : "Kamu terlempar, luka-luka menghias tubuhmu!"}`
                    ],
                    win: [
                        "*Golem Batu* runtuh menjadi debu, arena bergemuruh merayakan kemenanganmu. Harta besar menantimu!",
                        "Dengan serangan terakhir, golem itu hancur. Kamu berdiri sebagai pahlawan di Arena Bayang-Bayang!"
                    ],
                    lose: [
                        "Tinju golem menghantam keras, dan arena memudar dalam debu. Kamu kalah, tapi api petualangan masih menyala!",
                        "*Golem Batu* menghancurkan pertahananmu. Arena tertawa, tapi kamu akan bangkit lagi!"
                    ]
                }
            },
            {
                name: "Naga Api",
                difficulty: 3,
                health: 120,
                attack: 40,
                stories: {
                    start: [
                        "Langit arena menyala merah saat *Naga Api* mendarat, sayapnya mengguncang bumi. Api menyembur dari mulutnya!",
                        "Dari kegelapan Arena Bayang-Bayang, *Naga Api* muncul, sisiknya berkilau seperti lava cair!"
                    ],
                    mid: [
    `${user.sword > 0 ? "Pedangmu menari, mencoba menembus sisik naga!" : user.bow > 0 ? "Panahmu melesat, mengenai sayap naga!" : user.magicWand > 0 ? "Sihirmu bertabrakan dengan api naga, menciptakan ledakan cahaya!" : "Kamu menghindar dari semburan api dengan jantungan berdetak!"} ${user.activePet ? `*${user.activePet.toUpperCase()}* mengaum, menantang naga itu!` : ""}`,
    `${"Api naga membakar arena!"} ${user.armor > 0 ? "*Armor* melindungimu dari kobaran maut!" : "Kamu terbakar, luka-lukamu membara!"}`
                    ],
                    win: [
                        "*Naga Api* meraung terakhir sebelum ambruk. Arena Bayang-Bayang bersorak, dan harta legendaris menjadi milikmu!",
                        "Dengan keberanian tak tergoyahkan, kamu menaklukkan *Naga Api*. Kamu adalah legenda Arena Bayang-Bayang!"
                    ],
                    lose: [
                        "Api naga menelammu, dan arena memudar dalam kobaran. Kamu kalah, tapi semangatmu akan membawamu kembali!",
                        "*Naga Api* menghancurkanmu dengan semburannya. Arena tertawa, tapi kisahmu belum selesai!"
                    ]
                }
            }
        ]        
        const monster = monsters[Math.floor(Math.random() * monsters.length)]
        // hitung peluang menang
        let baseWinChance = 0.7 - monster.difficulty * 0.15 // 70% untuk Serigala, 55% untuk Golem, 40% untuk Naga
        if (user.sword > 0) baseWinChance += 0.1 // sword meningkatkan peluang
        if (user.bow > 0) baseWinChance += 0.05 // bow sedikit membantu
        if (user.magicWand > 0) baseWinChance += 0.15 // MagicWand sangat efektif
        if (user.armor > 0) baseWinChance += 0.05 // armor meningkatkan ketahanan
        if (user.activePet === "dog") baseWinChance += 0.05 + user.dogLevel * 0.02 // dog tambah serangan
        if (user.activePet === "cat") baseWinChance += 0.05 + user.catLevel * 0.02 // cat kurangi risiko
        const success = Math.random() < baseWinChance        
        // inisialisasi risiko dan hadiah
        let healthLoss = Math.floor(Math.random() * (monster.attack - 10)) + 10
        if (user.armor > 0) healthLoss = Math.floor(healthLoss * 0.7) // armor kurangi kerusakan
        if (user.activePet === "cat") healthLoss = Math.floor(healthLoss * 0.8) // cat kurangi kerusakan
        let expGain = Math.floor(Math.random() * 100) + monster.difficulty * 100
        let moneyGain = Math.floor(Math.random() * 500) + monster.difficulty * 500
        let materialGain = Math.random() < 0.5 ? Math.floor(Math.random() * 3) + 1 : 0
        let potionGain = Math.random() < 0.3 ? 1 : 0
        let rareCrateGain = monster.difficulty === 3 && Math.random() < 0.1 ? 1 : 0        
        // kurangi durabilitas senjata/armor
        let durabilityLoss = success ? 5 : 10
        if (user.sword > 0) {
            user.sworddurability -= durabilityLoss
            if (user.sworddurability <= 0) {
                user.sword -= 1
                user.sworddurability = 0
            }
        }
        if (user.bow > 0) {
            user.bowdurability -= durabilityLoss
            if (user.bowdurability <= 0) {
                user.bow -= 1
                user.bowdurability = 0
            }
        }
        if (user.magicWand > 0) {
            user.magicWanddurability -= durabilityLoss
            if (user.magicWanddurability <= 0) {
                user.magicWand -= 1
                user.magicWanddurability = 0
            }
        }
        if (user.armor > 0) {
            user.armordurability -= durabilityLoss
            if (user.armordurability <= 0) {
                user.armor -= 1
                user.armordurability = 0
            }
        }        
        // terapkan hasil pertarungan
        if (success) {
            user.health -= healthLoss
            if (user.health < 0) user.health = 0
            Func.addExp(user, expGain)
            user.money += moneyGain
            user.iron += materialGain
            user.potion += potionGain
            user.rare += rareCrateGain
            user.battleWins = (user.battleWins || 0) + 1
            if (user.activePet) {
                Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5))
            }
        } else {
            user.health -= Math.floor(healthLoss * 1.5)
            if (user.health < 0) user.health = 0
            expGain = Math.floor(expGain * 0.3)
            Func.addExp(user, expGain)
            if (user.activePet) {
                Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5))
            }
        }        
        // set cooldown
        user.lastbattle = now        
        // simpan ke database
        db.users[userId] = user        
        // kirim narasi bertahap
        setTimeout(() => {
            const replyText = success ?
                `⚔️ *KEMENANGAN!!*\n\n` +
                `${monster.stories.win[Math.floor(Math.random() * monster.stories.win.length)].trim()}\n\n` +
                `*HADIAH:*\n` +
                `▢ ${expGain} EXP\n` +
                `▢ +${Func.formatUang(moneyGain)}\n` +
                (materialGain > 0 ? `▢ Iron: ${materialGain}\n` : "") +
                (potionGain > 0 ? `▢ Potion: ${potionGain}\n` : "") +
                (rareCrateGain > 0 ? `▢ Rare Crate: ${rareCrateGain}\n` : "") +
                (user.activePet ? `▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP\n` : "") +
                `\n*RISIKO:*\n` +
                `▢ Kehilangan ${healthLoss} HP (Sisa: ${user.health}/100)\n` +
                (user.health === 0 ? `\n⚠️ Tubuhmu ambruk di arena!\n\n> Segera pulihkan dengan !heal` : "") :
                `⚔️ *KEKALAHAN!!*\n\n` +
                `${monster.stories.lose[Math.floor(Math.random() * monster.stories.lose.length)]}\n\n` +
                `*HADIAH:*\n` +
                `▢ ${expGain} EXP\n` +
                (user.activePet ? `▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP\n` : "") +
                `\n*RISIKO:*\n` +
                `▢ Kehilangan ${Math.floor(healthLoss * 1.5)} HP (Sisa: ${user.health}/100)\n` +
                (user.health === 0 ? `\n⚠️ Tubuhmu ambruk di arena!\n\n> Segera pulihkan dengan !heal` : "")            
            m.reply(replyText, {
                contextInfo: {
                    externalAdReply: {
                        thumbnailUrl: "https://i.pinimg.com/originals/92/aa/84/92aa84374e0a4b86f6c206d5d321c7e1.jpg",
                        mediaUrl: "https://i.pinimg.com/originals/92/aa/84/92aa84374e0a4b86f6c206d5d321c7e1.jpg",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        previewType: "PHOTO",
                        sourceUrl: config.github,
                    }
                }
            })
        }, 20000)
        setTimeout(() => {
            m.reply(monster.stories.mid[Math.floor(Math.random() * monster.stories.mid.length)])
        }, 15000)
        setTimeout(() => {
            m.reply(monster.stories.start[Math.floor(Math.random() * monster.stories.start.length)])
        }, 7500)
        setTimeout(() => {
            m.reply(`⚔️ *Memulai Pertarungan melawan ${monster.name}*${user.activePet ? ` bersama *${user.activePet.toUpperCase()}*!` : "!"}`)
        }, 0)
    }
})