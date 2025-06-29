export default {
    name: "family100",
    exec: async ({ sius, m }) => {
        const family100 = db.game.family100
        if (!(m.chat in family100)) return false
        if (!m.quoted || m.quoted.id !== family100[m.chat].id) return false
        if (!m.text) return false
        const room = family100[m.chat]
        const teks = m.text.toLowerCase().replace(/[^\w\s\-]+/, "")
        const isSurender = /^((me)?nyerah|surr?ender)$/i.test(teks)
        if (!isSurender) {
            const index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, "") === teks)
            if (index === -1 || room.terjawab[index]) return true // jawaban salah atau udah dijawab
            room.terjawab[index] = m.sender
        }
        const isWin = room.terjawab.length === room.terjawab.filter(v => v).length
        const caption = `Jawablah Pertanyaan Berikut:\n${room.soal}\n\n` +
            `Terdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(" ")) ? `(beberapa jawaban mengandung spasi)` : ""}\n` +
            `${isWin ? "✅ Semua Jawaban Terjawab!" : isSurender ? "🚩 Menyerah!" : ""}\n\n` +
            room.jawaban.map((jawaban, index) => {
                return (isSurender || room.terjawab[index])
                    ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? "@" + room.terjawab[index].split("@")[0] : ""}`
                    : false
            }).filter(v => v).join("\n")
        await m.reply(caption.trim())
        if (isWin || isSurender) delete family100[m.chat]
        return true
    }
}