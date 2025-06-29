commands.add({
    name: ["setdeskripsi"],
    command: ["setdeskripsi"],
    alias: ["setdesc","setdescription"],
    category: "group",
    desc: "Update group descriptions",
    admin: true,
    group: true,
    botAdmin: true,
    run: async ({ sius, m, args, Func, dl, command }) => {
        const text = args.join(" ")
        if (text) {
            await sius.groupUpdateDescription(m.chat, text);
            m.reply(`*Deskripsi Group Telah Di Ubah Menjadi* \n\n${text}`);
        } else {
            return m.reply(`Masukan deskripsi group nya contoh: \n.${command} Rules My Group`); 
        }
    }
})