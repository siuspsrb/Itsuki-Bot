commands.add({
    name: ["report", "lapor"],
    command: ["report", "lapor"],
    category: "info",
    desc: "Mengirim laporan atau permintaan ke owner bot",
    alias: ["req", "lap"],
    run: async ({ sius, m, args }) => {
        let text = args.join(" ")
        try {
            if (!text) return await sius.reply(m.chat, "Mau lapor apa ke Owner? \n\n> Contoh: .report Bug di fitur X", config.bot.name, false);
            await sius.reply(m.chat, "*Laporan Telah Terkirim Ke Owner*\n\n> Terima Kasih🙏", global.config.bot.name, false, { mentions: [m.sender] });
            await sius.sendFromOwner(config.owner, `▢ *Laporan Baru*\n▢ Dari: @${m.sender.replace(/[^0-9]/g, "")}\n▢ Isi: ${text}`, m, { contextInfo: { mentionedJid: [m.sender], isForwarded: true }});
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});

