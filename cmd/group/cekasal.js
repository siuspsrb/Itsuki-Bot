commands.add({
    name: ["cekasalmember"],
    command: ["cekasalmember"],
    category: "group",
    desc: "menampilkan jumlah member berdasarkan asal negara",
    group: true,
    run: async ({ sius, m }) => {
        const participants = await sius.groupMetadata(m.chat).then(res => res.participants)

        let countIndonesia = 0
        let countMalaysia = 0
        let countUSA = 0
        let countOther = 0

        for (const p of participants) {
            const phone = p.id.split("@")[0]
            if (phone.startsWith("62")) countIndonesia++
            else if (phone.startsWith("60")) countMalaysia++
            else if (phone.startsWith("1")) countUSA++
            else countOther++
        }

        const msg = `▢ *Jumlah Anggota Grup Berdasarkan Negara:*\n\n` +
                    `🇮🇩 Indonesia: *${countIndonesia}*\n` +
                    `🇲🇾 Malaysia: *${countMalaysia}*\n` +
                    `🇺🇸 USA: *${countUSA}*\n` +
                    `🌍 Lainnya: *${countOther}*`

        m.reply(msg)
    }
})