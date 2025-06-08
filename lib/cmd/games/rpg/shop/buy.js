commands.add({
    name: ["buy"],
    command: ["buy"],
    category: "rpg",
    desc: "Membeli barang di Pasar Bintang Jatuh",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        const now = Date.now()
        
        if (!args[0]) return m.reply("Barang apa yang ingin kamu beli?\n\n> *Contoh:* !buy potion 2")
        
        const itemInput = args[0].toLowerCase()
        const quantity = parseInt(args[1]) || 1
        if (quantity < 1) return m.reply("Jumlah harus lebih dari 0!")
        
        const shopItems = [
            { name: "potion", emoji: "🧪", type: "item", price: 500, field: "potion" },
            { name: "petFood", emoji: "🌾", type: "item", price: 300, field: "petFood" },
            { name: "limit", emoji: "⏳", type: "item", price: 1000, field: "limit" },
            { name: "wood", emoji: "🪵", type: "material", price: 100, field: "wood" },
            { name: "iron", emoji: "⛓️", type: "material", price: 200, field: "iron" },
            { name: "string", emoji: "🧵", type: "material", price: 150, field: "string" },
            { name: "dog", emoji: "🐶", type: "pet", price: 5000, field: "dog", minLevel: 5 },
            { name: "cat", emoji: "🐱", type: "pet", price: 5000, field: "cat", minLevel: 5 }
        ]
        
        const item = shopItems.find(i => i.name.toLowerCase() === itemInput)
        if (!item) return m.reply("Barang tidak tersedia!\n\n> Ketik *.shop* untuk melihat daftarnya")
        
        if (item.minLevel && user.level < item.minLevel) {
            return m.reply(`Kamu perlu level *${item.minLevel}* untuk membeli *${item.name}${item.emoji}*!`)
        }
        
        // cek cooldown untuk pembelian pet (1 jam = 3600000 ms)
        if (item.type === "pet" && user.lastbuy && now < user.lastbuy + 3600000) {
            const timeLeft = Math.ceil((user.lastbuy + 3600000 - now) / 1000 / 60)
            return m.reply(`Kamu baru saja membeli pet! Silahkan tunggu beberapa menit lagi\n\nTimeout : [ *${timeLeft}* ]`)
        }
        
        const price = Func.getDynamicPrice(item.price, user.level) * quantity
        if (user.money < price) {
            return m.reply(`Koinmu kurang! Harga ${item.emoji} *${item.name}* (x${quantity}): ${Func.formatUang(price)}, kamu punya: ${Func.formatUang(user.money)}`)
        }
        
        // narasi acak untuk pembelian
        const buyStories = {
            potion: [
                "Di kios ramuan yang dipenuhi asap warna-warni, penyihir tua menyerahkan 🧪 *Potion* dengan senyum licik. 'Minum ini, dan luka-lukamu lenyap!' katanya!",
                "Seorang alkemis di Pasar Bintang Jatuh menawarkan 🧪 *Potion* yang berkilau. Koinmu berpindah, dan ramuan ajaib itu kini milikmu!",
                "Tabib misterius mengintip dari tenda, menyerahkan 🧪 *Potion* sambil berbisik, 'Ini akan menyelamatkanmu di saat genting!'"
            ],
            petFood: [
                "Pedagang peternak dengan topi jerami menawarkan 🌾 *Pet Food*. 'Untuk teman setiamu!' katanya sambil menerima koinmu!",
                "Di sudut pasar, petani tua menyerahkan karung 🌾 *Pet Food*. 'Hewanmu akan menyukainya!' katanya dengan tawa hangat!",
                "Kamu bernegosiasi dengan pedagang makanan hewan. Dengan koin yang tepat, 🌾 *Pet Food* berkualitas kini ada di tanganmu!"
            ],
            limit: [
                "Seorang pedagang misterius dengan jubah berkilau menawarkan ⏳ *Limit*. 'Ini kunci untuk membuka pintu baru!' katanya, mengambil koinmu!",
                "Di kios yang diterangi lampu bintang, kamu membeli ⏳ *Limit*. Pedagang tersenyum, 'Gunakan dengan bijak, petualang!'",
                "Pedagang waktu di pasar menyerahkan ⏳ *Limit* dengan tatapan serius. Koinmu berpindah, dan akses baru kini milikmu!"
            ],
            wood: [
                "Tukang kayu dengan celemek lusuh memamerkan 🪵 *Wood* segar. Koinmu membuatnya tersenyum, dan kayu itu kini milikmu!",
                "Di kios kayu yang harum, kamu membeli 🪵 *Wood*. 'Buat senjata hebat!' kata pedagang dengan bangga!",
                "Penebang pohon menawarkan 🪵 *Wood* berkualitas. Koin berpindah, dan bahan crafting itu siap untuk petualanganmu!"
            ],
            iron: [
                "Pandai besi dengan otot kekar menunjukkan ⛓️ *Iron* hangat. Koinmu membuatnya mengangguk, dan besi itu milikmu!",
                "Penambang di pasar menawarkan ⛓️ *Iron* berkilau. Koinmu berpindah, dan logam kuat itu siap untuk crafting!",
                "Kamu bernegosiasi dengan pedagang besi. Dengan harga pas, ⛓️ *Iron* kini ada di tanganmu!"
            ],
            string: [
                "Penenun dengan jari lincah menawarkan 🧵 *String* kuat. Koinmu membuatnya tersenyum, dan tali itu kini milikmu!",
                "Di kios kain, kamu membeli 🧵 *String* lentur. 'Untuk petualangan besar!' kata pedagang dengan semangat!",
                "Pedagang tali menyerahkan 🧵 *String* berkualitas. Koinmu berpindah, dan bahan crafting itu siap digunakan!"
            ],
            dog: [
                "Di kandang pasar, 🐶 *Dog* menggonggong penuh semangat. Koinmu membuat peternak tersenyum, dan anjing setia itu kini mengikuti langkahmu!",
                "Pelatih hewan menawarkan 🐶 *Dog* gagah. Koinmu berpindah, dan teman baru ini siap berpetualang bersamamu!",
                "Kamu menemukan 🐶 *Dog* setia di pasar. Dengan koin yang tepat, dia kini menjadi sekutumu!"
            ],
            cat: [
                "Di kios hewan misterius, 🐱 *Cat* menatapmu dengan mata berkilau. Koinmu membuat pedagang mengangguk, dan kucing gesit itu kini milikmu!",
                "Penyihir hewan menawarkan 🐱 *Cat* anggun. Koinmu berpindah, dan teman lincah ini siap melindungimu!",
                "Kamu menemukan 🐱 *Cat* elegan di pasar. Dengan koin yang pas, kucing ini kini berjalan di sampingmu, penuh rahasia!"
            ]
        }
        
        // proses pembelian
        user.money -= price
        user[item.field] += quantity
        
        // berikan EXP untuk pembelian
        const expGain = item.type === "pet" ? 100 : quantity * 10
        Func.addExp(user, expGain)
        
        // set cooldown untuk pembelian pet
        if (item.type === "pet") {
            user.lastbuy = now
        }
        
        // simpan ke database
        db.users[userId] = user
        
        // balasan dengan narasi
        const story = buyStories[item.name][Math.floor(Math.random() * buyStories[item.name].length)]
        let replyText = `🛒 *PEMBELIAN BERHASIL!*\n\n`
        replyText += `${story.trim()}\n\n`
        replyText += `*MENDAPATKAN:*\n`
        replyText += `    ▢ ${item.emoji} *${item.name}* x${quantity}\n`
        replyText += `    ▢ ${expGain} EXP`
        replyText += `\n\n> Tersisa *${Func.formatUang(user.money)}*`        
        m.reply(replyText)
    }
})

