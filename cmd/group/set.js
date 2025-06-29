commands.add({
    name: ["setwelcome"],
    command: ["setwelcome"],
    desc: "Set custom welcome message untuk grup",
    category: "group",
    admin: true,
    group: true,
    run: async ({ sius, m, args }) => {
        if (!args.length) return m.reply("Masukkan teks welcome yang ingin diset!");
        const text = args.join(" ");
        const id = m.chat;
        if (!db.groups[id]) db.groups[id] = {};
        db.groups[id].setwelcome = text;
        m.reply(`[√] Welcome message berhasil disimpan:\n${text}`);
    }
});

commands.add({
    name: ["setleave"],
    command: ["setleave"],
    desc: "Set custom leave message untuk grup",
    category: "group",
    admin: true,
    group: true,
    run: async ({ sius, m, args }) => {
        if (!args.length) return m.reply("Masukkan teks leave yang ingin diset!");
        const text = args.join(" ");
        const id = m.chat;
        if (!db.groups[id]) db.groups[id] = {};
        db.groups[id].setleave = text;
        m.reply(`[√] Leave message berhasil disimpan:\n${text}`);
    }
});

commands.add({
    name: ["setpromote"],
    command: ["setpromote"],
    desc: "Set custom promote message untuk grup",
    category: "group",
    admin: true,
    group: true,
    run: async ({ sius, m, args }) => {
        if (!args.length) return m.reply("Masukkan teks promote yang ingin diset!");        
        const text = args.join(" ");
        const id = m.chat;
        if (!db.groups[id]) db.groups[id] = {};
        db.groups[id].setpromote = text;
        m.reply(`[√] Promote message berhasil disimpan:\n${text}`);
    }
});

commands.add({
    name: ["setdemote"],
    command: ["setdemote"],
    desc: "Set custom demote message untuk grup",
    category: "group",
    admin: true,
    group: true,
    run: async ({ sius, m, args }) => {
        if (!args.length) return m.reply("Masukkan teks demote yang ingin diset!");
        const text = args.join(" ");
        const id = m.chat;
        if (!db.groups[id]) db.groups[id] = {};
        db.groups[id].setdemote = text;
        m.reply(`[√] Demote message berhasil disimpan:\n${text}`);
    }
});

commands.add({
    name: ["adminonly"],
    command: ["adminonly"],
    description: "Aktifkan atau matikan mode admin only di grup",
    category: "group",
    group: true,
    admin: true,
    run: async ({ sius, m, args }) => {
        const mode = args[0] && args[0].toLowerCase();
        if (!mode || !["on", "off"].includes(mode)) {
            return m.reply("[×] Format salah! Pakai .adminonly on/off");
        }
        if (!db.groups[m.chat]) db.groups[m.chat] = {};
        db.groups[m.chat].adminonly = mode === "on";
        await m.reply(`[√] Mode admin only di grup ini sudah *${mode === "on" ? "diaktifkan" : "dinonaktifkan"}*.`);
    }
});