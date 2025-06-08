commands.add({
    name: ["duel"],
    command: ["duel"],
    category: "rpg",
    group: true,
    desc: "Menantang petualang lain untuk duel epik di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId] 
        db.users[userId] = user
        sius.duel = sius.duel || {}
        sius.duel[m.chat] = sius.duel[m.chat] || {}
        const now = Date.now()
        
        // Cek cooldown duel
        if (user.lastDuel && now < user.lastDuel + 1800000) {
            const timeLeft = Func.clockString(user.lastDuel + 1800000 - now)
            return m.reply(`⚔️ Arena masih berdebu dari duelmu sebelumnya! Kembali dalam ${timeLeft}`)
        }
        
        // Subcommand
        const action = args[0]?.toLowerCase() || "challenge"
        
        if (action === "challenge" || !["accept", "reject", "fight"].includes(action)) {
            // Tantang lawan
            if (!m.mentionedJid || m.mentionedJid.length !== 1) {
                return m.reply("Tag satu lawan untuk duel! Contoh: !duel @user [taruhan]")
            }
            
            const opponentId = m.mentionedJid[0]
            if (opponentId === userId) {
                return m.reply("Kamu tidak bisa menantang dirimu sendiri, petualang! Cari lawan sejati di Lembah Arvandor!")
            }
            
            let opponent = db.users[opponentId] || { ...defaultUser }
            if (opponent.lastDuel && now < opponent.lastDuel + 1800000) {
                const timeLeft = Func.clockString(opponent.lastDuel + 1800000 - now)
                return m.reply(`Lawanmu masih pulih dari duel sebelumnya! Tantang lagi dalam ${timeLeft}`)
            }
            
            if (sius.duel[m.chat][userId]) {
                return m.reply("Kamu sudah menantang seseorang!\n\n> Tunggu lawan menerima atau batalkan dengan !duel reject.")
            }
            
            const bet = args[1] && !isNaN(args[1]) ? Math.floor(Number(args[1])) : 100
            if (bet < 0) return m.reply("Taruhan tidak bisa negatif!")
            
            const moneyCost = bet
            const limitCost = Math.ceil(bet / 500)
            const useLimit = user.money < moneyCost && user.limit >= limitCost
            
            if (user.money < moneyCost && !useLimit) {
                return m.reply(`Kamu perlu 💸 ${moneyCost} Money atau ⏳ ${limitCost} Limit untuk taruhan! Kamu punya: 💸 ${user.money}, ⏳ ${user.limit}`)
            }
            if (opponent.money < moneyCost && opponent.limit < limitCost) {
                return m.reply(`Lawanmu tidak punya cukup 💸 ${moneyCost} Money atau ⏳ ${limitCost} Limit untuk taruhan!`)
            }
            
            sius.duel[m.chat][userId] = {
                opponentId,
                accepted: false,
                lastAction: now,
                bet
            }
            
            let replyText = `⚔️ *Tantangan Duel di Lembah Arvandor!*\n\n`
            replyText += `${user.name || userId.split("@")[0]} melempar sarung tangan ke arena, menantang ${opponent.name || opponentId.split("@")[0]} untuk duel di bawah langit bintang! ${user.activePet ? `*${user.activePet.toUpperCase()}* menggeram, siap mendampingi!` : ""}\n\n`
            replyText += `💰 Taruhan: ${bet} Money\n`
            replyText += `Lawan, gunakan !duel accept untuk menerima atau !duel reject untuk menolak dalam 2 menit!`
            
            m.reply(replyText)
        } else if (action === "accept") {
            // Terima tantangan
            let challengerId = Object.keys(sius.duel[m.chat]).find(id => sius.duel[m.chat][id].opponentId === userId)
            if (!challengerId) {
                return m.reply("Tidak ada tantangan duel untukmu saat ini! Tantang seseorang dengan !duel @user.")
            }
            
            let duel = sius.duel[m.chat][challengerId]
            if (duel.accepted) {
                return m.reply("Tantangan ini sudah diterima! Gunakan !duel fight untuk bertarung.")
            }
            if (now > duel.lastAction + 120000) {
                delete sius.duel[m.chat][challengerId]
                return m.reply("Tantangan telah kadaluarsa! Ajukan tantangan baru dengan !duel @user.")
            }
            
            const bet = duel.bet
            const moneyCost = bet
            const limitCost = Math.ceil(bet / 500)
            const useLimit = user.money < moneyCost && user.limit >= limitCost
            
            if (user.money < moneyCost && !useLimit) {
                return m.reply(`Kamu perlu 💸 ${moneyCost} Money atau ⏳ ${limitCost} Limit untuk menerima taruhan! Kamu punya: 💸 ${user.money}, ⏳ ${user.limit}`)
            }
            
            duel.accepted = true
            duel.lastAction = now
            
            let replyText = `⚔️ *Tantangan Diterima di Lembah Arvandor!*\n\n`
            replyText += `${user.name || userId.split("@")[0]} mengangkat sarung tangan, menerima tantangan dari ${db.users[challengerId]?.name || challengerId.split("@")[0]}! Arena bergemuruh, bintang-bintang menyaksikan! ${user.activePet ? `*${user.activePet.toUpperCase()}* mengaum penuh semangat!` : ""}\n\n`
            replyText += `💰 Taruhan: ${bet} Money\n`
            replyText += `Gunakan !duel fight untuk memulai pertarungan dalam 5 menit!`
            
            m.reply(replyText)
        } else if (action === "reject") {
            // Tolak tantangan
            let challengerId = Object.keys(sius.duel[m.chat]).find(id => sius.duel[m.chat][id].opponentId === userId)
            if (!challengerId) {
                return m.reply("Tidak ada tantangan duel untukmu saat ini! Tantang seseorang dengan !duel @user.")
            }
            
            delete sius.duel[m.chat][challengerId]
            
            let replyText = `⚔️ *Tantangan Ditolak di Lembah Arvandor*\n\n`
            replyText += `${user.name || userId.split("@")[0]} menolak sarung tangan duel, memilih menyimpan pedang untuk hari lain. ${user.activePet ? `*${user.activePet.toUpperCase()}* menggonggong kecewa!` : ""}\n\n`
            replyText += `Ajukan tantangan baru dengan !duel @user!`
            
            m.reply(replyText)
        } else if (action === "fight") {
            // Lakukan duel
            let duelData = sius.duel[m.chat][userId] || Object.values(sius.duel[m.chat]).find(d => d.opponentId === userId && d.accepted)
            if (!duelData) {
                return m.reply("Tidak ada duel aktif untukmu! Tantang seseorang dengan !duel @user.")
            }
            
            const challengerId = duelData.opponentId === userId ? Object.keys(sius.duel[m.chat]).find(id => sius.duel[m.chat][id].opponentId === userId) : userId
            const opponentId = duelData.opponentId
            if (!duelData.accepted) {
                return m.reply("Tantangan belum diterima! Tunggu lawan dengan !duel accept.")
            }
            if (now > duelData.lastAction + 300000) {
                delete sius.duel[m.chat][challengerId]
                return m.reply("Duel telah kadaluarsa! Ajukan tantangan baru dengan !duel @user.")
            }
            
            let challenger = db.users[challengerId] || { ...defaultUser }
            let opponent = db.users[opponentId] || { ...defaultUser }
            
            // Hitung damage
            const calculateDamage = (player) => {
                let baseDamage = 100 + (player.level || 1) * 50
                if (player.activePet && player.pets[player.activePet]?.level) {
                    baseDamage += Math.floor(baseDamage * (0.2 * player.pets[player.activePet].level))
                }
                if (player.guild) {
                    const guild = db.guilds[player.guild.toLowerCase()]
                    if (guild) baseDamage += Math.floor(baseDamage * (guild.level * 0.05))
                }
                if (player.eventBonus && player.eventBonusEnd && now < player.eventBonusEnd) {
                    baseDamage += Math.floor(baseDamage * player.eventBonus)
                }
                // Random factor
                return Math.floor(baseDamage * (0.9 + Math.random() * 0.2))
            }
            
            const challengerDamage = calculateDamage(challenger)
            const opponentDamage = calculateDamage(opponent)
            
            const winnerId = challengerDamage >= opponentDamage ? challengerId : opponentId
            const loserId = winnerId === challengerId ? opponentId : challengerId
            const winner = db.users[winnerId]
            const loser = db.users[loserId]
            
            // Proses hadiah
            const bet = duelData.bet
            const moneyWin = bet * 2 // Pemenang ambil taruhan keduanya
            const expWin = 100
            const expLose = 20
            const itemReward = ["petFood", "wood", "iron", "string"][Math.floor(Math.random() * 4)]
            const itemAmount = 1
            
            const winnerUseLimit = winner.money < bet && winner.limit >= Math.ceil(bet / 500)
            const loserUseLimit = loser.money < bet && loser.limit >= Math.ceil(bet / 500)
            
            if (winnerUseLimit) winner.limit -= Math.ceil(bet / 500)
            else winner.money -= bet
            if (loserUseLimit) loser.limit -= Math.ceil(bet / 500)
            else loser.money -= bet
            
            winner.money = (winner.money || 0) + moneyWin
            winner.battleWins = (winner.battleWins || 0) + 1
            winner.inventory = winner.inventory || {}
            winner.inventory[itemReward] = (winner.inventory[itemReward] || 0) + itemAmount
            
            Func.addExp(winner, expWin)
            Func.addExp(loser, expLose)
            
            if (winner.activePet) {
                const petData = winner.pets[winner.activePet]
                petData.exp = (petData.exp || 0) + Math.floor(expWin * 0.5)
                const nextPetLevelExp = 100 + petData.level * 150
                if (petData.exp >= nextPetLevelExp) {
                    petData.level += 1
                    petData.exp -= nextPetLevelExp
                }
                winner.pets[winner.activePet] = petData
            }
            if (loser.activePet) {
                const petData = loser.pets[loser.activePet]
                petData.exp = (petData.exp || 0) + Math.floor(expLose * 0.5)
                const nextPetLevelExp = 100 + petData.level * 150
                if (petData.exp >= nextPetLevelExp) {
                    petData.level += 1
                    petData.exp -= nextPetLevelExp
                }
                loser.pets[loser.activePet] = petData
            }
            
            user.lastDuel = now
            opponent.lastDuel = now
            
            delete sius.duel[m.chat][challengerId]
            
            let replyText = `⚔️ *Duel Epik di Lembah Arvandor!*\n\n`
            replyText += `Arena bergemuruh saat ${challenger.name || challengerId.split("@")[0]} dan ${opponent.name || opponentId.split("@")[0]} bertarung di bawah sorot bintang! Pedang beradu, sihir berkobar! ${challenger.activePet && opponent.activePet ? `*${challenger.activePet.toUpperCase()}* dan *${opponent.activePet.toUpperCase()}* saling menerkam!` : ""}\n\n`
            replyText += `💥 *Hasil*:\n`
            replyText += `    ▢ ${challenger.name || challengerId.split("@")[0]}: ${challengerDamage} damage\n`
            replyText += `    ▢ ${opponent.name || opponentId.split("@")[0]}: ${opponentDamage} damage\n\n`
            replyText += `🏆 *Pemenang*: ${winner.name || winnerId.split("@")[0]}!\n`
            replyText += `Spanduk kemenangan berkibar megah!\n\n`
            replyText += `🎁 *Hadiah Pemenang*:\n`
            replyText += `    ▢ 💸 ${moneyWin} Money\n`
            replyText += `    ▢ 🎁 ${itemAmount} ${itemReward}\n`
            replyText += `    ▢ 📈 ${expWin} EXP\n`
            if (winner.activePet) replyText += `    ▢🐾 *${winner.activePet.toUpperCase()}*: ${Math.floor(expWin * 0.5)} EXP\n`
            replyText += `\n🎁 *Hadiah Kalah*:\n`
            replyText += `    ▢ 📈 ${expLose} EXP\n`
            if (loser.activePet) replyText += `    ▢🐾 *${loser.activePet.toUpperCase()}*: ${Math.floor(expLose * 0.5)} EXP\n`
            replyText += `\nTantang lagi dengan !duel @user setelah 30 menit!`
            
            m.reply(replyText)
        }
    }
})