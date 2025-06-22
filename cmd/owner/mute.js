commands.add({
    name: ["mute"],
    command: ["mute"],
    category: "owner",
    owner: true,
    group: true,
    desc: "Mute terhadap group tertentu",
    run: async ({ sius, m, args, Func }) => {
        try {
            db.groups[m.chat].mute = true
			m.reply("[√] Bot telah di mute di grup ini!")
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});

commands.add({
    name: ["unmute"],
    command: ["unmute"],
    category: "owner",
    owner: true,
    group: true,
    desc: "Menghilangkan mute terhadap group tertentu",
    run: async ({ sius, m, args, Func }) => {
        try {
            db.groups[m.chat].mute = false
			m.reply("[√] Sukses unmute!")
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});