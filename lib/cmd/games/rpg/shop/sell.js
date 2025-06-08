commands.add({
    name: ["sell"],
    command: ["jual","sell"],
    category: "rpg",
    desc: "Menjual barang di Pasar Bintang Jatuh",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId] 
        user.products = user.products || { milk: 0, wool: 0, egg: 0, goldenEgg: 0 }
                
        if (!args[0]) return m.reply("Barang apa yang ingin kamu jual?\n\n> *Contoh:* !sell sapi 2")
        
        const itemInput = args[0].toLowerCase()
        const quantity = parseInt(args[1]) || 1
        if (quantity < 1) return m.reply("Jumlah harus lebih dari 0!")
        
        const sellableItems = [
            { name: "sapi", emoji: "🐄", field: "sapi", price: 1000 },
            { name: "banteng", emoji: "🐃", field: "banteng", price: 1500 },
            { name: "harimau", emoji: "🐅", field: "harimau", price: 2000 },
            { name: "gajah", emoji: "🐘", field: "gajah", price: 2500 },
            { name: "kambing", emoji: "🐐", field: "kambing", price: 800 },
            { name: "panda", emoji: "🐼", field: "panda", price: 1800 },
            { name: "buaya", emoji: "🐊", field: "buaya", price: 1700 },
            { name: "kerbau", emoji: "🐂", field: "kerbau", price: 1200 },
            { name: "monyet", emoji: "🐒", field: "monyet", price: 600 },
            { name: "ayam", emoji: "🐓", field: "ayam", price: 400 },
            { name: "domba", emoji: "🐑", field: "domba", price: 700 },
            { name: "horse", emoji: "🐎", field: "horse", price: 2000 },
            { name: "wood", emoji: "🪵", field: "wood", price: 50 },
            { name: "iron", emoji: "⛓️", field: "iron", price: 100 },
            { name: "string", emoji: "🧵", field: "string", price: 75 },
            { name: "milk", emoji: "🥛", field: "products.milk", price: 200 },
            { name: "wool", emoji: "🧶", field: "products.wool", price: 150 },
            { name: "egg", emoji: "🥚", field: "products.egg", price: 100 },
            { name: "golden egg", emoji: "🌟", field: "products.goldenEgg", price: 1000 }
        ]
        
        const item = sellableItems.find(i => i.name.toLowerCase() === itemInput)
        if (!item) return m.reply("Barang tidak bisa dijual! Lihat daftar dengan !shop")
        
        // cek ketersediaan barang
        const itemValue = item.field.includes("products.") ? user.products[item.field.split(".")[1]] : user[item.field]
        if (itemValue < quantity) {
            return m.reply(`Kamu tidak punya cukup ${item.emoji} *${item.name}*! Kamu punya: ${itemValue}`)
        }
        
        // Narasi acak untuk penjualan
        const sellStories = {
            sapi: [
                "Kamu membawa 🐄 *Sapi* ke pedagang ternak. Dia memeriksanya dengan cermat, lalu menyerahkan koin dengan senyum lebar!",
                "Peternak di pasar menawar 🐄 *Sapi* milikmu. Koin berpindah tangan, dan sapi itu kini menjadi miliknya!",
                "Di tengah keramaian pasar, kamu menjual 🐄 *Sapi* kepada pedagang kaya. Koin emas mengalir ke sakumu!"
            ],
            banteng: [
                "Pedagang hewan besar mengagumi 🐃 *Banteng* milikmu. Koin emas berpindah, dan dia membawa banteng itu dengan bangga!",
                "Kamu menjual 🐃 *Banteng* ke peternak savana. Koin yang banyak membuatmu tersenyum lebar!",
                "Di kios ternak, 🐃 *Banteng* milikmu menarik perhatian. Pedagang menyerahkan koin, dan transaksi selesai!"
            ],
            harimau: [
                "Pemburu eksentrik membeli 🐅 *Harimau* milikmu. Koin emas mengalir, dan dia tersenyum penuh rahasia!",
                "Kamu menjual 🐅 *Harimau* ke kolektor hewan langka. Koin yang banyak membuat transaksi ini terasa epik!",
                "Di sudut pasar, 🐅 *Harimau* milikmu menarik pedagang kaya. Koin emas berpindah, dan harimau itu kini miliknya!"
            ],
            gajah: [
                "Pedagang eksotis memeriksa 🐘 *Gajah* milikmu dengan kagum. Koin emas bertumpuk berpindah ke tanganmu!",
                "Kamu menjual 🐘 *Gajah* ke kolektor binatang besar. Koin mengalir deras, dan transaksi ini legendaris!",
                "Di pasar ramai, 🐘 *Gajah* milikmu menjadi pusat perhatian. Pedagang kaya menyerahkan koin, dan gajah itu pergi!"
            ],
            kambing: [
                "Peternak kecil di pasar membeli 🐐 *Kambing* milikmu. Koin berpindah, dan dia tersenyum gembira!",
                "Kamu menjual 🐐 *Kambing* ke pedagang ternak. Koin mengisi sakumu, dan kambing itu punya rumah baru!",
                "Di kios hewan, 🐐 *Kambing* milikmu laku keras. Pedagang menyerahkan koin dengan tawa riang!"
            ],
            panda: [
                "Kolektor hewan langka menawar 🐼 *Panda* milikmu. Koin emas berpindah, dan panda itu kini miliknya!",
                "Kamu menjual 🐼 *Panda* ke pedagang eksotis. Koin yang banyak membuat transaksi ini istimewa!",
                "Di sudut pasar, 🐼 *Panda* milikmu menarik perhatian. Pedagang kaya menyerahkan koin, dan panda itu pergi!"
            ],
            buaya: [
                "Pemburu rawa membeli 🐊 *Buaya* milikmu. Koin emas mengalir, dan dia tersenyum dengan tatapan liar!",
                "Kamu menjual 🐊 *Buaya* ke kolektor reptil. Koin yang banyak membuat transaksi ini mendebarkan!",
                "Di kios hewan ganas, 🐊 *Buaya* milikmu laku keras. Pedagang menyerahkan koin dengan hati-hati!"
            ],
            kerbau: [
                "Peternak savana membeli 🐂 *Kerbau* milikmu. Koin berpindah, dan dia mengangguk puas!",
                "Kamu menjual 🐂 *Kerbau* ke pedagang ternak. Koin mengisi sakumu, dan kerbau itu punya pemilik baru!",
                "Di pasar ramai, 🐂 *Kerbau* milikmu menarik perhatian. Pedagang menyerahkan koin dengan senyum lebar!"
            ],
            monyet: [
                "Pedagang hewan kecil membeli 🐒 *Monyet* milikmu. Koin berpindah, dan dia tertawa melihat tingkah monyet itu!",
                "Kamu menjual 🐒 *Monyet* ke kolektor hewan cerdik. Koin mengalir, dan monyet itu kini punya rumah baru!",
                "Di kios hewan lincah, 🐒 *Monyet* milikmu laku keras. Pedagang menyerahkan koin dengan tawa riang!"
            ],
            ayam: [
                "Peternak unggas membeli 🐓 *Ayam* milikmu. Koin berpindah, dan dia tersenyum gembira!",
                "Kamu menjual 🐓 *Ayam* ke pedagang pasar. Koin mengisi sakumu, dan ayam itu kini punya pemilik baru!",
                "Di kios unggas, 🐓 *Ayam* milikmu laku keras. Pedagang menyerahkan koin dengan senyum lebar!"
            ],
            domba: [
                "Penenun di pasar membeli 🐑 *Domba* milikmu untuk bulunya. Koin berpindah, dan dia tersenyum puas!",
                "Kamu menjual 🐑 *Domba* ke pedagang ternak. Koin mengalir, dan domba itu kini punya rumah baru!",
                "Di kios hewan, 🐑 *Domba* milikmu menarik perhatian. Pedagang menyerahkan koin dengan tawa hangat!"
            ],
            horse: [
                "Pelatih kuda membeli 🐎 *Horse* milikmu. Koin emas berpindah, dan dia mengangguk kagum pada kecepatannya!",
                "Kamu menjual 🐎 *Horse* ke pedagang kuda. Koin yang banyak membuat transaksi ini epik!",
                "Di kandang pasar, 🐎 *Horse* milikmu menjadi pusat perhatian. Pedagang kaya menyerahkan koin, dan kuda itu pergi!"
            ],
            wood: [
                "Tukang kayu memeriksa 🪵 *Wood* milikmu. Koin berpindah, dan dia tersenyum puas dengan kualitasnya!",
                "Kamu menjual 🪵 *Wood* ke pedagang crafting. Koin mengalir, dan kayu itu kini siap untuk karya baru!",
                "Di kios kayu, 🪵 *Wood* milikmu laku keras. Pedagang menyerahkan koin, dan transaksi selesai!"
            ],
            iron: [
                "Pandai besi mengangguk puas melihat ⛓️ *Iron* milikmu. Koin emas berpindah, dan besi itu kini miliknya!",
                "Kamu menjual ⛓️ *Iron* ke pedagang logam. Koin yang banyak membuatmu tersenyum di pasar ramai!",
                "Di bengkel pasar, ⛓️ *Iron* milikmu laku keras. Pedagang menyerahkan koin, dan transaksi selesai!"
            ],
            string: [
                "Penenun memuji 🧵 *String* milikmu. Koin berpindah, dan tali itu kini siap untuk karya seni!",
                "Kamu menjual 🧵 *String* ke pedagang kain. Koin mengalir, dan tali itu kini punya pemilik baru!",
                "Di kios tali, 🧵 *String* milikmu menarik perhatian. Pedagang menyerahkan koin, dan transaksi selesai!"
            ],
            milk: [
                "Pedagang susu di pasar mencium aroma 🥛 *Milk* milikmu. Koin berpindah, dan dia tersenyum puas!",
                "Kamu menjual 🥛 *Milk* ke pembuat keju. Koin mengalir, dan susu segarmu kini jadi legenda pasar!",
                "Di kios makanan, 🥛 *Milk* milikmu laku keras. Pedagang menyerahkan koin dengan tawa riang!"
            ],
            wool: [
                "Penenun di pasar memuji 🧶 *Wool* milikmu. Koin berpindah, dan bulu itu kini siap jadi kain mewah!",
                "Kamu menjual 🧶 *Wool* ke pedagang tekstil. Koin mengalir, dan bulu lembutmu punya pemilik baru!",
                "Di kios kain, 🧶 *Wool* milikmu menarik perhatian. Pedagang menyerahkan koin dengan senyum lebar!"
            ],
            egg: [
                "Pedagang makanan membeli 🥚 *Egg* milikmu. Koin berpindah, dan telur segarmu siap jadi hidangan!",
                "Kamu menjual 🥚 *Egg* ke koki pasar. Koin mengisi sakumu, dan telur itu kini punya tujuan baru!",
                "Di kios makanan, 🥚 *Egg* milikmu laku keras. Pedagang menyerahkan koin dengan tawa hangat!"
            ],
            goldenEgg: [
                "Kolektor barang langka menawar 🌟 *Golden Egg* milikmu. Koin emas berpindah, dan telur itu jadi pusat perhatian!",
                "Kamu menjual 🌟 *Golden Egg* ke pedagang eksotis. Koin yang banyak membuat transaksi ini legendaris!",
                "Di sudut pasar, 🌟 *Golden Egg* milikmu memukau pedagang kaya. Koin emas mengalir deras ke sakumu!"
            ]
        }
        
        // proses penjualan, anjengggg
        const price = Func.getDynamicPrice(item.price, user.level) * quantity
        if (item.field.includes("products.")) {
            user.products[item.field.split(".")[1]] -= quantity
        } else {
            user[item.field] -= quantity
        }
        user.money += price
        
        // berikan EXP untuk penjualan
        const expGain = quantity * 10
        Func.addExp(user, expGain)
        
        // simpan ke database
        db.users[userId] = user
        
        // balasan dengan narasi, cape gw ajg
        const story = sellStories[item.name.toLowerCase()]?.[Math.floor(Math.random() * (sellStories[item.name.toLowerCase()]?.length || 1))] ||
                      `Kamu menjual ${item.emoji} *${item.name}* di Pasar Bintang Jatuh. Koin berpindah, dan transaksi selesai dengan lancar!`
        let replyText = `💰 *PENJUALAN BERHASIL!*\n\n`
        replyText += `${story.trim()}\n\n`
        replyText += `*🎁 MENDAPATKAN:*\n`
        replyText += `    ▢ ${Func.formatUang(price)}\n`
        replyText += `    ▢ +${expGain} EXP\n`
        replyText += `\n> *Saldo:* ${Func.formatUang(user.money)}`
        m.reply(replyText)
    }
})