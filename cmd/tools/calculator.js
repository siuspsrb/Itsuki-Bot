commands.add({
    name: ["calculator"],
    command: ["calculator"],
    category: "tools",
    alias: ["kalkulator","hitung"],
    param: "<soal>",
    desc: "Menghitung soal matematika sederhana",
    run: async ({ sius, m, args }) => {
        try {
            if (!args[0]) return m.reply("Sertakan soal matematika (contoh: .math 2 * 3)!")
            const expression = args.join(" ").trim()
            const validExpression = expression.match(/^\d+\s*[\+\-\*/]\s*\d+$/);
            if (!validExpression) return m.reply("Soal harus berupa operasi matematika sederhana (contoh: 2 + 3 atau 5 * 4)!")
            let result;
            try {
                result = eval(expression);
                if (isNaN(result) || !isFinite(result)) return m.reply("Hasil tidak valid")
            } catch (evalErr) {
                 return m.reply("Soal tidak bisa dihitung")
            }
            const mathMsg = `*▢ Soal:* ${expression}\n*▢ Hasil:* ${result}`;
            await m.reply(mathMsg);
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})