commands.add({
    name: ["toaudio"],
    command: ["toaudio"],
    alias: ["tomp3"],
    category: "tools",
    desc: "mengubah video menjadi audio",
    param: "<reply video>",
    run: async ({ sius, m, args, Func }) => {
        try {
            if (!m.quoted)
                return m.reply("balas video yang ingin diubah ke audio")
            let buffer = await m.quoted.download()
            m.reply({ audio: buffer, mimetype: "audio/mpeg", ptt: false })
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})