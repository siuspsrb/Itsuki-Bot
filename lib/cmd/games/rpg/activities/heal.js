commands.add({
    name: ["heal"],
    command: ["heal"],
    category: "rpg",
    desc: "Menggunakan potion untuk memulihkan HP di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        if (user.potion < 1) {
            return m.reply("[ 🧪 ] Kamu tidak punya potion! Beli di Pasar Bintang Jatuh dengan mengetik *!buy potion*")
        }
        if (user.health >= 100) {
            return m.reply("[ ❤️ ] HP-mu sudah penuh! Simpan potion untuk saat krisis")
        }
        // pulihkan HP (30-50)
        const healthGain = Math.floor(Math.random() * 21) + 30
        user.health += healthGain
        if (user.health > 100) user.health = 100
        user.potion -= 1
        // berikan EXP kecil
        const expGain = 20
        Func.addExp(user, expGain)        
        // simpan ke database
        db.users[userId] = user
        // balasan
        let replyText = `▢ +${healthGain} HP ❤️‍🩹 (${user.health}/100)\n`
        replyText += `▢ +${expGain} EXP\n`
        replyText += `\n> [ 🧪 ] Sisa potion: *${user.potion}*`
        m.reply(replyText)
    }
})