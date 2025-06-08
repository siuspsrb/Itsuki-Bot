import { addPremiumUser, checkPremiumUser, getPremiumPosition } from "../../source/premium.js";

commands.add({
    name: ["jadipremium"],
    desc: "Upgrade ke pengguna premium (syarat: 1T money & 1 juta gold)",
    category: "user",
    command: ["jadipremium"],
    run: async({ sius, m, args }) => {
        const user = db.users[m.sender] || {};
        const requiredMoney = 1_000_000_000_000;
        const requiredGold = 1_000_000;
        if (user.premium)
            return m.reply("[√] Kamu sudah jadi pengguna Premium.");
        if (user.money < requiredMoney || user.gold < requiredGold) {
            return m.reply(`[×] Gagal upgrade Premium!\n\nSyarat:\n• Money: 1T\n• Gold: 1 Juta\n\nStatus kamu:\n• Money: ${user.money.toLocaleString()}\n• Gold: ${user.gold.toLocaleString()}`);
        }
        addPremiumUser(number, `30d`, db.premium);
        user.money -= requiredMoney;
        user.gold -= requiredGold;
        user.premium = true;
        db.users[m.sender] = user;
        m.reply("[√] Selamat! Kamu telah menjadi pengguna Premium selama 30 Hari 🎉");
    }
});

commands.add({
    name: ["premium"],
    command: ["premium"],
    alias: ["prem"],
    desc: "Lihat harga dan benefit menjadi pengguna premium",
    category: "info",
    run: async({ sius, m }) => {
        m.reply(`
╭─「 💎 *INFO PREMIUM* 」
│ 
│◦ 💰 *IN-GAME*: 
│  - Money: Rp. 1 Triliun 
│  - Gold: 1.000.000
│  - Command: *.jadipremium*
│ 
│◦ 🛒 *REAL-CASH*:
│  - Harga: Rp10.000/bulan
│  - Pembayaran: Dana / GoPay / QRIS
│  - Chat Owner: *.owner* untuk daftar
│
│◦ 🍁 *BENEFIT*:
│  - Akses fitur eksklusif
│  - Limit tak terbatas
│  - Akses NSFW AI (jika aktif)
│  - Role spesial: Premium User
│  - Prioritas request
╰───────⸙`);
    }
});