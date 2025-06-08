import fs from "fs"

commands.add({
    name: ["hunting"],
    command: ["hunting"],
    category: "rpg",
    desc: "Menyusuri Lembah Arvandor untuk berburu hewan liar dan meraih hadiah legendaris",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]        
        // cek HP minimum
        if (user.health < 20) {
            return m.reply("❤️ Tubuhmu terlalu lemah untuk berburu di alam liar Arvandor!\n\n> Ketik *.heal* untuk memulihkan hp")
        }        
        // cek senjata
        if (user.sword <= 0 && user.bow <= 0 && user.magicWand <= 0) {
            return m.reply("❌ Kamu membutuhkan senjata untuk berburu!\n\n> Dapatkan *sword*, *bow*, atau *magicWand* dengan !craft")
        }        
        // cek cooldown (10 menit = 600000 ms)
        const now = Date.now()
        const cooldown = 600000
        if (user.lasthunt && now < user.lasthunt + cooldown) {
            const timeLeft = Func.clockString(user.lasthunt + cooldown - now)
            return m.reply(`🌿 Kakimu masih lelah dari perburuan sebelumnya!\n\nTimeout : [ *${timeLeft}* ]`)
        }        
        // pilih lokasi berburu acak
        const locations = [
            {
                name: "Hutan Liar",
                animals: ["kambing", "monyet", "ayam", "domba"],
                material: "string",
                materialChance: 0.7,
                stories: {
                    start: [
                        "Kamu melangkah ke Hutan Liar, dedaunan berderit di bawah kakimu. Angin berbisik, membawa aroma petualangan dan bahaya...",
                        "Di Hutan Liar, kabut pagi menyelimuti pohon-pohon kuno. Kamu menyiapkan senjata, mendengar suara hewan di kejauhan..."
                    ],
                    mid: [
                        "Tiba-tiba, segerombolan hewan liar muncul dari semak-semak! Kamu mengangkat senjatamu, siap memburu!",
                        "Jejak kaki hewan terlihat di tanah. Kamu mengendap-endap, mendengar suara decit dan langkah cepat di dekatmu..."
                    ],
                    end: [
                        `${user.activePet ? `*${user.activePet.toUpperCase()}* melompat ke depan, membantu mengejar mangsa!` : ""} Dengan ketepatan luar biasa, kamu berhasil memburu hewan-hewan itu, meski luka-luka menghias tubuhmu!`,
                        "Senjatamu berkilau di bawah sinar matahari saat kamu menaklukkan mangsa. Namun, alam liar meninggalkan bekas di tubuhmu!"
                    ]
                }
            },
            {
                name: "Savana Emas",
                animals: ["sapi", "banteng", "kerbau", "horse"],
                material: "iron",
                materialChance: 0.6,
                stories: {
                    start: [
                        "Kamu memasuki Savana Emas, padang rumput luas membentang di hadapanmu. Angin panas membawa debu dan aroma hewan besar...",
                        "Di Savana Emas, matahari membakar kulitmu. Kamu menyiapkan senjata, melihat bayang-bayang hewan besar di cakrawala..."
                    ],
                    mid: [
                        "Sekawanan hewan besar berlari di depanmu! Kamu mengejar, senjata di tangan, siap untuk memburu!",
                        "Debu beterbangan saat kamu mendekati mangsa di Savana Emas. Jantunganmu berdetak kencang, siap bertindak..."
                    ],
                    end: [
                        `${user.activePet ? `*${user.activePet.toUpperCase()}* berlari di sampingmu, mengalihkan perhatian mangsa!` : ""} Dengan tenaga penuh, kamu menumbangkan hewan-hewan itu, tapi savana meninggalkan luka di tubuhmu!`,
                        "Keringat menetes saat kamu mengalahkan mangsa. Savana Emas memberi hadiah, tapi juga mengambil tolakannya!"
                    ]
                }
            },
            {
                name: "Rawa Kematian",
                animals: ["buaya", "harimau", "gajah", "panda"],
                material: "diamond",
                materialChance: 0.3,
                stories: {
                    start: [
                        "Kamu melangkah ke Rawa Kematian, air keruh menggenang di kakimu. Bau lumpur dan bahaya memenuhi udara...",
                        "Di Rawa Kematian, kabut tebal menyembunyikan ancaman. Kamu memegang senjata erat, mendengar suara geraman di kejauhan..."
                    ],
                    mid: [
                        "Sesuatu bergerak di air rawa! Kamu melihat mata menyala, dan hewan liar muncul, siap kamu buru!",
                        "Lumpur menghisap kakimu, tapi kamu melihat mangsa di depan. Dengan hati-hati, kamu menyiapkan serangan..."
                    ],
                    end: [
                        `${user.activePet ? `*${user.activePet.toUpperCase()}* mengaum, mengalihkan perhatian musuh!` : ""} Kamu menaklukkan hewan-hewan rawa dengan susah payah, tapi luka-luka menghiasi tubuhmu!`,
                        "Dengan nafas terengah, kamu mengalahkan mangsa di Rawa Kematian. Hadiah besar menanti, tapi rawa mengambil harganya!"
                    ]
                }
            }
        ]        
        const location = locations[Math.floor(Math.random() * locations.length)]        
        // inisialisasi reward dan risiko
        let success = Math.random() > (user.activePet === "cat" ? 0.15 - user.catLevel * 0.02 : 0.2) // 80% sukses, cat meningkatkan
        let healthLoss = Math.floor(Math.random() * 31) + 10
        if (user.activePet === "cat") healthLoss = Math.floor(healthLoss * 0.8) // cat kurangi kerusakan
        let expGain = Math.floor(Math.random() * 100) + 50
        let materialGain = Math.random() < location.materialChance ? Math.floor(Math.random() * 3) + 1 : 0
        let diamondGain = location.material === "diamond" && Math.random() < 0.1 ? 1 : 0
        if (user.magicWand > 0) diamondGain = Math.random() < 0.15 ? 1 : 0 // magicwand tingkatkan peluang diamond
        let commonCrateGain = Math.random() < 0.05 ? 1 : 0        
        // hitung hewan yang diburu
        const animalRewards = {}
        for (let animal of location.animals) {
            let amount = Math.floor(Math.random() * 4) + 1
            if (user.activePet === "dog") amount = Math.floor(amount * (1 + user.dogLevel * 0.1)) // dog tingkatkan jumlah
            if ((animal === "gajah" || animal === "banteng") && user.sword > 0) amount = Math.floor(amount * 1.2) // sword efektif
            if ((animal === "ayam" || animal === "monyet") && user.bow > 0) amount = Math.floor(amount * 1.2) // bow efektif
            animalRewards[animal] = amount
        }        
        // pilih senjata dan kurangi durabilitas
        let weaponUsed = ""
        let durabilityLoss = success ? 5 : 10
        if (user.sword > 0) {
            user.sworddurability -= durabilityLoss
            weaponUsed = `⚔️ Kamu menggunakan *Wooden Sword*, menebas mangsa dengan kekuatan penuh!`
            if (user.sworddurability <= 0) {
                user.sword -= 1
                user.sworddurability = 0
                weaponUsed += ` Namun, pedangmu patah!`
            }
        } else if (user.bow > 0) {
            user.bowdurability -= durabilityLoss
            weaponUsed = `🏹 Kamu menggunakan *Bow*, menembak mangsa dengan ketepatan mematikan!`
            if (user.bowdurability <= 0) {
                user.bow -= 1
                user.bowdurability = 0
                weaponUsed += ` Namun, busurmu rusak!`
            }
        } else if (user.magicWand > 0) {
            user.magicWanddurability -= durabilityLoss
            weaponUsed = `🪄 Kamu menggunakan *Magic Wand*, menyihir mangsa dengan kekuatan mistis!`
            if (user.magicWanddurability <= 0) {
                user.magicWand -= 1
                user.magicWanddurability = 0
                weaponUsed += ` Namun, tongkat sihirmu kehilangan kekuatannya!`
            }
        }        
        // terapkan reward dan risiko
        if (success) {
            user.health -= healthLoss
            if (user.health < 0) user.health = 0
            Func.addExp(user, expGain)
            for (let [animal, amount] of Object.entries(animalRewards)) {
                user[animal] += amount
            }
            user[location.material] += materialGain
            user.diamond += diamondGain
            user.common += commonCrateGain
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
        user.lasthunt = now        
        // simpan ke database
        db.users[userId] = user        
        // kirim narasi bertahap
        setTimeout(() => {
            const replyText = success ? 
                `🌿 *Perburuan di ${location.name}*\n\n` +
                `${location.stories.end[Math.floor(Math.random() * location.stories.end.length)].trim()}\n\n` +
                `🎁 *Hasil Buruan:*\n` +
                Object.entries(animalRewards).map(([animal, amount]) => `  ▢ *${animal}*: ${amount}`).join("\n") + "\n" +
                (materialGain > 0 ? `  ▢ *${location.material}*: ${materialGain}\n` : "") +
                (diamondGain > 0 ? `  ▢ *diamond*: ${diamondGain}\n` : "") +
                (commonCrateGain > 0 ? `  ▢ *common crate*: ${commonCrateGain}\n` : "") +
                `\n💥 *Risiko:*\n` +
                `  ▢ Kehilangan ${healthLoss} HP (Sisa: ${user.health}/100)\n` +
                `  ▢ ${expGain} EXP\n` +
                (user.activePet ? `  ▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP\n` : "") +
                `\n${weaponUsed}` +
                (user.health === 0 ? `\n⚠️ Tubuhmu ambruk di alam liar! Segera pulihkan dengan !heal` : "") +
                `\n\n> Gunakan *.sell* untuk menjual hasil buruanmu`
                :
                `🌿 *Perburuan Gagal di ${location.name}*\n\n` +
                `Alam liar terlalu ganas! ${user.activePet ? `*${user.activePet.toUpperCase()}* mencoba membantu, tapi` : ""} mangsa lolos, dan kamu terluka parah dalam perjuangan!\n\n` +
                `💥 *Risiko:*\n` +
                `  ▢ Kehilangan ${Math.floor(healthLoss * 1.5)} HP (Sisa: ${user.health}/100)\n` +
                `  ▢ ${expGain} EXP\n` +
                (user.activePet ? `  ▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP\n` : "") +
                `\n${weaponUsed}` +
                (user.health === 0 ? `\n⚠️ Tubuhmu ambruk di alam liar! Segera pulihkan dengan !heal` : "")
            
            const buf = fs.readFileSync(`./lib/media/rpg/hunting.jpg`)
            m.reply(replyText, {
                contextInfo: {
                    externalAdReply: {
                        title: success ? "Perburuan Legendaris!" : "Perburuan Gagal",
                        thumbnail: buf,
                        renderLargerThumbnail: true,
                        mediaType: 1,
                        previewType: "PHOTO",
                        mediaUrl: config.github,
                        sourceUrl: config.github
                    }
                }
            })
        }, 20000)
        setTimeout(() => {
            m.reply(location.stories.mid[Math.floor(Math.random() * location.stories.mid.length)])
        }, 15000)
        setTimeout(() => {
            m.reply(location.stories.start[Math.floor(Math.random() * location.stories.start.length)])
        }, 7500)
        setTimeout(() => {
            m.reply(`🏹 *Memulai Perburuan di ${location.name}*${user.activePet ? ` bersama *${user.activePet.toUpperCase()}*!` : "!"}`)
        }, 0)
    }
})