// ==============================
// GROUP RENTAL/EXPIRED FEATURES
// ==============================

commands.add({
    name: ["addexpired", "addsewa"],
    command: ["addexpired", "addsewa"],
    desc: "Tambahkan masa expired/sewa grup (dalam hari)",
    category: "group",
    owner: true,
    group: true,
    query: true,
    example: "1 hari 2 minggu 1 bulan, ...",
    usage: "<s/m/h/d/m/y", // detik, menit, jam, hari, 
    run: async ({ sius, m, text }) => { // bulan, tahun 
        const id = m.chat; 
        // bebas mo gmn, g hrus lengkap formatnya
        const now = Date.now();
        const ms = parseTime(text)
        const expiredTime = now + ms
        if (!db.groups[id]) db.groups[id] = {};
        global.db.groups[id].expired = expiredTime;
        if (!global.db.sewa) global.db.sewa = [];
        if (!db.sewa.includes(id)) db.sewa.push(id);
        const expiredDate = new Date(expiredTime).toLocaleDateString('id', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        m.reply(`✅ Berhasil menambahkan sewa grup selama ${text}\n⏰ Berakhir pada: ${expiredDate}`);
    }
});

commands.add({
    name: ["cekexpired", "ceksewa"],
    command: ["cekexpired", "ceksewa"],
    desc: "Cek masa aktif sewa grup",
    category: "group",
    group: true,
    admin: true,
    run: async ({ sius, m }) => {
        const id = m.chat;
        if (!global.db.groups[id]?.expired) return m.reply("⚠️ Grup ini tidak terdaftar dalam list sewa!");
        const remaining = global.db.groups[id].expired - Date.now();
        const daysLeft = Math.ceil(remaining / (1000 * 60 * 60 * 24));
        const expiredDate = new Date(global.db.groups[id].expired).toLocaleDateString('id', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        m.reply(`⏳ Masa sewa grup:\n📅 Sisa: ${daysLeft} hari\n⏰ Berakhir: ${expiredDate}`);
    }
});

commands.add({
    name: ["listsewa"],
    command: ["listsewa"],
    desc: "Lihat daftar grup yang sedang disewa",
    category: "owner",
    owner: true,
    run: async ({ sius, m }) => {
        if (!global.db.sewa?.length) return m.reply("❌ Tidak ada grup yang sedang disewa!");
        let list = "📋 DAFTAR GRUP SEWA:\n\n";
        const now = Date.now();
        for (const groupId of global.db.sewa) {
            if (global.db.groups[groupId]?.expired) {
                const remaining = global.db.groups[groupId].expired - now;
                const daysLeft = Math.ceil(remaining / (1000 * 60 * 60 * 24));
                const groupName = global.db.groups[groupId].name || groupId;
                list += `📌 *${groupName}*\n⏳ Sisa: ${daysLeft} hari\n\n`;
            }
        }
        m.reply(list);
    }
});

commands.add({
    name: ["delexpired", "delsewa"],
    command: ["delexpired", "delsewa"],
    desc: "Hapus masa expired/sewa grup",
    category: "group",
    owner: true,
    group: true,
    run: async ({ sius, m }) => {
        const id = m.chat;
        if (!global.db.groups[id]?.expired) {
            return m.reply("⚠️ Grup ini tidak memiliki masa sewa!");
        }
        delete global.db.groups[id].expired;
        global.db.sewa = global.db.sewa.filter(g => g !== id);
        m.reply("✅ Berhasil menghapus masa sewa grup");
    }
});

function parseTime(text) {
    const timeUnits = {
        detik: 1000,
        sekon: 1000,
        second: 1000,
        seconds: 1000,
        menit: 60000,
        minute: 60000,
        minutes: 60000,
        jam: 3600000,
        hour: 3600000,
        hours: 3600000,
        hari: 86400000,
        day: 86400000,
        days: 86400000,
        minggu: 604800000,
        week: 604800000,
        weeks: 604800000,
        bulan: 2592000000,
        month: 2592000000,
        months: 2592000000,
        tahun: 31536000000,
        year: 31536000000,
        years: 31536000000
    }
    const parts = text.toLowerCase().split(/\s+/)
    let totalMs = 0
    for (let i = 0; i < parts.length; i++) {
        const num = parseInt(parts[i])
        if (isNaN(num)) continue
        const unit = parts[i + 1]
        if (!unit || !timeUnits[unit]) continue
        totalMs += num * timeUnits[unit]
        i++
    }
    return totalMs
}