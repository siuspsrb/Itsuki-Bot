commands.add({
    name: ["recipes"],
    command: ["recipes"],
    category: "rpg",
    register: true,
    desc: "Melihat resep crafting di Lembah Arvandor",
    run: async({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]        
        const recipes = [
            {
                name: "Wooden Sword",
                item: "sword",
                materials: { wood: 5, iron: 2 },
                durability: 100,
                desc: "Pedang kayu sederhana, tapi cukup tajam untuk petualangan awal"
            },
            {
                name: "Iron Pickaxe",
                item: "pickaxe",
                materials: { wood: 3, iron: 5 },
                durability: 150,
                desc: "Pilih besi yang kokoh untuk menambang di gua-gua Arvandor"
            },
            {
                name: "Fishing Rod",
                item: "fishingrod",
                materials: { wood: 4, string: 3 },
                durability: 100,
                desc: "Joran pancing untuk menangkap ikan di sungai Arvandor"
            },
            {
                name: "Leather Armor",
                item: "armor",
                materials: { string: 5, iron: 3 },
                durability: 120,
                desc: "Armor kulit yang memberikan perlindungan dasar"
            },
            {
                name: "Magic Wand",
                item: "magicWand",
                materials: { wood: 2, diamond: 1, emerald: 1 },
                durability: 80,
                desc: "Tongkat suling yang memancarkan energi mistis"
            }
        ]
        
        let replyText = "📜 *RESEP CRAFTING DI LEMBAH ARVANDOR*\n\n"
        for (let recipe of recipes) {
            replyText += `🔨 *${recipe.name.toUpperCase()}*\n`
            replyText += `▢ *Deskripsi:* ${recipe.desc}\n`
            replyText += `▢ *Item:* ${recipe.item.toUpperCase()}\n`
            replyText += `▢ *Durabilitas:* ${recipe.durability}\n`
            replyText += `▢ *Bahan:*\n`
            for (let [material, amount] of Object.entries(recipe.materials)) {
                replyText += `    - ${material}: ${amount}\n`
            }
            replyText += "\n"
        }        
        replyText += "\n> Gunakan !craft <nama_item> untuk membuat!, *Contoh :* !craft wooden sword"
        m.reply(replyText)
    }
})
   // otak gw cape mikirin ide nya ajg, hargai dong, dgn jgn asal comot trs klaim buatan sendiri!

