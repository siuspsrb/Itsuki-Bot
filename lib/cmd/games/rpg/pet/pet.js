commands.add({
    name: ["pet"],
    command: ["pet"],
    category: "rpg",
    desc: "Melihat status pet atau memilih pet untuk petualangan",
    run: async({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        if (!args[0]) {
            let petText = "🐾 *Kandang Pet di Lembah Arvandor*\n\n"
            const pets = ["dog", "cat", "fox", "horse"]
            let hasPet = false
            for (let pet of pets) {
                if (user[pet] > 0) {
                    hasPet = true
                    petText += `• *${pet.toUpperCase()}* (Level: ${user[`${pet}Level`]} | EXP: ${user[`${pet}exp`]}/${Func.petExpToLevelUp(user[`${pet}Level`])})\n`
                    petText += `  Terakhir diberi makan: ${user[`${pet}lastfeed`] ? new Date(user[`${pet}lastfeed`]).toLocaleTimeString() : "Belum pernah"}\n`
                }
            }
            if (!hasPet) {
                petText += "[×] Kamu belum punya pet! Dapatkan di shop atau petualangan!"
            } else {
                petText += `\nPet Food: ${user.petFood}\n`
                petText += `Pet Aktif: ${user.activePet ? user.activePet.toUpperCase() : "Tidak ada"}`
            }
            return m.reply(petText)
        }
        const pet = args[0].toLowerCase()
        const validPets = ["dog", "cat", "fox", "horse"]
        if (!validPets.includes(pet)) return m.reply("Pet tidak dikenal! Pilih: dog, cat, fox, atau horse")
        if (!user[pet]) return m.reply(`[×] Kamu belum memiliki ${pet}!`)
        const selectStories = {
            dog: "Kamu memanggil *Dog* milikmu. Dia berlari mendekat, menggonggong penuh semangat, siap menemanimu menjelajahi Lembah Arvandor! Ekornya bergoyang, seolah menjanjikan harta besar!",
            cat: "*Cat* milikmu melangkah anggun ke sampingmu, matanya berkilau penuh misteri. Dia mendengkur pelan, seolah berkata, 'Ayo, manusia, jangan buang waktuku!'",
            fox: "Dengan senyuman licik, *Fox* milikmu melompat dari bayang-bayang. Dia mengendus udara, seolah sudah mencium bau harta tersembunyi di Lembah Arvandor!",
            horse: "*Horse* milikmu meringkik keras, kakinya menginjak tanah dengan penuh kekuatan. Dia siap membawamu melintasi lembah dengan kecepatan kilat!"
        }
        user.activePet = pet
        db.users[userId] = user
        m.reply(`${selectStories[pet]}\n\n🐾 *${pet.toUpperCase()}* sekarang adalah pet aktifmu untuk petualangan!`)
    }
})