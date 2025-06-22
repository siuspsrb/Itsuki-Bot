commands.add({
    name: ["quotes"],
    command: ["quotes"],
    category: "fun",
    desc: "random motivational quote",
    run: async({ sius, m, args, Func }) => {
        try {
            let url = "https://raw.githubusercontent.com/siuspsrb/database/main/fun/quotes.json"
            let data = await Func.fetchJson(url)
            if (!Array.isArray(data)) return m.reply("[×] data tidak tersedia atau format salah")
            let pick = Func.pickRandom(data)
            let text = `*QUOTE BIJAK*\n\n"${pick.quotes}"\n\n— ${pick.author}`
            m.reply(text)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})