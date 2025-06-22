import { rdGame, iGame, tGame, gameCasinoSolo, gameSamgongSolo, gameMerampok, setLimit, addLimit, addUang, setUang, transfer, TicTacToe } from "../../lib/game.js"
import { Akinator, AkinatorAnswer } from "aki-api"
import fs from "fs"
import chalk from "chalk"

const suit = db.game.suit
const chat_ai = db.game.chat_ai
const menfes = db.game.menfes
const tekateki = db.game.tekateki
const akinator = db.game.akinator
const tictactoe = db.game.tictactoe
const tebaklirik = db.game.tebaklirik
const kuismath = db.game.kuismath
const tebakkata = db.game.tebakkata
const family100 = db.game.family100
const susunkata = db.game.susunkata
const tebakbom = db.game.tebakbom
const tebakkimia = db.game.tebakkimia
const caklontong = db.game.caklontong
const tebakangka = db.game.tebakangka
const tebaknegara = db.game.tebaknegara
const tebakgambar = db.game.tebakgambar
const tebakbendera = db.game.tebakbendera
const asahotak = db.game.asahotak
const siapakahaku = db.game.siapakahaku
const tebakanime = db.game.tebakanime
const tebaklagu = db.game.tebaklagu

commands.add({
    name: ["slot"],
    command: ["slot"],
    alias: ["slots"],
    category: "rpg",
    cooldown: 30,
    desc: "putar mesin slot magis di pasar bintang jatuh",
    privatechat: true,
    run: async ({ sius, m, args, Func, dl }) => {
        if (m.isGroup) return m.reply("⚠️ Fitur hanya dapat diakses di private chat")
        const userId = m.sender
        let user = db.users[userId]
        if (!user) {
            user = { money: 100, slotSpins: 0, slotWins: 0, lastSlotSpin: 0, exp: 0 }
            db.users[userId] = user
        }
        const bet = parseInt(args[0])
        const minBet = 10
        const maxBet = 100000
        if (isNaN(bet) || bet < minBet || bet > maxBet) {
            return m.reply(`⚠️ Taruhan harus antara ${minBet} dan ${maxBet} money 💵!\n\nContoh: !slot 50`)
        }
        if (user.money < bet) {
            return m.reply(`⚠️ Money kurang! Kamu punya ${Func.formatUang(user.money)}, butuh ${bet}.\n\n> Lakukan klaim harian untuk mendapatkan money dengan mengetik *!daily*!`)
        }
        const now = Date.now()
        try {
            user.money -= bet
            user.slotSpins = (user.slotSpins || 0) + 1
            user.lastSlotSpin = now
            const symbols = ["🍇","🍉","🍋","🍌","🍎","🍑","🍒","🫐","🥥","🥑","🍓","🥥","🍈","🍊","🥭","🍋‍🟩"]
            const generateReels = () => [
                Array(3).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]),
                Array(3).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]),
                Array(3).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)])
            ]
            sius.slot = sius.slot || {}
            sius.slot[userId] = { rolling: true }
            let reels = generateReels()
            let message = `🎰 [ ${reels[0][0]} | ${reels[0][1]} | ${reels[0][2]} ] 🎰\n`
            message += `🎰 [ ${reels[1][0]} | ${reels[1][1]} | ${reels[1][2]} ] 🎰 ◄\n`
            message += `🎰 [ ${reels[2][0]} | ${reels[2][1]} | ${reels[2][2]} ] 🎰\n\n`
            message += `> Mesin sedang berputar...`
            let sentMessage = await m.reply(message)
            for (let i = 0; i < 3; i++) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                reels = generateReels()
                message = `🎰 [ ${reels[0][0]} | ${reels[0][1]} | ${reels[0][2]} ] 🎰\n`
                message += `🎰 [ ${reels[1][0]} | ${reels[1][1]} | ${reels[1][2]} ] 🎰 ◄\n`
                message += `🎰 [ ${reels[2][0]} | ${reels[2][1]} | ${reels[2][2]} ] 🎰\n\n`
                message += `> Mesin sedang berputar!`
                await sius.sendMessage(m.chat, { text: message, edit: sentMessage.key })
            }
            reels = generateReels()
            const middleRow = reels[1]
            let reward = 0
            let expGain = Math.floor(bet / 10) + 5
            message = `🎰 [ ${reels[0][0]} | ${reels[0][1]} | ${reels[0][2]} ] 🎰\n`
            message += `🎰 [ ${middleRow[0]} | ${middleRow[1]} | ${middleRow[2]} ] 🎰 ◄\n`
            message += `🎰 [ ${reels[2][0]} | ${reels[2][1]} | ${reels[2][2]} ] 🎰\n\n`

            if (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
                reward = bet * 10
                user.slotWins = (user.slotWins || 0) + 1
                message += `🍻 *JACKPOT!* \n3 ${middleRow[0]} di Baris Bintang!\n▢ *Hadiah:* ${Func.formatUang(reward)}\n▢ *EXP:* +${expGain}`
            } else if (middleRow[0] === middleRow[1] || middleRow[1] === middleRow[2] || middleRow[0] === middleRow[2]) {
                reward = bet * 2
                user.slotWins = (user.slotWins || 0) + 1
                message += `🎉 *KEMENANGAN!*\n2 simbol sama di Baris Bintang!\n▢ *Hadiah:* ${Func.formatUang(reward)}\n▢ *EXP:* +${expGain}`
            } else {
                message += `😔 *GAGAL!*\nBaris Bintang tidak sejajar. Coba lagi!\n▢ *EXP:* +${expGain}`
            }
            user.money += reward
            Func.addExp(user, expGain)
            db.users[userId] = user
            message += `\n\n▢ *Taruhan:* ${Func.formatUang(bet)}\n▢ *Money Kamu:* ${Func.formatUang(user.money)}\n▢ *Total Putaran:* ${user.slotSpins}`
            await sius.sendMessage(m.chat, { text: message, edit: sentMessage.key })
            delete sius.slot[userId]
        } catch (err) {
            sius.cantLoad(err)
            delete sius.slot[userId]
        }
    }
})

