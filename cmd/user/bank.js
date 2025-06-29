commands.add({
    name: ["bank"],
    command: ["bank"],
    category: "user",
    desc: "Melihat kekayaan petualang di Bank Arvandor",
    register: true,
    run: async ({ sius, m, Func }) => {
        const userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
        let user = db.users[userId]
        if (!user) return m.reply("[×] User belum terdaftar di database bot")
        const now = Date.now()
        const bankStories = [`Kamu membuka *Gulungan Bank Arvandor*, dan cahaya emas memperlihatkan kekayaanmu!  Eh, tunggu... ada debu laba-laba juga?`,`Di ruang bawah tanah Bank Arvandor, *Gulungan Emas* mencatat harta petualang!  Ternyata, harta terbesarmu adalah kenangan manis bersama teman-temanmu. (Dan beberapa koin tembaga yang ketinggalan).`,`*Gulungan Bank Arvandor* terbuka, mengungkap harta yang kamu simpan dengan aman!  ...atau setidaknya, itu yang kamu kira.  Rupanya ada tikus yang membangun sarang di situ.`,`Aroma harum bunga melati menyambutmu saat kamu membuka *Gulungan Bank Arvandor*.  Ternyata, ada lebah yang membangun sarang madu di dalam gulungan!  Kekayaan tak terduga! (Tapi hati-hati sengatannya!)`,
  `Kamu menemukan *Gulungan Bank Arvandor* terkubur di bawah tumpukan baju kotor.  Harta karunmu masih ada di sana, meskipun sedikit... berbau.`,`Seorang gnome mungil bersembunyi di balik *Gulungan Bank Arvandor*.  Ia menawarkanmu teh herbal dan berbisik tentang harta rahasia yang jauh lebih besar.`,`*Gulungan Bank Arvandor* tiba-tiba mengeluarkan asap berwarna-warni!  Rupanya, kamu menyimpan kembang api di dalamnya.  Waktunya pesta kembang api!`,`Kamu membuka *Gulungan Bank Arvandor* dan... kosong?  Jangan panik!  Ternyata hartamu tersembunyi di tempat rahasia yang hanya kamu tahu.  *Bisik-bisik* mungkin di balik lukisan nenek moyangmu yang sedikit menyeramkan.`,`*Gulungan Bank Arvandor* bernyanyi!  Ya, benar, bernyanyi!  Lagu tentang kekayaanmu yang melimpah ruah, dengan sedikit sentuhan opera yang dramatis.`,`Kamu menemukan *Gulungan Bank Arvandor*... di dalam perut seekor naga?  Jangan khawatir, naganya ramah kok.  Dan dia bersedia membagi hartanya. (Setelah kamu menyikat giginya dulu).`]
        Func.addExp(user, 5)
        db.users[userId] = user
        let bankText = `${bankStories[Math.floor(Math.random() * bankStories.length)]}\n\n`
        bankText += `*KEKAYAAN PETUALANG [🧙]*\n`
        bankText += `▢ Nama: ${user.name} (@${m.sender.split("@")[0]})\n`
        bankText += `▢ Gelar: ${user.title}\n\n`
        bankText += `*HARTA DIMILIKI [💰]*\n`
        bankText += `▢ Money: ${Func.formatUang(user.money)}\n`
        bankText += `▢ Ramuan: ${user.potion}\n`
        bankText += `▢ Berlian: ${user.diamond}\n`
        bankText += `▢ Zamrud: ${user.emerald}\n`
        bankText += `▢ Limit : ${user.limit}\n`
        bankText += `▢ Point : ${user.point}\n`
        // kirim pesan
        await m.reply(bankText, {
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "🏦 B A N K - A R V A N D O R",
                    thumbnailUrl: "https://i.pinimg.com/originals/c1/d9/76/c1d976cf2c1b2a66658715488a60fa16.jpg",
                    mediaUrl: "https://i.pinimg.com/originals/c1/d9/76/c1d976cf2c1b2a66658715488a60fa16.jpg",
                    mediaType: 1,
                    previewType: "PHOTO",
                    sourceUrl: null,
                    renderLargerThumbnail: true
                }
            }
        })
    }
})