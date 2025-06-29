import fetch from "node-fetch"

let kbbiList = []
let lastFetched = 0

const fetchKBBI = async () => {
    const now = Date.now()
    if (kbbiList.length && now - lastFetched < 1000 * 60 * 10) return kbbiList // cache 10 menit

    try {
        const res = await fetch("https://raw.githubusercontent.com/siuspsrb/database/main/game/kbbi.json")
        if (!res.ok) throw new Error("gagal ambil kbbi.json")
        const data = await res.json()
        kbbiList = data
        lastFetched = now
        return kbbiList
    } catch (e) {
        console.error("[sambungkata] gagal fetch kbbi:", e)
        return kbbiList.length ? kbbiList : []
    }
}

export default {
    name: "sambungkata",
    exec: async ({ m }) => {
        db.game = db.game || {}
        db.game.sambungkata = db.game.sambungkata || {}
        const game = db.game.sambungkata[m.chat]

        if (!game) return
        if (!m.text) return
        if (!game.pemain.includes(m.sender)) return

        const text = m.text.trim().toLowerCase()
        const lastChar = game.kata.slice(-1)
        if (!text.startsWith(lastChar)) return

        const kbbi = await fetchKBBI()
        if (!kbbi.includes(text)) return

        // === SOLO MODE ===
        if (game.mode === "solo") {
            game.kata = text
            game.point[m.sender] += 1
            return m.reply(`✅ benar!\n▢ lanjut huruf: *${text.slice(-1)}*\n▢ poin kamu: ${game.point[m.sender]}`)
        }

        // === MULTI MODE ===
        if (game.giliran !== m.sender) return
        game.kata = text
        game.point[m.sender] += 1

        const index = game.pemain.indexOf(m.sender)
        const next = game.pemain[(index + 1) % game.pemain.length]
        game.giliran = next

        return m.reply(`✅ benar!\n▢ kata selanjutnya huruf *${text.slice(-1)}*\n▢ poin kamu: ${game.point[m.sender]}\n▢ giliran berikutnya: @${next.split("@")[0]}`, {
            mentions: [next]
        })
    }
}