commands.add({
    name: ["tebaklagu"],
    command: ["tebaklagu"],
    category: "rpg",
    cooldown: 30,
    desc: "Tebak lagu dari potongan audio",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebaklagu, m.chat)) return m.reply("⚠️ Masih ada sesi Tebak Lagu yang belum dijawab!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebaklagu.json")
        const hasil = Func.pickRandom(soal)
        let audioMsg = {
            audio: { url: hasil.soal },
            mimetype: "audio/mp4",
            ptt: true
        }
        let { key } = await sius.sendMessage(m.chat, audioMsg, { quoted: m })
        tebaklagu[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            artis: hasil.artis,
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebaklagu, m.chat, key.id)) {
            await m.reply(`⏰ *Waktu Habis!*\nJawaban: *${tebaklagu[m.chat + key.id].jawaban}*\n🎙️ Artis: ${tebaklagu[m.chat + key.id].artis}`)
            delete tebaklagu[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["casino"],
    command: ["casino"],
    category: "rpg",
    cooldown: 30,
    desc: "Bermain game casino solo",
    run: async({ sius, m, args }) => {
        await gameCasinoSolo(sius, m, db)
    }
})

commands.add({
    name: ["siapakahaku"],
    command: ["siapakahaku"],
    category: "rpg",
    cooldown: 30,
    desc: "Tebak 'Siapakah Aku?' dan menangkan XP",
    run: async({ sius, m, args, Func }) => {
        if (iGame(siapakahaku, m.chat)) return m.reply("⚠️ Masih ada sesi 'Siapakah Aku' yang belum dijawab!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/siapakahaku.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🕵️ ] SIAPAKAH AKU?*\n\n${hasil.soal}\n\nTimeout: *60 detik*\n> Balas pesan ini untuk menjawab.`)
        siapakahaku[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(siapakahaku, m.chat, key.id)) {
            m.reply(`⏰ *Waktu Habis!*\nJawaban yang benar adalah: *${siapakahaku[m.chat + key.id].jawaban}*`)
            delete siapakahaku[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebakanime"],
    command: ["tebakanime"],
    category: "rpg",
    cooldown: 30,
    desc: "Tebak karakter anime dari gambar",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebakanime, m.chat)) return m.reply("⚠️ Masih ada sesi Tebak Anime yang belum dijawab!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebakanime.json")
        const hasil = Func.pickRandom(soal)
        let media = { image: { url: hasil.image }, caption: `*[ 🎌 ] TEBAK ANIME*\n\nTebak nama karakter dari gambar di atas!\nTimeout: *60 detik*\n> Balas pesan ini untuk menjawab.` }
        let { key } = await sius.sendMessage(m.chat, media, { quoted: m })
        tebakanime[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            desc: hasil.desc,
            url: hasil.url,
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebakanime, m.chat, key.id)) {
            await m.reply(`⏰ *Waktu Habis!*\nJawaban yang benar adalah: *${tebakanime[m.chat + key.id].jawaban}*\n\n📖 *Deskripsi:*\n${tebakanime[m.chat + key.id].desc}\n\n🔗 ${tebakanime[m.chat + key.id].url}`)
            delete tebakanime[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["asahotak"],
    command: ["asahotak"],
    category: "rpg",
    cooldown: 30,
    desc: "Game asah otak dengan hadiah XP",
    run: async({ sius, m, args, Func }) => {
        if (iGame(asahotak, m.chat)) return m.reply("⚠️ Masih ada sesi Asah Otak yang belum dijawab!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/asahotak.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🧠 ] ASAH OTAK*\n\n${hasil.soal}\n\nTimeout: *60 detik*\n> Balas pesan ini untuk menjawab.`)
        asahotak[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(asahotak, m.chat, key.id)) {
            m.reply(`⏰ *Waktu Habis!*\nJawaban yang benar adalah: *${asahotak[m.chat + key.id].jawaban}*`)
            delete asahotak[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["samgong"],
    command: ["samgong"],
    category: "rpg",
    cooldown: 30,
    desc: "Bermain game samgong/kartu",
    run: async({ sius, m, args }) => {
        await gameSamgongSolo(sius, m, db)
    }
})

commands.add({
    name: ["rampok"],
    command: ["rampok"],
    category: "rpg",
    cooldown: 30,
    desc: "Game merampok uang pemain lain",
    run: async({ sius, m, args }) => {
        await gameMerampok(m, db)
    }
})

commands.add({
    name: ["suit"],
    command: ["suit"],
    category: "rpg",
    cooldown: 30,
    desc: "Bermain suit dengan pemain lain",
    run: async({ sius, m, args, Func }) => {
        const ownr = config.owner
        if (Object.values(suit).find(roof => roof.id.startsWith("suit") && [roof.p, roof.p2].includes(m.sender))) return m.reply("⚠️ Selesaikan suit mu yang sebelumnya")
        if (m.mentionedJid[0] === m.sender) return m.reply("⚠️ Tidak bisa bermain dengan diri sendiri !")
        if (!m.mentionedJid[0]) return m.reply(`_Siapa yang ingin kamu tantang?_\nTag orangnya..\n\nContoh : .suit @${ownr[0]}`, m.chat, { mentions: [ownr[1] + "@s.whatsapp.net"] })
        if (Object.values(suit).find(roof => roof.id.startsWith("suit") && [roof.p, roof.p2].includes(m.mentionedJid[0]))) return m.reply("⚠️ Orang yang kamu tantang sedang bermain suit bersama orang lain :(")
        let caption = `_*SUIT PvP*_\n\n@${m.sender.split`@`[0]} menantang @${m.mentionedJid[0].split`@`[0]} untuk bermain suit\n\nSilahkan @${m.mentionedJid[0].split`@`[0]} untuk ketik terima/tolak`
        let id = "suit_" + Date.now()
        suit[id] = {
            chat: caption,
            id: id,
            p: m.sender,
            p2: m.mentionedJid[0],
            status: "wait",
            poin: 10,
            poin_lose: 10,
            timeout: 3 * 60 * 1000
        }
        m.reply(caption)
        await Func.sleep(3 * 60 * 1000)
        if (suit[id]) {
            m.reply("_Waktu suit habis_")
            delete suit[id]
        }
    }
})

commands.add({
    name: ["delsuit"],
    command: ["delsuit"],
    category: "rpg",
    cooldown: 30,
    desc: "Menghapus sesi suit",
    run: async({ sius, m, args, Func }) => {
        let roomnya = Object.values(suit).find(roof => roof.id.startsWith("suit") && [roof.p, roof.p2].includes(m.sender))
        if (!roomnya) return m.reply("⚠️ Kamu sedang tidak berada di room suit !")
        delete suit[roomnya.id]
        m.reply("[√] Berhasil delete session room suit!")
    }
})

commands.add({
    name: ["tictactoe"],
    command: ["tictactoe"],
    category: "rpg",
    cooldown: 30,
    desc: "Bermain tictactoe dengan pemain lain",
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        if (Object.values(tictactoe).find(room => room.id.startsWith("tictactoe") && [room.game.playerX, room.game.playerO].includes(m.sender))) return m.reply(`⚠️ Kamu masih didalam game!\nKetik *.deltictactoe* Jika Ingin Mengakhiri sesi`)
        let room = Object.values(tictactoe).find(room => room.state === "WAITING" && (text ? room.name === text : true))
        if (room) {
            m.reply("[√] Partner ditemukan!")
            room.o = m.chat
            room.game.playerO = m.sender
            room.state = "PLAYING"
            if (!(room.game instanceof TicTacToe)) {
                room.game = Object.assign(new TicTacToe(room.game.playerX, room.game.playerO), room.game)
            }
            let arr = room.game.render().map(v => {
                return {X: "❌",O: "⭕",1: "1️⃣",2: "2️⃣",3: "3️⃣",4: "4️⃣",5: "5️⃣",6: "6️⃣",7: "7️⃣",8: "8️⃣",9: "9️⃣"}[v]
            })
            let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join("")}\n${arr.slice(3, 6).join("")}\n${arr.slice(6).join("")}\n\nMenunggu @${room.game.currentTurn.split("@")[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
            if (room.x !== room.o) await sius.sendMessage(room.x, { texr: str, mentions: parseMention(str) }, { quoted: m })
            await sius.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
        } else {
            room = {
                id: "tictactoe-" + (+new Date),
                x: m.chat,
                o: "",
                game: new TicTacToe(m.sender, "o"),
                state: "WAITING",
            }
            if (text) room.name = text
            sius.sendMessage(m.chat, { text: "Menunggu partner" + (text ? ` mengetik command dibawah ini .tictactoe ${text}` : ""), mentions: m.mentionedJid }, { quoted: m })
            tictactoe[room.id] = room
            await Func.sleep(300000)
            if (tictactoe[room.id]) {
                m.reply(`_Waktu tictactoe habis_`)
                delete tictactoe[room.id]
            }
        }
    }
})

commands.add({
    name: ["deltictactoe"],
    command: ["deltictactoe"],
    category: "rpg",
    cooldown: 30,
    desc: "Menghapus sesi tictactoe",
    run: async({ sius, m, args, Func }) => {
        let roomnya = Object.values(tictactoe).find(room => room.id.startsWith("tictactoe") && [room.game.playerX, room.game.playerO].includes(m.sender))
        if (!roomnya) return m.reply("⚠️ Kamu sedang tidak berada di room tictactoe !")
        delete tictactoe[roomnya.id]
        m.reply("[√] Berhasil delete session room tictactoe !")
    }
})

commands.add({
    name: ["akinator"],
    command: ["akinator"],
    category: "rpg",
    cooldown: 30,
    desc: "Bermain tebak karakter dengan AI",
    run: async({ sius, m, args, Func }) => {
        if (args[0] == "start") {
            if (akinator[m.sender]) return m.reply("⚠️ Masih Ada Sesi Yang Belum Diselesaikan!")
            akinator[m.sender] = new Akinator({ region: "id", childMode: false })
            try {
                await akinator[m.sender].start()
            } catch (e) {
                delete akinator[m.sender]
                return m.reply("⚠️ Server Akinator Sedang Gangguan\nSilahkan coba lagi nanti!")
            }
            let { key } = await m.reply(`🎮 Akinator Game :\n\n@${m.sender.split("@")[0]}\n${akinator[m.sender].question}\n\n- 0 - Ya\n- 1 - Tidak\n- 2 - Tidak Tau\n- 3 - Mungkin\n- 4 - Mungkin Tidak\n\n.akinator end (Untuk Keluar dari sesi)`)
            akinator[m.sender].key = key.id
            await Func.sleep(3600000)
            if (akinator[m.sender]) {
                m.reply(`_Waktu akinator habis_`)
                delete akinator[m.sender]
            }
        } else if (args[0] == "end") {
            if (!akinator[m.sender]) return m.reply("Kamu tidak Sedang bermain Akinator!")
            delete akinator[m.sender]
            m.reply("[√] Sukses Mengakhiri sessi Akinator")
        } else m.reply(`Contoh penggunaan: .akinator start/end`)
    }
})

commands.add({
    name: ["tebakbom"],
    command: ["tebakbom"],
    category: "rpg",
    cooldown: 30,
    alias: ["bomb"],
    desc: "game tebak bom dengan nyawa terbatas",
    run: async({ sius, m, args, Func }) => {
        if (tebakbom[m.sender]) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        tebakbom[m.sender] = {
            petak: [0, 0, 0, 2, 0, 2, 0, 2, 0].sort(() => Math.random() - 0.5),
            board: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
            bomb: 3,
            lolos: 6,
            pick: 0,
            nyawa: ["❤️", "❤️", "❤️"]
        }

        await m.reply(
`乂  *B O M B*

Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :

${tebakbom[m.sender].board.slice(0, 3).join("")}
${tebakbom[m.sender].board.slice(3, 6).join("")}
${tebakbom[m.sender].board.slice(6, 9).join("")}

Timeout : [ *3 menit* ]
> apabila mendapat kotak yang berisi bom maka point akan di kurangi.`)
        await Func.sleep(180000)
        if (tebakbom[m.sender]) {
            m.reply(`_Waktu tebak bom habis_`)
            delete tebakbom[m.sender]
        }
    }
})


commands.add({
    name: ["tekateki"],
    command: ["tekateki"],
    category: "rpg",
    cooldown: 30,
    desc: "Game teka-teki dengan hadiah XP",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tekateki, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tekateki.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] TEKA TEKI*\n\nBerikut :\n${hasil.soal}\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`)
        tekateki[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tekateki, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tekateki[m.chat + key.id].jawaban)
            delete tekateki[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebaklirik"],
    command: ["tebaklirik"],
    category: "rpg",
    cooldown: 30,
    desc: "Game tebak lirik lagu",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebaklirik, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebaklirik.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] TEKA LIRIK*\n\nBerikut :\n${hasil.soal}\n\nTimeout : [ *90s* ]\n\n> Reply pesan ini untuk menjawab`)
        tebaklirik[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(90000)
        if (rdGame(tebaklirik, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tebaklirik[m.chat + key.id].jawaban)
            delete tebaklirik[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebakkata"],
    command: ["tebakkata"],
    category: "rpg",
    cooldown: 30,
    desc: "Game tebak kata dengan hadiah XP",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebakkata, m.chat)) return m.reply("⚠️ Masih Ada Sesi Yang Belum Diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebakkata.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] TEKA KATA*\n\n Berikut :\n${hasil.soal}\n\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`)
        tebakkata[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebakkata, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tebakkata[m.chat + key.id].jawaban)
            delete tebakkata[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["family100"],
    command: ["family100"],
    category: "rpg",
    cooldown: 30,
    desc: "Game family100 dengan hadiah XP",
    run: async({ sius, m, args, Func }) => {
        if (family100.hasOwnProperty(m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/family100.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] FAMILY 100*\n\n Berikut :\n${hasil.soal}\n\nTimeout : [ *05:00* ]\n\n> Reply pesan ini untuk menjawab`)
        family100[m.chat] = {
            soal: hasil.soal,
            jawaban: hasil.jawaban,
            terjawab: Array.from(hasil.jawaban, () => false),
            id: key.id
        }
        await Func.sleep(300000)
        if (family100.hasOwnProperty(m.chat)) {
            m.reply("Waktu Habis\nJawaban:\n- " + family100[m.chat].jawaban.join("\n- "))
            delete family100[m.chat]
        }
    }
})

commands.add({
    name: ["susunkata"],
    command: ["susunkata"],
    category: "rpg",
    cooldown: 30,
    desc: "Game susun kata dengan hadiah XP",
    run: async({ sius, m, args, Func }) => {
        if (iGame(susunkata, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/susunkata.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] SUSUN KATA*\n\n Berikut :\n${hasil.soal}\nTipe : ${hasil.tipe}\n\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`)
        susunkata[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(susunkata, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + susunkata[m.chat + key.id].jawaban)
            delete susunkata[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebakkimia"],
    command: ["tebakkimia"],
    category: "rpg",
    cooldown: 30,
    desc: "Game tebak lambang kimia",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebakkimia, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebakkimia.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] TEBAK KIMIA*\n\n Berikut :\n${hasil.unsur}\n\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`)
        tebakkimia[m.chat + key.id] = {
            jawaban: hasil.lambang.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebakkimia, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tebakkimia[m.chat + key.id].jawaban)
            delete tebakkimia[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["caklontong"],
    command: ["caklontong"],
    category: "rpg",
    cooldown: 30,
    desc: "Game cak lontong dengan hadiah XP besar",
    run: async({ sius, m, args, Func }) => {
        if (iGame(caklontong, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/caklontong.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] CAK LONTONG*\n\nJawab Pertanyaan Berikut :\n${hasil.soal}\n\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`)
        caklontong[m.chat + key.id] = {
            ...hasil,
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(caklontong, m.chat, key.id)) {
            m.reply(`Waktu Habis\nJawaban: ${caklontong[m.chat + key.id].jawaban}\n"${caklontong[m.chat + key.id].deskripsi}"`)
            delete caklontong[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebaknegara"],
    command: ["tebaknegara"],
    category: "rpg",
    cooldown: 30,
    desc: "Game tebak negara dari tempat tertentu",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebaknegara, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebaknegara.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] TEBAK NEGARA*\n\nDari Tempat Berikut :\n*Tempat : ${hasil.tempat}*\n\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`)
        tebaknegara[m.chat + key.id] = {
            jawaban: hasil.negara.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebaknegara, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tebaknegara[m.chat + key.id].jawaban)
            delete tebaknegara[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebakgambar"],
    command: ["tebakgambar"],
    category: "rpg",
    cooldown: 30,
    desc: "Game tebak gambar dengan hadiah XP",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebakgambar, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebakgambar.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply({ image: { url: hasil.img }, caption: `*[ 🎮 ] TEBAK GAMBAR*\n\n Berikut :\n${hasil.deskripsi}\n\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`})
        tebakgambar[m.chat + key.id] = {
            jawaban: hasil.jawaban.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebakgambar, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tebakgambar[m.chat + key.id].jawaban)
            delete tebakgambar[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebakbendera"],
    command: ["tebakbendera"],
    category: "rpg",
    cooldown: 30,
    desc: "Game tebak bendera negara",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebakbendera, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/game/tebakbendera.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply(`*[ 🎮 ] TEKA BENDERA*\n\nBerikut :\n*Bendera : ${hasil.bendera}*\n\nTimeout : [ *60s* ]\n\n> Reply pesan ini untuk menjawab`)
        tebakbendera[m.chat + key.id] = {
            jawaban: hasil.negara.toLowerCase(),
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebakbendera, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tebakbendera[m.chat + key.id].jawaban)
            delete tebakbendera[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["tebakangka"],
    command: ["tebakangka"],
    category: "rpg",
    cooldown: 30,
    desc: "Game tebak angka dalam tes buta warna",
    run: async({ sius, m, args, Func }) => {
        if (iGame(tebakangka, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        const soal = await Func.fetchJson("https://raw.githubusercontent.com/siuspsrb/database/main/fun/color_blind.json")
        const hasil = Func.pickRandom(soal)
        let { key } = await m.reply({
            text: `Pilih Jawaban Yang Benar!\nPilihan: ${[hasil.number, ...hasil.similar].sort(() => Math.random() - 0.5).join(", ")}`,
            contextInfo: {
                externalAdReply: {
                    renderLargerThumbnail: true,
                    thumbnailUrl: hasil.color_blind[0],
                    body: `Level : ${hasil.lv}`,
                    previewType: "PHOTO",
                    mediaType: 1
                }
            }
        })
        tebakangka[m.chat + key.id] = {
            jawaban: hasil.number,
            id: key.id
        }
        await Func.sleep(60000)
        if (rdGame(tebakangka, m.chat, key.id)) {
            m.reply("Waktu Habis\nJawaban: " + tebakangka[m.chat + key.id].jawaban)
            delete tebakangka[m.chat + key.id]
        }
    }
})

commands.add({
    name: ["kuismath"],
    command: ["kuismath"],
    category: "rpg",
    cooldown: 30,
    alias: ["math"],
    desc: "Game kuis matematika dengan berbagai level kesulitan",
    run: async({ sius, m, args, Func }) => {
        const inputMode = ["noob", "easy", "medium", "hard","extreme","impossible","impossible2"]
        if (iGame(kuismath, m.chat)) return m.reply("⚠️ Masih ada sesi yang belum diselesaikan!")
        if (!args[0]) return m.reply(`Mode: ${Object.keys(Func.modes).join(" | ")}\nContoh penggunaan: ${m.prefix + m.command} medium`)
        if (!inputMode.includes(args[0].toLowerCase())) return m.reply("⚠️ Mode tidak ditemukan!")
        let result = await Func.genMath(args[0].toLowerCase())
        let { key } = await m.reply(`*Berapa hasil dari: ${result.soal.toLowerCase()}*?\n\nTimeout : [ *${(result.waktu / 1000).toFixed(2)}s* ]`)
        kuismath[m.chat + key.id] = {
            jawaban: result.jawaban,
            mode: args[0].toLowerCase(),
            id: key.id
        }
        await Func.sleep(kuismath, result.waktu)
        if (rdGame(m.chat + key.id)) {
            m.reply("Waktu Habis\nJawaban: " + kuismath[m.chat + key.id].jawaban)
            delete kuismath[m.chat + key.id]
        }
    }
})