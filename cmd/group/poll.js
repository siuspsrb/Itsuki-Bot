commands.add({
    name: ["poll", "polling"],
    command: ["poll", "polling"],
    category: "group",
    desc: "Buat polling dengan beberapa pilihan.",
    group: true,
    run: async ({ m, text }) => {
        let args = text.split("\n").map(x => x.trim())
        let title = args[0]
        let options = args.slice(1)
        if (!title) {
            return m.reply(`Contoh penggunaan:\n.poll Siapa karakter favoritmu?\nItsuki\nMiku\nNino\nIchika\nYotsuba`)
        }
        if (options.length < 2) {
            return m.reply(`Polling membutuhkan minimal 2 pilihan.\n\nContoh:\n.poll Pilih salah satu:\nKucing\nAnjing`)
        }
        m.reply({
            poll: {
                name: title,
                values: options,
                selectableCount: true
            }
        })
    }
})