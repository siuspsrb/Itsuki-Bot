commands.add({
    name: ["kandang"],
    command: ["kandang"],
    category: "rpg",
    desc: "Mengunjungi Kandang Bintang Liar di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        user.kandang = user.kandang || []
        user.kandangCapacity = user.kandangCapacity || 10
        user.products = user.products || { milk: 0, wool: 0, egg: 0, goldenEgg: 0 }
        
        let replyText = "🌾 *KANDANG BINTANG LIAR*\n\n"
        replyText += "Di ladang hijau Lembah Arvandor, Kandang Bintang Liar hidup dengan suara hewan dan aroma rumput segar. Hewan-hewanmu menantimu, petualang!\n\n"
        
        replyText += "*HEWAN DI KANDANG* (Kapasitas: " + user.kandang.length + "/" + user.kandangCapacity + ")\n"
        if (user.kandang.length === 0) {
            replyText += "Kandang kosong! Tambahkan hewan dengan !addkandang <hewan>\n"
        } else {
            for (let animal of user.kandang) {
                const emoji = {
                    sapi: "🐄", banteng: "🐃", harimau: "🐅", gajah: "🐘", kambing: "🐐",
                    panda: "🐼", buaya: "🐊", kerbau: "🐂", monyet: "🐒", ayam: "🐓",
                    domba: "🐑", horse: "🐎"
                }[animal.type] || "🦒"
                replyText += `    ▢ ${emoji} *${animal.type}* - ${animal.fed ? "sehat" : "lapar"}\n`
            }
        }
        
        replyText += "\n*PRODUK KANDANG*\n"
        replyText += `    ▢ 🥛 Milk: ${user.products.milk}\n`
        replyText += `    ▢ 🧶 Wool: ${user.products.wool}\n`
        replyText += `    ▢ 🥚 Egg: ${user.products.egg}\n`
        replyText += `    ▢ 🌟 Golden Egg: ${user.products.goldenEgg}\n`
        
        replyText += "\n🎁 *BONUS AKTIF*\n"
        const bonuses = user.kandang.filter(a => a.fed).reduce((acc, a) => {
            if (a.type === "horse") acc.push("🏇 +10% kecepatan Adventure")
            if (a.type === "harimau") acc.push("🐅 +5% peluang menang Battle")
            return acc
        }, [])
        replyText += bonuses.length > 0 ? bonuses.join("\n") : "Tidak ada bonus (beri makan hewanmu!)"
        
        replyText += "\n\n> 🌾 Gunakan *!addkandang* untuk menambah hewan, *!carekandang* untuk merawat dan mengambil produk"
        m.reply(replyText)
    }
})