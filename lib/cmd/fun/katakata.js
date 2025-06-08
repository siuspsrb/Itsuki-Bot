commands.add({
    name: ["bucin","bijak","dare","truth"],
    command: ["bucin","bijak","dare","truth"],
    category: "fun",
    desc: "random quotes by category",
    run: async({ sius, m, args, Func }) => {
        try {
            let url = `https://raw.githubusercontent.com/siuspsrb/database/main/fun/${m.command}.json`
            let res = await Func.fetchJson(url)
            if (!Array.isArray(res)) return m.reply("[×] Data tidak tersedia atau format json salah")
            let random = res[Math.floor(Math.random() * res.length)]
            m.reply(`*${m.command.toUpperCase()}*\n\n${random}`)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})