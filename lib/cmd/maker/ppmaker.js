commands.add({
    name: ["horny","jail","triggered","wasted"],
    command:["horny","jail","triggered","wasted"],
    category: "maker",
    desc: "generate funny editor from your profiles",
    run: async({ sius, m, args, Func }) => {
        const id = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
        let pp = await sius.profilePictureUrl(id, "image").catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60')
        let url = `https://some-random-api.com/canvas/${m.command}?avatar=${encodeURIComponent(pp)}`
        m.reply({ image: { url }})
    }
})