commands.add({
    name: ["pocket","money"],
    command: ["pocket","money","dompet"],
    category: "user",
    desc: "Informasi jumlah money yang kamu miliki!",
    run: async({ sius, m, args, Func }) => {
        const nonaAmbon = db.users[m.sender] || []
        m.reply(`> 💰: *${Func.formatUang(nonaAmbon.money || "0")}*`)
            .catch((e) => sius.cantLoad(e))
    }
})