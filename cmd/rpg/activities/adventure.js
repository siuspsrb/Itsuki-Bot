import fs from "fs"

commands.add({
    name: ["adventure"],
    command: ["adventure"],
    category: "rpg",
    register: true,
    desc: "Jelajahi Lembah Arvandor untuk mencari harta dan petualangan epik",
    run: async({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        // cek hp minimum
        if (user.health < 30) {
            return m.reply("[❤️] Tubuhmu terlalu lemah untuk menjelajah Lembah Arvandor!\n\n> Ketik *.heal* untuk memulihkan hp!")
        }
        // cek cooldown (1 jam = 3600000 ms)
        const now = Date.now()
        let cooldown = 3600000
        if (user.activePet === "horse" && user.horseLevel > 0) {
            cooldown = 3600000 * (0.9 / (1 + user.horseLevel * 0.05)) // kurangi cooldown berdasarkan level horse
        }
        if (user.lastadventure && now < user.lastadventure + cooldown) {
            const timeLeft = Math.ceil((user.lastadventure + cooldown - now) / 1000 / 60)
            return m.reply(`⚠️ Kamu masih kelelahan dari petualangan sebelumnya! Istirahat dulu dalam beberapa saat!\n\nTimeout : [ *${timeLeft} minutes* ]`)
        }        
        // inisialisasi reward dan risiko
        let expGain = 0
        let moneyGain = 0
        let potionGain = 0
        let woodGain = 0
        let rockGain = 0
        let diamondGain = 0
        let commonCrateGain = 0
        let healthLoss = Math.floor(Math.random() * 21) + 10
        let itemLoss = 0
        let success = Math.random() > (user.activePet === "cat" ? 0.2 - user.catLevel * 0.02 : 0.3) // cat meningkatkan peluang sukses        
        // pilih skenario petualangan acak
        const scenarios = [
            {
                name: "Hutan Terlarang",
                story: () => {
                    const events = [
                        `Kamu menyusuri Hutan Terlarang, kabut tebal menyelimuti langkahmu. Tiba-tiba, sesosok bayangan melompat dari semak-semak! ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu melompat ke depan, mengusir makhluk itu, dan kalian menemukan sekantung koin di sarangnya!` : "Kamu bereaksi cepat, menghunus pedang dan mengusir makhluk itu, menemukan sekantung koin di sarangnya!"}`,
                        `Di dalam Hutan Terlarang, kamu menemukan pohon kuno dengan simbol aneh. ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu menggali di akarnya, menemukan peti tersembunyi penuh harta!` : "Saat menyentuhnya, cahaya hijau menyala, dan sebuah peti muncul dari akar-akarnya, berisi harta!"}`,
                        `Kamu terperangkap dalam jaring laba-laba raksasa di Hutan Terlarang! ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu membantu memotong jaring, tapi kalian terluka. Untungnya, ada beberapa barang di sarang laba-laba itu.` : "Dengan susah payah, kamu memotong jaring itu, tapi luka-lukamu cukup parah. Untungnya, kamu menemukan beberapa barang di sarang laba-laba itu."}`
                    ]
                    return events[Math.floor(Math.random() * events.length)]
                },
                rewards: () => {
                    expGain = Math.floor(Math.random() * 150) + 50
                    moneyGain = Math.floor(Math.random() * 300) + 100
                    potionGain = Math.random() > 0.6 ? 1 : 0
                    woodGain = Math.floor(Math.random() * 5) + 1
                    if (user.activePet === "dog") {
                        moneyGain *= (1 + user.dogLevel * 0.1) // dog meningkatkan uang
                    }
                }
            },
            {
                name: "Gua Kristal",
                story: () => {
                    const events = [
                        `Kamu memasuki Gua Kristal, cahaya berkilau memantul dari dinding. ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu berlari ke depan, menemukan kristal langka yang bersinar terang, tapi sebuah ledakan kecil melukaimu saat mengambilnya!` : "Di ujung gua, kamu menemukan kristal langka yang bersinar terang, tapi sebuah ledakan kecil membuatmu terluka saat mengambilnya!"}`,
                        `Di dalam Gua Kristal, kamu bertemu seorang pertapa tua. ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu menjilat tangannya, membuatnya tersenyum dan memberimu ramuan ajaib, tapi perjalanan keluar gua melelahkan.` : "Dia memberimu sebuah ramuan ajaib sebagai imbalan atas cerita petualanganmu, tapi perjalanan keluar gua membuatmu kelelahan."}`,
                        `Gua Kristal dipenuhi perangkap! ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu memperingatkanmu, tapi satu batu besar hampir menghancurkanmu. Di balik batu itu, kamu menemukan peti berisi harta!` : "Kamu berhasil menghindari beberapa, tapi satu batu besar hampir menghancurkanmu. Di balik batu itu, kamu menemukan peti berisi harta!"}`
                    ]
                    return events[Math.floor(Math.random() * events.length)]
                },
                rewards: () => {
                    expGain = Math.floor(Math.random() * 200) + 100
                    moneyGain = Math.floor(Math.random() * 200) + 50
                    diamondGain = Math.random() > (user.activePet === "fox" ? 0.7 - user.foxLevel * 0.05 : 0.8) ? 1 : 0 // fox meningkatkan peluang diamond
                    rockGain = Math.floor(Math.random() * 3) + 1
                }
            },
            {
                name: "Desa Terbengkalai",
                story: () => {
                    const events = [
                        `Kamu menjelajahi Desa Terbengkalai, rumah-rumah kosong menatapmu dengan sunyi. ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu menggonggong, memimpinmu ke gudang tua dengan peti penuh koin, tapi sesuatu di kegelapan melukaimu!` : "Di sebuah gudang tua, kamu menemukan peti penuh koin, tapi sesuatu di kegelapan membuatmu berlari dengan luka!"}`,
                        `Di Desa Terbengkalai, kamu menemukan altar kuno. ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu berputar di sekitarnya, memicu energi aneh yang memberimu pengalaman baru, tapi tubuhmu melemah.` : "Saat menyentuhnya, kamu merasakan energi aneh mengalir, memberimu pengalaman baru, tapi tubuhmu melemah."}`,
                        `Seorang bandit menyerangmu di Desa Terbengkalai! ${user.activePet ? `*${user.activePet.toUpperCase()}* milikmu membantu mengusirnya, tapi beberapa barangmu tercecer. Untungnya, bandit itu meninggalkan harta.` : "Kamu berhasil mengalahkannya, tapi beberapa barangmu tercecer dalam pertarungan. Untungnya, bandit itu meninggalkan harta."}`
                    ]
                    return events[Math.floor(Math.random() * events.length)]
                },
                rewards: () => {
                    expGain = Math.floor(Math.random() * 100) + 50
                    moneyGain = Math.floor(Math.random() * 400) + 200
                    commonCrateGain = Math.random() > 0.7 ? 1 : 0
                    itemLoss = Math.random() > 0.9 && user.potion > 0 ? 1 : 0
                }
            }
        ]
        // pilih skenario acaknya kocakkk
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
        // jalankan cerita dan reward
        const story = scenario.story()
        scenario.rewards()        
        // terapkan risiko dan reward
        if (success) {
            user.health -= healthLoss
            if (user.health < 0) user.health = 0
            Func.addExp(user, expGain)
            user.money += moneyGain
            user.potion += potionGain
            user.wood += woodGain
            user.rock += rockGain
            user.diamond += diamondGain
            user.common += commonCrateGain
            user.potion -= itemLoss
            if (user.activePet) {
                Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5)) // pet dapat EXP dari adventure
            }
        } else {
            healthLoss = Math.floor(Math.random() * 40) + 20
            user.health -= healthLoss
            if (user.health < 0) user.health = 0
            itemLoss = user.potion > 0 ? 1 : 0
            user.potion -= itemLoss
            expGain = Math.floor(expGain * 0.3)
            Func.addExp(user, expGain)
            if (user.activePet) {
                Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5))
            }
        }
        // set cooldown
        user.lastadventure = now
        // simpan ke database
        db.users[userId] = user
        // buat narasi balasan
        let replyText = `${story.trim()}\n\n`
        if (success) {
            if (user.sword > 0 || user.magicWand > 0 || user.armor > 0) {
                if (user.sword > 0) {
                    user.sworddurability -= 5
                    if (user.sworddurability <= 0) {
                        user.sword -= 1
                        user.sworddurability = 0
                    }
                }
                if (user.magicWand > 0) {
                    user.magicWanddurability -= 5
                    if (user.magicWanddurability <= 0) {
                        user.magicWand -= 1
                        user.magicWanddurability = 0
                    }
                }
                if (user.armor > 0) {
                    user.armordurability -= 3
                    if (user.armordurability <= 0) {
                        user.armor -= 1
                        user.armordurability = 0
                    }
                }
            }
            replyText += `*KEBERHASILAN!*\n`
            replyText += `▢ +${expGain} EXP 🪃\n`
            replyText += `▢ +${Func.formatUang(moneyGain)} 💰\n`
            if (potionGain > 0) replyText += `▢ +${potionGain} Potion🧪\n`
            if (woodGain > 0) replyText += `▢ +${woodGain} Wood🪵\n`
            if (rockGain > 0) replyText += `▢ +${rockGain} Rock🪨\n`
            if (diamondGain > 0) replyText += `▢ +${diamondGain} Diamond💎\n`
            if (commonCrateGain > 0) replyText += `▢ +${commonCrateGain} Common Crate🎒\n`
            if (user.activePet) {
                replyText += `▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP🪃\n`
            }
        } else {
            replyText += `*KEGAGALAN!*\n`
            replyText += `▢ +${expGain} EXP🪃\n`
            if (user.activePet) {
                replyText += `▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP🪃\n`
            }
        }
        replyText += `\n*RISIKO:*\n`
        replyText += `▢ Kehilangan ${healthLoss} HP (Sisa: ${user.health}/100)\n`
        if (itemLoss > 0) replyText += `▢ Kehilangan ${itemLoss} Potion🧪\n`
        if (user.health === 0) {
            replyText += `\n⚠️ Kakimu limbung, tubuhmu ambruk! HP habis, segera pulihkan dengan !heal`
        }
        const buf = fs.readFileSync("./lib/database/adventure.jpg")
        m.reply(replyText, {
            contextInfo: {
                externalAdReply: {
                    title: `PETUALANGAN DI ${scenario.name.toUpperCase()}`,
                    thumbnailUrl: buf,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    sourceUrl: null
                }
            }
        })
    }
})