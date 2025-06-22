commands.add({
    name: ["feed"],
    command: ["feed"],
    category: "rpg",
    register: true,
    desc: "Memberi makan pet setiamu di Lembah Arvandor",
    run: async({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        if (!args[0]) return m.reply("[×] Pet mana yang ingin kamu beri makan?\n\n> *Contoh:* !feed dog")  
        const pet = args[0].toLowerCase()
        const validPets = ["dog", "cat", "fox", "horse"]  
        if (!validPets.includes(pet)) return m.reply("[×] Pet tidak dikenal!\n\n> Daftar pets: dog, cat, fox, dan horse")
        if (!user[pet]) return m.reply(`[×] Kamu belum memiliki ${pet}! Dapatkan di shop atau petualangan`)
        if (user.petFood < 1) return m.reply("[×] Kamu kehabisan pet food! Beli di shop dulu")
        const now = Date.now()
        const lastFeed = user[`${pet}lastfeed`] || 0
        if (now < lastFeed + 21600000) {
            const timeLeft = Math.ceil((lastFeed + 21600000 - now) / 1000 / 60)
            return m.reply(`[×] ${pet.toUpperCase()} masih masih kenyang! Tunggu beberapa menit lagi!\n\nTimeout : [ *${timeLeft}* ]`)
        }        
        const feedStories = {
            dog: [
                "Kamu melemparkan sepotong daging segar ke arah *Dog* milikmu. Dia melompat kegirangan, menggonggong keras, dan melahap makanannya dengan lahap! Bulunya berkilau, dan matanya penuh semangat!",
                "*Dog* milikmu mengendus pet food yang kamu keluarkan. Dengan ekor yang bergoyang-goyang, dia menyantapnya dan kemudian menjilat tanganmu sebagai tanda terima kasih!",
                "Di bawah pohon besar di Lembah Arvandor, kamu memberi makan *Dog* milikmu. Dia mengunyah dengan gembira, lalu menggali tanah dan menemukan koin kecil untukmu!"
            ],
            cat: [
                "Kamu menuangkan pet food ke mangkuk kecil. *Cat* milikmu meluncur dengan anggun, mencium makanannya, lalu memakannya dengan penuh percaya diri. Matanya yang berkilau menatapmu, seolah berkata 'baiklah, manusia, kamu boleh mengelusku sekarang'!",
                "*Cat* milikmu melompat ke pangkuanmu saat kamu menyiapkan pet food. Dengan gerakan halus, dia memakan makanannya, lalu meringkuk di sampingmu, mendengkur pelan!",
                "Di tepi sungai Arvandor, kamu memberi makan *Cat* milikmu. Dia memakan pet food dengan tenang, lalu melompat ke batu terdekat, seolah memamerkan keanggunannya!"
            ],
            fox: [
                "Kamu menaburkan pet food di tanah, dan *Fox* milikmu muncul dari semak-semak dengan mata cerdik. Dia melahap makanannya dengan cepat, lalu berputar-putar di sekitarmu, seolah merencanakan petualangan berikutnya!",
                "*Fox* milikmu mengintip dari balik pohon saat kamu menyiapkan pet food. Dengan gerakan licik, dia menyambar makanannya dan berlari ke semak, tapi kembali dengan sehelai daun emas di mulutnya!",
                "Di bawah cahaya bulan, kamu memberi makan *Fox* milikmu. Dia memakan pet food dengan penuh konsentrasi, lalu melompat ke pundakmu, seolah mengundangmu untuk menjelajah malam ini!"
            ],
            horse: [
                "Kamu menuangkan pet food ke palungan, dan *Horse* milikmu mendengus gembira. Dengan langkah megah, dia memakan makanannya, lalu menggosokkan kepalanya ke pundakmu, siap untuk berlari melintasi Lembah Arvandor!",
                "*Horse* milikmu meringkik saat melihat pet food. Dia memakan dengan penuh semangat, dan angin seolah bertiup lebih kencang, seakan merayakan kekuatannya yang kembali!",
                "Di padang rumput Arvandor, kamu memberi makan *Horse* milikmu. Dia memakan pet food dengan tenang, lalu berlari mengelilingimu, menimbulkan hembusan angin yang membawa aroma petualangan!"
            ]
        }
        user.petFood -= 1
        user[`${pet}lastfeed`] = now
        const expGain = Math.floor(Math.random() * 30) + 20
        Func.addPetExp(user, pet, expGain)
        db.users[userId] = user
        const story = feedStories[pet][Math.floor(Math.random() * feedStories[pet].length)]
        m.reply(`${story.trim()}\n\n🐾 *${pet.toUpperCase()}* mendapatkan *${expGain} EXP*! (Level: ${user[`${pet}Level`]} | EXP: ${user[`${pet}exp`]}/${Func.petExpToLevelUp(user[`${pet}Level`])})`)
    }
})