commands.add({
    name: ["alay"],
    command: ["alay"],
    category: "fun",
    desc: "ubah teks jadi alay random",
    run: async ({ sius, m, args }) => {
        try {
            let teks = args.join(" ") || (m.quoted && m.quoted.text) || m.text
            if (!teks) return m.reply("Masukkan teksnya!")
            let alay = teks
                .replace(/[a-z]/gi, v =>
                    Math.random() > 0.5
                        ? v[["toLowerCase", "toUpperCase"][Math.floor(Math.random() * 2)]]()
                        : v
                )
                .replace(/[abegiors]/gi, v => {
                    if (Math.random() > 0.5) return v
                    switch (v.toLowerCase()) {
                        case "a": return "4"
                        case "b": return Math.random() > 0.5 ? "8" : "13"
                        case "e": return "3"
                        case "g": return Math.random() > 0.5 ? "6" : "9"
                        case "i": return "1"
                        case "o": return "0"
                        case "r": return "12"
                        case "s": return "5"
                        default: return v
                    }
                })
            m.reply(alay)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})