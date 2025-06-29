commands.add({
    name: ["readviewonce"],
    command: ["readviewonce"],
    alias: ["rvo"],
    category: "tools",
    run: async({ sius, m }) => {
        try {
            if (m.quoted) {
                let buff = await m.quoted.download()
                let type = m.quoted.type
                if (type === "videoMessage") {
                    await sius.sendMessage(m.chat, { video: buff, caption: m.quoted.text || "" }, { quoted: m });
                } else if (type === "imageMessage") {
                    await sius.sendMessage(m.chat, { image: buff, caption: m.quoted.text || "" }, { quoted: m });
                } else if (type === "audioMessage") {
                    await sius.sendMessage(m.chat, { audio: buff, mimetype: "audio/mpeg", ptt: m.quoted.ptt || false }, { quoted: m });
                } else {
                    m.reply("❌ Media bermasalah.")
                }
            } else {
                m.reply("Reply viewonce yang ingin diliat dengan caption !readviewonce")
            }
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})