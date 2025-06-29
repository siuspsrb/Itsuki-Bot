commands.add({
    name: ["iqc"],
    command: ["iqc"],
    category: "maker",
    usage: "<text>",
    limit: 5,
    cooldown: 30,
    query: true,
    desc: "generate quote dengan gambar aesthetic dari teks yang diberikan",
    run: async({ sius, m, args, Func }) => {
        let txt = args.join(" ")
        if (!txt) return m.reply("*Contoh penggunaan:* .igc Hei, it's okay to be hurt!") // quote by hyzer 🤕
        if (txt.length > 80) return m.reply("Max. 80 karakter")
        m.reply({ image: { url: "https://flowfalcon.dpdns.org/imagecreator/iqc?text=" + encodeURIComponent(txt)}})
            .catch((e) => sius.cantLoad(e))
    }
})