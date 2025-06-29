commands.add({
    name: ["purba"],
    command: ["purba"],
    category: "fun",
    desc: "ubah huruf vokal jadi lebih purba (tambah 've')",
    run: async ({ sius, m, args }) => {
        try {
            let teks = args.join(" ") || (m.quoted && m.quoted.text) || m.text
            if (!teks) return m.reply("Masukkan teks dulu ya")

            let hasil = teks.replace(/[aiueo]/gi, "$&ve")
            m.reply(hasil)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})