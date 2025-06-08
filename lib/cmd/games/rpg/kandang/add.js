commands.add({
    name: ["addkandang"],
    command: ["addkandang"],
    category: "rpg",
    desc: "Menambahkan hewan ke Kandang Bintang Liar",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        user.kandang = user.kandang || []
        user.kandangCapacity = user.kandangCapacity || 10
        const now = Date.now()
        if (!args[0]) return m.reply("Hewan apa yang ingin kamu tambahkan?\n\n> *Contoh:* !addkandang sapi")        
        const animalInput = args[0].toLowerCase()
        const validAnimals = [
            "sapi", "banteng", "harimau", "gajah", "kambing", "panda", "buaya",
            "kerbau", "monyet", "ayam", "domba", "horse"
        ]
        if (!validAnimals.includes(animalInput)) {
            return m.reply("Hewan tidak valid!\n\n> Pilih: sapi, banteng, harimau, gajah, kambing, panda, buaya, kerbau, monyet, ayam, domba, horse")
        }      
        if (user[animalInput] < 1) {
            return m.reply(`Kamu tidak punya *${animalInput.toUpperCase()}*! \n\n> Ketik .berburu untuk melakukan perburuan dan mendapatkan berbagai hewan buruan!!`)
        }        
        if (user.kandang.length >= user.kandangCapacity) {
            return m.reply(`Kandang penuh! Kapasitas: ${user.kandang.length}/${user.kandangCapacity}.\n\n> Ketik *.upgradekandang* untuk meningkatkan kapasitas`)
        }        
        // tambahkan hewan ke kandang
        user[animalInput] -= 1
        user.kandang.push({ type: animalInput, fed: false, lastProduce: now })        
        // berikan EXP
        const expGain = 20
        Func.addExp(user, expGain)        
        // simpan ke database
        db.users[userId] = user        
        // narasi acak
        const addStories = {
            sapi: `Kamu memimpin 🐄 *Sapi* ke Kandang Bintang Liar. Ia mengembik gembira, siap menghasilkan susu di ladang hijau!`,
            banteng: `Dengan hati-hati, kamu membawa 🐃 *Banteng* ke kandang. Kekuatannya menggetarkan tanah, menjanjikan susu yang kaya!`,
            harimau: `🐅 *Harimau* melangkah gagah ke kandang, matanya berkilau. Keberadaannya meningkatkan auramu di Arena Bayang-Bayang!`,
            gajah: `🐘 *Gajah* berjalan pelan ke kandang, mengguncang tanah. Raksasa ini kini bagian dari ladangmu!`,
            kambing: `🐐 *Kambing* melompat riang ke kandang, siap menghasilkan bulu lembut untuk petualanganmu!`,
            panda: `🐼 *Panda* berguling masuk ke kandang, menarik perhatian semua hewan. Kehadirannya membawa kedamaian!`,
            buaya: `🐊 *Buaya* merayap ke kandang dengan tatapan tajam. Keberadaannya menambah aura liar di ladangmu!`,
            kerbau: `🐂 *Kerbau* melangkah tegap ke kandang, siap menghasilkan susu kuat untuk petualanganmu!`,
            monyet: `🐒 *Monyet* berayun masuk ke kandang, membuat hewan lain tertawa. Kecerdasannya menghidupkan ladang!`,
            ayam: `🐓 *Ayam* berlarian ke kandang, siap bertelur untukmu. Mungkin ada telur emas di antara mereka!`,
            domba: `🐑 *Domba* berjalan lembut ke kandang, bulunya berkilau di bawah matahari. Wol berkualitas menantimu!`,
            horse: `🐎 *Horse* melaju cepat ke kandang, menambah kecepatan petualanganmu. Ladang kini terasa lebih hidup!`
        }        
        const story = addStories[animalInput] || `Kamu menambahkan *${animalInput.toUpperCase()}* ke kandang. Ladang kini lebih ramai!`
        let replyText = `🌾 *HEWAN DITAMBAHKAN!*\n\n`
        replyText += `${story.trim()}\n\n`
        replyText += `> 🎁 *+ ${expGain}* EXP`
        replyText += `\n> 🦒 Hewan di kandang: *${user.kandang.length}/${user.kandangCapacity}*`  
        m.reply(replyText)
    }
})