commands.add({
    name: ["craft"],
    command: ["craft"],
    category: "rpg",
    register: true,
    desc: "Menempa item legendaris di Lembah Arvandor",
    run: async({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        if (!args[0]) return m.reply("🧤 Item apa yang ingin kamu buat? \n\n> Ketik *.recipes* untik melihat resep !!")        
        const itemInput = args.join(" ").toLowerCase()
        const recipes = [
            {
                name: "wooden sword",
                item: "sword",
                materials: { wood: 5, iron: 2 },
                durability: 100,
                stories: [
                    "Kamu berdiri di depan Pandai Besi Mistis, apinya menyala terang dengan nafas naga kuno. Dengan ketukan palu yang bergema, kayu dan besi menyatu menjadi *Wooden Sword* yang kokoh, siap mengantar petualanganmu!",
                    "Di bengkel tua di tepi Lembah Arvandor, kamu mengukir kayu dengan hati-hati dan menempa besi di tungku panas. Asap membumbung, dan *Wooden Sword* lahir, bergetar dengan energi baru!",
                    "Pandai besi tua mengamati kerjamu dengan mata tajam. Saat kamu memadukan kayu dan besi, kilatan petir menyambar langit, dan *Wooden Sword* yang sempurna terbentuk di tanganmu!"
                ]
            },
            {
                name: "iron pickaxe",
                item: "pickaxe",
                materials: { wood: 3, iron: 5 },
                durability: 150,
                stories: [
                    "Di dalam gua yang diterangi obor, kamu menempa *Iron Pickaxe* di atas landasan kuno. Setiap pukulan palu menggema, seolah membangunkan roh-roh gua untuk memberkati alatmu!",
                    "Tukang Kayu Kuno membantumu memahat gagang kayu, sementara besi cair dituangkan dengan hati-hati. *Iron Pickaxe* yang kuat kini terbentuk, siap menaklukkan batu-batu Arvandor!",
                    "Dengan keringat di dahi, kamu menempa besi di bengkel terpencil. Cahaya bulan menyelinap melalui celah-celah, dan *Iron Pickaxe* yang megah tercipta, menjanjikan hasil tambang besar!"
                ]
            },
            {
                name: "fishing rod",
                item: "fishingrod",
                materials: { wood: 4, string: 3 },
                durability: 100,
                stories: [
                    "Di tepi Sungai Arvandor yang berkilau, kamu menganyam tali dan mengukir kayu dengan penuh kesabaran. Angin berbisik, dan *Fishing Rod* yang sempurna kini ada di tanganmu, siap menangkap ikan legendaris!",
                    "Seorang nelayan tua di desa mengajarimu merangkai *Fishing Rod*. Saat tali terakhir diikat, burung-burung beterbangan, seolah merayakan alat pancingmu yang baru!",
                    "Di bawah pohon willow, kamu menyusun kayu dan tali dengan hati-hati. Sungai seolah bernyanyi, dan *Fishing Rod* yang kuat terbentuk, memanggil ikan-ikan dari kedalaman!"
                ]
            },
            {
                name: "leather armor",
                item: "armor",
                materials: { string: 5, iron: 3 },
                durability: 120,
                stories: [
                    "Di bengkel kulit yang dipenuhi aroma tanin, kamu menjahit tali dan memasang pelat besi. *Leather Armor* yang kokoh kini melindungimu, seolah diberkati oleh roh pelindung Arvandor!",
                    "Seorang pengrajin tua membantumu membentuk *Leather Armor*. Setiap jahitan disertai mantra perlindungan, dan armor itu bersinar lembut, siap menahan serangan musuh!",
                    "Dengan tangan penuh luka, kamu menyelesaikan *Leather Armor* di bawah langit malam. Bintang-bintang seolah tersenyum, dan armor itu terasa seperti pelukan dari Lembah Arvandor!"
                ]
            },
            {
                name: "magic wand",
                item: "magicWand",
                materials: { wood: 2, diamond: 1, emerald: 1 },
                durability: 80,
                stories: [
                    "Di menara Penyihir Artefak, kamu memadukan kayu, berlian, dan zamrud di atas lingkaran sihir. Kilatan cahaya membutakan, dan *Magic Wand* yang penuh kekuatan mistis lahir di tanganmu!",
                    "Penyihir tua memandumu saat kamu menempa *Magic Wand*. Angin berputar di sekitarmu, dan tongkat itu bergetar, seolah roh kuno telah merasuk ke dalamnya!",
                    "Di puncak bukit Arvandor, kamu menciptakan *Magic Wand* dengan mantra kuno. Langit berderu, dan tongkat itu menyala, siap melepaskan sihir yang mengubah takdir!"
                ]
            }
        ]        
        const recipe = recipes.find(r => r.name.toLowerCase() === itemInput)
        if (!recipe) return m.reply("⚠️ Resep tidak dikenal!\n\n> Ketik *.recipes* untuk melihat daftar !!")        
        // cek materials
        if (!hasEnoughMaterials(user, recipe)) {
            let missing = ""
            for (let [material, amount] of Object.entries(recipe.materials)) {
                if (user[material] < amount) {
                    missing += `▢ *${material}:* ${amount - user[material]} lagi\n`
                }
            }
            return m.reply(`⚠️ Bahan kurang!\n\nKamu perlu:\n${missing}`)
        }        
        // peluang sukses dan bonus
        const success = Math.random() > 0.1 // 90% peluang sukses
        const bonusQuality = Math.random() > 0.9 // 10% peluang bonus durabilitas        
        let replyText = ""
        if (success) {
            // kurangi materials
            consumeMaterials(user, recipe)            
            // tambahkan item
            user[recipe.item] += 1
            const durability = bonusQuality ? Math.floor(recipe.durability * 1.2) : recipe.durability
            user[`${recipe.item}durability`] = durability
            user[`${recipe.item}maxdurability`] = durability            
            // berikan EXP
            const expGain = Math.floor(Math.random() * 50) + 30
            Func.addExp(user, expGain)            
            // pilih narasi acak
            const story = recipe.stories[Math.floor(Math.random() * recipe.stories.length)]           
            replyText = `[√] *CRAFTING BERHASIL!*\n\n${story.trim()}\n\n`
            replyText += `▢ *+${recipe.name.toUpperCase()}* (Durabilitas: ${durability})\n`
            replyText += `▢ +${expGain} EXP\n`
            replyText += `\n> Ketik *${m.prefix}drop untuk membuang senjata!\n`
            if (bonusQuality) {
                replyText += `✨ *Kualitas Luar Biasa!* Item ini lebih tahan lama dari biasanya!\n`
            }
        } else {
            // gagal ajg: kehilangan 50% materials
            for (let [material, amount] of Object.entries(recipe.materials)) {
                user[material] -= Math.floor(amount / 2)
                if (user[material] < 0) user[material] = 0
            } // wkwk alaiii          
            replyText = `⚠️ *CRAFTING GAGAL!*\n\n`
            replyText += "Palu terpeleset, tungku meledak, atau sihir menjadi kacau! Sayangnya, proses crafting gagal, dan setengah dari bahanmu lenyap dalam asap. Coba lagi lain kali, petualang!\n"
        }
        // zimpan ke database
        db.users[userId] = user
        m.reply(replyText)
    }
})

commands.add({
    name: ["weapon"],
    command: ["weapon"],
    category: "rpg",
    register: true,
    desc: "mengecek status senjata dan alatmu",
    run: async ({ sius, m, args }) => {
        const user = db.users[m.sender]
        const items = [
            { name: "Wooden Sword", key: "sword" },
            { name: "Iron Pickaxe", key: "pickaxe" },
            { name: "Fishing Rod", key: "fishingrod" },
            { name: "Magic Wand", key: "magicWand" }
        ]
        let txt = "*STATUS PERALATAN KAMU*\n\n"
        let ist = false
        for (let item of items) {
            if (user[item.key] && user[`${item.key}durability`] > 0) {
                ist = true
                txt += `▢ *${item.name}*\n`
                txt += `   - Durabilitas: ${user[`${item.key}durability`]}/${user[`${item.key}maxdurability`]}\n`
            }
        }
        if (!ist) txt += "\n> Kamu belum punya peralatan apapun !!";
        m.reply(txt)
    }
})

// fungsi cek apakah materials cukup
function hasEnoughMaterials(user, recipe) {
    for (let [material, amount] of Object.entries(recipe.materials)) {
        if (user[material] < amount) {
            return false
        }
    }
    return true
}

// fungsi kurangi materials setelah crafting
function consumeMaterials(user, recipe) {
    for (let [material, amount] of Object.entries(recipe.materials)) {
        user[material] -= amount
    }
}