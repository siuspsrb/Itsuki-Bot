commands.add({
    name: ["namaninja", "namae"],
    command: ["namaninja", "namae"],
    category: "fun",
    desc: "ubah teks jadi nama ninja ala jepang",
    run: async ({ sius, m, args }) => {
        try {
            let teks = args.join(" ") || (m.quoted && m.quoted.text) || m.text
            if (!teks) return m.reply("masukin nama dulu dong")

            let res = teks.replace(/[a-z]/gi, v => {
                return {
                    "a": "ka", "b": "tu", "c": "mi", "d": "te", "e": "ku",
                    "f": "lu", "g": "ji", "h": "ri", "i": "ki", "j": "zu",
                    "k": "me", "l": "ta", "m": "rin", "n": "to", "o": "mo",
                    "p": "no", "q": "ke", "r": "shi", "s": "ari", "t": "ci",
                    "u": "do", "v": "ru", "w": "mei", "x": "na", "y": "fu",
                    "z": "zi"
                }[v.toLowerCase()] || v
            })

            m.reply(res)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})