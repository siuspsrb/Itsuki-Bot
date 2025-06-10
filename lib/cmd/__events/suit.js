export default {
    name: "suit_handler",
    exec: async({ sius, m }) => {
        const suit = db.game.suit;
        const roof = Object.values(suit).find(v => v.id && v.status && [v.p, v.p2].includes(m.sender));
        if (!roof || !m.text) return;
        const now = Date.now();
        if (now - (roof.lastMove || now) > 3 * 60 * 1000) {
            m.reply("Game Suit dibatalkan karena tidak ada aktivitas selama 3 menit.");
            delete suit[roof.id];
            return;
        }
        roof.lastMove = now;
        const text = m.text.toLowerCase();
        const isGroup = m.isGroup;
        const isP = m.sender === roof.p;
        const isP2 = m.sender === roof.p2;
        const reg = /^(gunting|batu|kertas)/i;
        if (isP2 && isGroup && roof.status === "wait" && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(text)) {
            if (/^(tolak|gamau|nanti|n|ga(k.)?bisa)/i.test(text)) {
                m.reply(`@${roof.p2.split("@")[0]} menolak suit,\nsuit dibatalkan`);
                delete suit[roof.id];
                return;
            }
            roof.status = "play";
            roof.asal = m.chat;
            m.reply(`Suit telah dikirimkan ke chat\n\n@${roof.p.split("@")[0]} dan @${roof.p2.split("@")[0]}\n\nSilahkan pilih suit di chat masing-masing klik https://wa.me/${botNumber.split("@")[0]}`);
            if (!roof.pilih) sius.sendMessage(roof.p, {
                text: `Silahkan pilih\n\nBatu🗿\nKertas📄\nGunting✂️\n\n> *Cukup balas tanpa emoji ya!*`
            }, { quoted: m });
            if (!roof.pilih2) sius.sendMessage(roof.p2, {
                text: `Silahkan pilih\n\nBatu🗿\nKertas📄\nGunting✂️\n\n> *Cukup balas tanpa emoji ya!*`
            }, { quoted: m });
            return;
        }
        if (isP && reg.test(text) && !roof.pilih && !isGroup) {
            roof.pilih = reg.exec(text)[0];
            roof.text = m.text;
            m.reply(`Kamu telah memilih ${m.text}${!roof.pilih2 ? "\n\nMenunggu lawan memilih" : ""}`);
            if (!roof.pilih2) sius.sendMessage(roof.p2, { text: "_Lawan sudah memilih_\nSekarang giliran kamu" });
            return;
        }
        if (isP2 && reg.test(text) && !roof.pilih2 && !isGroup) {
            roof.pilih2 = reg.exec(text)[0];
            roof.text2 = m.text;
            m.reply(`Kamu telah memilih ${m.text}${!roof.pilih ? "\n\nMenunggu lawan memilih" : ""}`);
            if (!roof.pilih) sius.sendMessage(roof.p, { text: "_Lawan sudah memilih_\nSekarang giliran kamu" });
            return;
        }
        if (roof.pilih && roof.pilih2) {
            let win = "";
            const tie = roof.pilih === roof.pilih2;
            const rules = { batu: "gunting", gunting: "kertas", kertas: "batu" };
            if (!tie) {
                win = rules[roof.pilih] === roof.pilih2 ? roof.p : roof.p2;
            }
            const pemenang = tie ? null : win;
            const userWin = db.users[pemenang];
            if (userWin) {
                userWin.limit += tie ? 0 : 3;
                userWin.money += tie ? 0 : 3000;
            }
            sius.sendMessage(roof.asal, {
                text: `*HASIL SUIT ${tie ? "\nSERI*" : "*"}\n\n` + `@${roof.p.split("@")[0]} (${roof.text})${tie ? "" : roof.p === win ? " Menang" : " Kalah"}\n` + `@${roof.p2.split("@")[0]} (${roof.text2})${tie ? "" : roof.p2 === win ? " Menang" : " Kalah"}\n\n` + `${tie ? "" : "*Pemenang Mendapatkan*\nUang: Rp 3.000 💸\nLimit: 3 ⚡"}`.trim(),
                mentions: [roof.p, roof.p2]
            }, { quoted: m });
            delete suit[roof.id];
        }
    }
};