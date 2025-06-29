commands.add({
    name: ["joke"],
    command: ["joke"],
    alias: ["jokes"],
    category: "fun",
    desc: "Funny random jokes",
    run: async({ sius, m, args, Func }) => {
        await Func.fetchJson("https://api.some-random-api.com/joke")
            .then((zer) => m.reply(zer.joke))
            .catch((e) => sius.cantLoad(e))
    }
})