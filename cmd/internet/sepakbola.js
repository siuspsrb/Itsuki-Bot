commands.add({
    name: ["sepakbola"],
    command: ["sepakbola"],
    desc: "Jadwal sepak bola lengkap",
    limited: true,
    category: "internet",
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            const result = await dl.SepakBola()
            if (result.message) {
                return m.reply(result.message)
            }
            let message = "Jadwal Sepak Bola Hari Ini:\n\n"
            result.slice(0, 15).forEach((match, index) => {
                message += `➠ 📅 *Match ${index + 1}:* ${match}\n`
            })
            m.reply(message)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})