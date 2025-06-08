commands.add({
    name: ["setnamegroup"],
    command: ["setnamegroup"],
    alias: ["setnamegrup","setnamegc"],
    category: "group",
    desc: "Update group name",
    admin: true,
    group: true,
    botAdmin: true,
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (text) {
            await sius.groupUpdateSubject(m.chat, text);
            m.reply(`*Nama Group Telah Di Ubah Menjadi* \n\n${text}`);
        } else {
            return m.reply(`Masukan nama grup nya, contoh: \n.setnamegroup Itsuki Group`); 
        }
    }
})