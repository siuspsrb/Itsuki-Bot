commands.add({
    name: ["join"],
    command: ["join"],
    category: "owner",
    desc: "Memasukkan bot ke dalam grup menggunakan tautan undangan.",
    param: "<link undangan whatsapp>",
    owner: true,
    run: async ({ sius, m, args }) => {
        const text = args[0]
        const i = `[×] Masukkan tautan grup yang valid!`
        if (!text || !text.includes("chat.whatsapp.com/")) return m.reply(i)
        const groupId = text.split("chat.whatsapp.com/")[1]?.split(" ")[0]
        if (!groupId) return m.reply(i)
        try {
            const result = await sius.groupAcceptInvite(groupId)
            const pending = `[√] Permintaan bergabung sedang diproses oleh admin grup.`
            m.reply(result ? config.mess.success : pending)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})