const user = (a) => "@" + a.split("@")[0]

commands.add({
    name: ["top"],
    command: ["top"],
    category: "fun",
    desc: "menampilkan top 5 random member berdasarkan teks",
    group: true,
    limited: true,
    run: async ({ sius, m, args, Func }) => {
        try {
            const text = args.join(" ")
            if (!text) return m.reply("contoh penggunaan:\n.top *paling ganteng*")
            const { pickRandom } = Func;
            const ps = m.metadata.participants.map(v => v.id)
            const a = pickRandom(ps)
            const b = pickRandom(ps)
            const c = pickRandom(ps)
            const d = pickRandom(ps)
            const e = pickRandom(ps)
            const x = pickRandom(['🤓','😅','😂','😳','😎','🥵','😱','🤑','🙄','💩','🍑','🤨','🥴','🔥','👇🏻','😔','👀','🌚'])
            const top = `*${x} Top 5 ${text} ${x}*\n\n1. ${user(a)}\n2. ${user(b)}\n3. ${user(c)}\n4. ${user(d)}\n5. ${user(e)}`
            m.reply(top)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})