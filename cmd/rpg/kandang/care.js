commands.add({
    name: ["carekandang"],
    command: ["carekandang"],
    category: "rpg",
    register: true,
    desc: "Merawat hewan dan mengambil produk di Kandang Bintang Liar",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        user.kandang = user.kandang || []
        user.products = user.products || { milk: 0, wool: 0, egg: 0, goldenEgg: 0 }
        user.kandangEfficiency = user.kandangEfficiency || 1.0
        user.kandangProduceCooldown = user.kandangProduceCooldown || 86400000
        const now = Date.now()        
        if (user.kandang.length === 0) {
            return m.reply("Kandangmu kosong! Tambahkan hewan dengan !addkandang")
        }        
        if (user.lastCare && now < user.lastCare + 43200000) {
            const timeLeft = Func.clockString(user.lastCare + 43200000 - now)
            return m.reply(`🌾 Hewan-hewanmu masih kenyang! Rawat lagi dalam ${timeLeft}`)
        }        
        const foodNeeded = user.kandang.length
        if (user.petFood < foodNeeded) {
            return m.reply(`Kamu tidak punya cukup 🌾 *Pet Food*! Perlu: ${foodNeeded}, Kamu punya: ${user.petFood}\n\n> Ketil *. buy pet food* untuk membelinya!`)
        }        
        const { products, updatedKandang } = calculateAnimalProducts(user.kandang, now, user.kandangEfficiency, user.kandangProduceCooldown)
        user.kandang = updatedKandang
        user.products.milk += products.milk
        user.products.wool += products.wool
        user.products.egg += products.egg
        user.products.goldenEgg += products.goldenEgg
        user.totalProducts = (user.totalProducts || 0) + products.milk + products.wool + products.egg + products.goldenEgg        
        user.petFood -= foodNeeded
        for (let animal of user.kandang) {
            animal.fed = true
        }        
        const expGain = foodNeeded * 20
        Func.addExp(user, expGain)
        if (user.activePet) {
            Func.addPetExp(user, user.activePet, Math.floor(expGain * 0.5))
        }        
        user.lastCare = now
        db.users[userId] = user        
        const careStories = [
            `Kamu menyebar 🌾 *Pet Food* di Kandang Bintang Liar. Hewan-hewanmu berlarian gembira, menghasilkan produk berlimpah! ${user.activePet ? `*${user.activePet.toUpperCase()}* membantu menggiring mereka!` : ""}`,
            `Di bawah sinar matahari Arvandor, kamu merawat hewan-hewanmu dengan 🌾 *Pet Food*. Ladang dipenuhi suara bahagia dan produk baru! ${user.activePet ? `*${user.activePet.toUpperCase()}* berlari di sampingmu!` : ""}`,
            `Kamu bekerja keras di Kandang Bintang Liar, memberi 🌾 *Pet Food* ke hewan-hewanmu. Mereka membalas dengan produk berharga! ${user.activePet ? `*${user.activePet.toUpperCase()}* mengawasi dengan setia!` : ""}`
        ]        
        const story = careStories[Math.floor(Math.random() * careStories.length)]
        let replyText = `🌾 *KANDANG DIRAWAT!*\n\n`
        replyText += `${story.trim()}\n\n`
        replyText += `🎁 PRODUK DIAMBIL:\n`
        if (products.milk > 0) replyText += `    ▢ 🥛 Milk: ${products.milk}\n`
        if (products.wool > 0) replyText += `    ▢ 🧶 Wool: ${products.wool}\n`
        if (products.egg > 0) replyText += `    ▢ 🥚 Egg: ${products.egg}\n`
        if (products.goldenEgg > 0) replyText += `    ▢ 🌟 Golden Egg: ${products.goldenEgg}\n`
        replyText += `\n💥 BIAYA:\n`
        replyText += `    ▢ 🌾 Pet Food: ${foodNeeded}\n`
        replyText += `    ▢ ${expGain} EXP\n`
        if (user.activePet) replyText += `    ▢ *${user.activePet.toUpperCase()}* mendapatkan ${Math.floor(expGain * 0.5)} EXP\n`
        replyText += `\n🧺 TOTAL PRODUK: \n🥛 ${user.products.milk}, 🧶 ${user.products.wool}, 🥚 ${user.products.egg}, 🌟 ${user.products.goldenEgg}`        
        m.reply(replyText)
    }
})

// fungsi menghitung produk hewan, hyzer ganteng uy
function calculateAnimalProducts(kandang, now, efficiency, produceCooldown) {
    const products = { milk: 0, wool: 0, egg: 0, goldenEgg: 0 }
    const updatedKandang = []    
    for (let animal of kandang) {
        if (animal.fed && now >= animal.lastProduce + produceCooldown) {
            const productAmount = Math.floor(efficiency) + (Math.random() < (efficiency % 1) ? 1 : 0)
            switch (animal.type) {
                case "sapi":
                case "kerbau":
                    products.milk += productAmount
                    break
                case "domba":
                case "kambing":
                    products.wool += productAmount
                    break
                case "ayam":
                    products.egg += productAmount
                    if (Math.random() < 0.05 * efficiency) products.goldenEgg += 1 // efisiensi meningkatkan peluang
                    break
            }
            animal.lastProduce = now
        }
        updatedKandang.push(animal)
    }    
    return { products, updatedKandang }
}