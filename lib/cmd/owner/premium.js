import { addPremiumUser, checkPremiumUser, getPremiumPosition } from "../../source/premium.js";

commands.add({
    name: ["listpremium"],
    command: ["listpremium"],
    alias: ["premlist","listprem"],
    category: "owner",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        try {
            let txt = `*───「 LIST PREMIUM 」───*\n\n`;
            const formatDate = (n, locale = 'id') => {
                let d = new Date(n);
                return d.toLocaleDateString(locale, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                });
            };
            db.premium.forEach(userprem => {
                const user = db.users[userprem.id];
                txt += `▢ *Nomor*: @${userprem.id.split("@")[0]}\n` +
                       `▢ *Limit*: ${user?.limit || 0}\n` +
                       `▢ *Uang*: ${(user?.uang || 0).toLocaleString("id-ID")}\n` +
                       `▢ *Expired*: ${formatDate(userprem.expired)}\n\n`;
            });
            await m.reply(txt);
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});

commands.add({
    name: ["+premium"],
    command: ["+premium"],
    alias: ["addpremium","+prem","addprem"],
    category: "owner",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        try {
            const [targetInput, duration] = args.join(" ").split("|").map(s => s.trim());
            if (!targetInput || !duration) {
                return m.reply(`*Contoh penggunaan:*\n.+premium @tag|waktu\n.+premium @${m.sender.split("@")[0]}|30 hari`);
            }            
            const number = Func.formatNumber(targetInput);
            const [onWa] = await sius.onWhatsApp(number);
            if (!onWa) return m.reply("Nomor tidak terdaftar di WhatsApp");           
            if (!db.users[number]) return m.reply("Nomor tidak terdaftar di bot");            
            const days = parseInt(duration.replace(/\D/g, ""));
            if (isNaN(days)) return m.reply("Format waktu tidak valid");            
            addPremiumUser(number, `${days}d`, db.premium);
            db.users[number].limit += db.users[number].vip ? config.limit.vip : config.limit.premium;
            db.users[number].uang += db.users[number].vip ? config.money.vip : config.money.premium;
            db.users[number].premium = true
            await m.reply(`Berhasil mengubah status @${number.split("@")[0]} menjadi premium selama ${duration}`);
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});

commands.add({
    name: ["-premium"],
    command: ["-premium"],
    alias: ["-prem"],
    category: "owner",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        try {
            const text = args.join(" ")
            const nmrnya = m.mentionedJid?.[0] || m.quoted?.sender || text?.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            if (!nmrnya) return m.reply("Stress?")
            if (db.users[nmrnya] && db.users[nmrnya].limit >= 0) {
            const number = Func.formatNumber(targetInput);
            const [onWa] = await sius.onWhatsApp(number);
            if (!onWa) return m.reply("[×] Nomor tidak terdaftar di WhatsApp");           
            if (!db.users[number]) return m.reply("[×] Nomor tidak terdaftar di bot");
                if (checkPremiumUser(nmrnya, premium)) {
                    db.premium.splice(getPremiumPosition(nmrnya, premium), 1);
                    m.reply(`[√] Sukses menghapus status premium @${nmrnya.split("@")[0]}`)
                    db.users[nmrnya].limit += db.users[nmrnya].vip ? config.limit.vip : config.limit.free
                    db.users[nmrnya].uang += db.users[nmrnya].vip ? config.money.vip : config.money.free
                    db.users[nmrnya].premium = false
                } else m.reply(`User @${nmrnya.split("@")[0]} Bukan Premium❗`)
            } else m.reply("[×] Nomor tidak terdaftar di BOT !")
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})
