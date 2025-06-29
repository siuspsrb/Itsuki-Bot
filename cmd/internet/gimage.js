commands.add({
    name: ["googleimage","searchimage"],
    command: ["googleimage","searchimage"],
    alias: ["gimage"],
    category: "internet",
    param: "<keyword>",
    desc: "Search any pictures!",
    limit: true,
    run: async ({ sius, m, args, Func, dl }) => {
        let text = args.join(" ")
        if (!text) return m.reply(`*Contoh penggunaan:* !googleimage Ariana Grande\n\n> Masukkan text yang ingin dicari !`)
        const res = await dl.googleImage(text)      
        const Index = Math.floor(Math.random() * res.length);
        const image = res[Index];
        m.reply({ image: { url: image }})
            .catch((e) => sius.cantLoad(e))
    }
})