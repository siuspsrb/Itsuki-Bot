commands.add({
    name: ["daftar","register"],
    command: ["daftar", "register"],
    category: "user",
    desc: "Daftar user untuk akses fitur lainnya",
    usage: "<daftar nama.umur>",
    example: "daftar Sius.17",
    register: false,
    limit: false,
    query: true,
    run: async ({ sius, m, text, args }) => {
        const user = db.users[m.sender]
        if (user.registered) return m.reply("🚩 Kamu sudah terdaftar sebelumnya!\n\nKetik *.unregister* jika ingin daftar ulang.")
        if (!text.includes(".")) {
            return m.reply(`⚠️Gunakan format: *${m.prefix}daftar nama.umur*\nContoh: *${m.prefix}daftar Yoh.17*`)
        }
        const [name, ageStr] = text.split(".")
        const age = parseInt(ageStr)
        if (!name) return m.reply("⚠️ Namamu tidak boleh kosong.")
        if (!age || isNaN(age)) return m.reply("⚠️ Umur harus berupa angka.")
        if (age < 5 || age > 100) return m.reply("⚠️ Umur harus di antara 5 sampai 100 tahun.")
        user.name = name
        user.age = age
        user.regTime = +new Date()
        user.registered = true
        sius.reply(m.chat, `✅ Pendaftaran berhasil!

📛 Nama: ${name}
🎂 Umur: ${age}
🆔 ID: ${m.sender.split("@")[0]}

Ketik *.profile* untuk melihat data kamu.`, "R E G I S T E R - U S E R", false)
    }
})

commands.add({
    name: ["unregister"],
    command: ["unregister", "hapusdata"],
    category: "user",
    desc: "Menghapus data profil kamu dari database",
    register: true,
    run: async ({ sius, m }) => {
        const user = db.users[m.sender]
        user.name = null
        user.age = -1
        user.regTime = -1
        user.registered = false
        sius.reply(m.chat, "✅ Kamu berhasil *unregister*.\nData profilmu telah dihapus.", "U N R E G I S T E R - U S E R", false)
    }
})