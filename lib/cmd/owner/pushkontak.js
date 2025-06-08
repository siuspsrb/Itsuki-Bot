commands.add({
    name: ["pusukontak"],
    command: ["pushkontak"],
    category: "owner",
    owner: true,
    group: true,
    param: "<text>",    
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        if (!text) return m.reply("[×] Sertakan teksnya ya")
        let mem = m.metadata.participants.filter(v => v.id.endsWith(".net")).map(v => v.id);
        m.reply(`*[√] Mengirim pesan ke ${mem.length} orang, estimasi selesai ${mem.length * 6} detik.*`)
        for (let id of mem) {
            await Func.sleep(6000)
            await sius.sendMessage(id, { text })
                .catch((e) => sius.cantLoad(e))
        }
        m.reply(`*[√] Berhasil mengirim pesan ke ${mem.length} akun.*`);
    },
    //[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]
    desc: "mengirim pesan promosi kontak ke semua member grup"
})