commands.add({
    name: ["animepic"],
    command: ["animepic"],
    category: "anime - image",
    desc: "mengirimkan random anime picture",
    cooldown: 15,
    limit: 5,
    run: async({ sius,m, args, Func }) => {
        m.reply({ image: { url: "https://pic.re/image" }})
    }
})