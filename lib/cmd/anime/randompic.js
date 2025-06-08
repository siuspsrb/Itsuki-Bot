commands.add({
    name: ["animepic"],
    command: ["animepic"],
    category: "anime",
    desc: "mengirimkan random anime picture",
    run: async({ sius,m, args, Func }) => {
        m.reply({ image: { url: "https://pic.re/image" }})
            .catch((e) => sius.cantLoad(e))
    }
})