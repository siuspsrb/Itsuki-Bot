export default {
    name: "family100",
    exec: async({ sius, m }) => {
        const family100 = db.game.family100
        if (!(m.chat in family100)) return;
        if (!m.quoted || m.quoted.id !== family100[m.chat].id) return;
        if (!m.text) return;
        const room = family100[m.chat]
        const teks = m.text.toLowerCase().replace(/[^\w\s\-]+/, "")
        const isSurender = /^((me)?nyerah|surr?ender)$/i.test(teks)
        if (!isSurender) {
            const index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, "") === teks)
            if (room.terjawab[index]) return;
            room.terjawab[index] = m.sender
        }
        const isWin = room.terjawab.length === room.terjawab.filter(v => v).length
        const caption = `Jawablah Pertanyaan Berikut :\n${room.soal}\n\n\nTerdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(" ")) ? `(beberapa Jawaban Terdapat Spasi)` : ""}\n${isWin ? `Semua Jawaban Terjawab` : isSurender ? "Menyerah!" : ""}\n${Array.from(room.jawaban, (jawaban, index) => {
            return isSurender || room.terjawab[index]
                ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? "@" + room.terjawab[index].split("@")[0] : ""}`
                : false
        }).filter(v => v).join("\n")}`
        await m.reply(caption.trim())
        if (isWin || isSurender) delete family100[m.chat]
    }
}