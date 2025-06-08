commands.add({
    name: ["ppcouple"],
    command: ["ppcouple"],
    category: "fun",
    alias: ["ppcp"],
    limited: true,
    desc: "random couple profile picture",
    run: async({ sius, m, args, Func }) => {
        try {
            let url = "https://raw.githubusercontent.com/siuspsrb/database/main/fun/pp_couple.json"
            let data = await Func.fetchJson(url)
            if (!Array.isArray(data)) return m.reply("[×] Data tidak tersedia atau format salah")
            let pick = Func.pickRandom(data)
            await m.reply({ image: { url: pick.male }})
            await m.reply({ image: { url: pick.female }})
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})