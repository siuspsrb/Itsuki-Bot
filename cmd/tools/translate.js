import translate from "translate-google-api";

commands.add({
    name: ["translate"],
    command: ["translate"],
    category: "tools",
    alias: ["tr"],
    run: async ({ sius, m, args }) => {
        if (args.length < 2) return m.reply("× Contoh: .translate en aku lapar");
        const lang = args[0];
        const text = args.slice(1).join(" ");
        try {
            const result = await translate(text, { to: lang });
            m.reply(`📍 Hasil translate ke *${lang}*:\n\n${result[0]}`);
        } catch (e) {
            sius.cantLoad(e);
            m.reply("× Gagal translate. Pastikan kode bahasa benar (contoh: en, id, ja, etc)");
        }
    }
});