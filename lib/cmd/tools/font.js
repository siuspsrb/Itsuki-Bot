commands.add({
    name: ["font"],
    command: ["font"],
    alias: ["styletext"],
    category: "tools",
    run: async ({ sius, m, args, Func, dl }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`*Contoh penggunaan:* .font halo dunia`)
        try {
            const results = await dl.styleText(text)
            if (!results.length) return m.reply("Gagal mendapatkan style font, coba lagi nanti.")
            let replyText = `*Hasil styling teks:*\n\n`
            results.slice(0, 10).forEach((r, i) => {
                replyText += `${i + 1}. ${r.text}\n`
            })
            m.reply(replyText)
        } catch (e) {
            sius.cantLoad(e)
        }
    },
  desc: "Memberikan font unik yang bermacam-macam",
})