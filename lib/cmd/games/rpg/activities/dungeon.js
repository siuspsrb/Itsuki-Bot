commands.add({
    name: ["dungeon"],
    command: ["dungeon"],
    category: "rpg",
    desc: "Menjelajahi dungeon misterius di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        db.users[userId] = user
        sius.dungeon = sius.dungeon || {}
        const now = Date.now()
        
        // Subcommand
        const action = args[0]?.toLowerCase() || "status"
        
        // Daftar monster acak
        const monsters = ["Goblin", "Wolf", "Troll", "Skeleton", "Orc"]
        
        // Cek apakah pengguna sudah di dungeon
        let dungeon = sius.dungeon[userId]
        
        // Reset dungeon jika tidak aktif > 1 jam
        if (dungeon && dungeon.lastAction && now > dungeon.lastAction + 3600000) {
            delete sius.dungeon[userId]
            dungeon = null
        }
        
        if (action === "start") {
            // Mulai dungeon
            if (dungeon) {
                return m.reply(`Kamu sudah di lantai ${dungeon.floor} dungeon!\n\n> Gunakan *!dungeon fight* untuk melawan ${dungeon.monster.name} atau *!dungeon leave* untuk keluar.`)
            }
            
            const moneyCost = 100
            const limitCost = 1
            const useLimit = user.money < moneyCost && user.limit >= limitCost
            
            if (user.money < moneyCost && !useLimit) {
                return m.reply(`Kamu perlu 💸 ${moneyCost} Money atau ⏳ ${limitCost} Limit untuk masuk dungeon! Kamu punya: 💸 ${user.money}, ⏳ ${user.limit}`)
            }
            
            if (useLimit) {
                user.limit -= limitCost
            } else {
                user.money -= moneyCost
            }
            
            sius.dungeon[userId] = {
                floor: 1,
                monster: {
                    name: monsters[Math.floor(Math.random() * monsters.length)],
                    hp: 100,
                    maxHp: 100
                },
                lastAction: now
            }
            
            const expGain = 20
            Func.addExp(user, expGain)
            
            let replyText = `🌌 *Memasuki Dungeon Lembah Arvandor!*\n\n`
            replyText += `Kamu melangkah ke kegelapan dungeon, spanduk bintang berkibar di belakangmu. Di lantai 1, seekor *${sius.dungeon[userId].monster.name}* menantangmu! ${user.activePet ? `*${user.activePet.toUpperCase()}* menggeram siap bertarung!` : ""}\n\n`
            replyText += `💥 Biaya: ${useLimit ? `⏳ ${limitCost} Limit` : `💸 ${moneyCost} Money`}\n`
            replyText += `📊 Monster: ${sius.dungeon[userId].monster.hp}/${sius.dungeon[userId].monster.maxHp} HP\n`
            replyText += `🎁 Kamu mendapatkan: ${expGain} EXP\n`
            replyText += `\n> Gunakan *!dungeon fight* untuk menyerang atau !dungeon leave untuk keluar!`
            
            m.reply(replyText)
        } else if (action === "fight") {
            // Lawan monster
            if (!dungeon) {
                return m.reply("Kamu belum masuk dungeon! Mulai dengan !dungeon start.")
            }
            
            if (dungeon.lastAction && now < dungeon.lastAction + 1800000) {
                const timeLeft = Func.clockString(dungeon.lastAction + 1800000 - now)
                return m.reply(`🌟 Kamu masih pulih dari pertarungan! Coba lagi dalam ${timeLeft}`)
            }
            
            // Hitung damage
            let baseDamage = 50 + (user.level || 1) * 20
            if (user.activePet && user.pets[user.activePet]?.level) {
                baseDamage += Math.floor(baseDamage * (0.2 * user.pets[user.activePet].level))
            }
            if (user.guild) {
                const guild = db.guilds[user.guild.toLowerCase()]
                if (guild) baseDamage += Math.floor(baseDamage * (guild.level * 0.05))
            }
            if (user.eventBonus && user.eventBonusEnd && now < user.eventBonusEnd) {
                baseDamage += Math.floor(baseDamage * user.eventBonus)
            }
            
            const damage = Math.min(baseDamage, dungeon.monster.hp)
            dungeon.monster.hp -= damage
            dungeon.lastAction = now
            
            let replyText = `⚔️ *Pertarungan di Dungeon Lembah Arvandor!*\n\n`
            replyText += `Kamu menyerang *${dungeon.monster.name}* dengan kekuatan penuh, memberikan ${damage} damage! ${user.activePet ? `*${user.activePet.toUpperCase()}* ikut menerkam!` : ""}\n\n`
            replyText += `📊 Monster: ${dungeon.monster.hp}/${dungeon.monster.maxHp} HP\n`
            
            if (dungeon.monster.hp <= 0) {
                // Monster kalah, naik lantai
                const floor = dungeon.floor
                const moneyReward = 100 * floor
                const expReward = 50 * floor
                const itemReward = Math.random() < 0.5 ? "petFood" : ["wood", "iron", "string"][Math.floor(Math.random() * 3)]
                const itemAmount = Math.floor(1 + floor / 2)
                
                user.money = (user.money || 0) + moneyReward
                user.inventory = user.inventory || {}
                user.inventory[itemReward] = (user.inventory[itemReward] || 0) + itemAmount
                
                Func.addExp(user, expReward)
                if (user.activePet) {
                    const petData = user.pets[user.activePet]
                    petData.exp = (petData.exp || 0) + Math.floor(expReward * 0.5)
                    const nextPetLevelExp = 100 + petData.level * 150
                    if (petData.exp >= nextPetLevelExp) {
                        petData.level += 1
                        petData.exp -= nextPetLevelExp
                    }
                    user.pets[user.activePet] = petData
                }
                
                replyText += `🏆 *${dungeon.monster.name} Tumbang!*\n`
                replyText += `Kamu menaklukkan lantai ${floor}! Lorong dungeon membawa mu ke lantai berikutnya.\n\n`
                replyText += `🎁 Hadiah:\n`
                replyText += `    ▢ 💸 ${moneyReward} Money\n`
                replyText += `    ▢ 🎁 ${itemAmount} ${itemReward}\n`
                replyText += `    ▢ 📈 ${expReward} EXP\n`
                if (user.activePet) replyText += `    ▢ 🐾 *${user.activePet.toUpperCase()}*: ${Math.floor(expReward * 0.5)} EXP\n`
                
                // Naik lantai
                dungeon.floor += 1
                dungeon.monster = {
                    name: monsters[Math.floor(Math.random() * monsters.length)],
                    hp: 100 * dungeon.floor,
                    maxHp: 100 * dungeon.floor
                }
                
                replyText += `\nLantai ${dungeon.floor}: Seekor *${dungeon.monster.name}* muncul! \n\n> Gunakan *!dungeon fight* untuk menyerang atau !dungeon leave untuk keluar.`
            } else {
                replyText += `\n> Gunakan *!dungeon fight* lagi dalam 30 menit untuk melanjutkan pertarungan!`
            }
            
            sius.dungeon[userId] = dungeon
            m.reply(replyText)
        } else if (action === "leave") {
            // Keluar dungeon
            if (!dungeon) {
                return m.reply("Kamu belum masuk dungeon! Mulai dengan !dungeon start.")
            }
            
            delete sius.dungeon[userId]
            
            let replyText = `🌌 *Meninggalkan Dungeon Lembah Arvandor*\n\n`
            replyText += `Kamu keluar dari kegelapan dungeon, kembali ke cahaya Lembah Arvandor. ${user.activePet ? `*${user.activePet.toUpperCase()}* mengikuti dengan setia!` : ""}\n\n`
            replyText += `> Gunakan *!dungeon start* untuk kembali berpetualang!`
            
            m.reply(replyText)
        } else {
            // Status atau bantuan
            let replyText = `🌌 *Dungeon Lembah Arvandor*\n\n`
            if (dungeon) {
                replyText += `Kamu berada di lantai ${dungeon.floor}, menghadapi *${dungeon.monster.name}* (${dungeon.monster.hp}/${dungeon.monster.maxHp} HP). ${user.activePet ? `*${user.activePet.toUpperCase()}* siap bertarung!` : ""}\n\n`
                replyText += `Gunakan:\n`
                replyText += `    ▢ !dungeon fight: Melawan monster\n`
                replyText += `    ▢ !dungeon leave: Keluar dungeon`
            } else {
                replyText += `Dungeon misterius menanti di Lembah Arvandor! Hadapi monster untuk hadiah epik. ${user.activePet ? `*${user.activePet.toUpperCase()}* menggonggong, ingin berpetualang!` : ""}\n\n`
                replyText += `> Gunakan *!dungeon start* untuk masuk (biaya: 💸 100 Money atau ⏳ 1 Limit).`
            }
            
            m.reply(replyText)
        }
    }
})