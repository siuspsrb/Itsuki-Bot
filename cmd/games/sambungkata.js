import fetch from "node-fetch"

let kbbiList = []
let lastFetched = 0

const fetchKBBI = async () => {
    const now = Date.now()
    if (kbbiList.length && now - lastFetched < 1000 * 60 * 10) return kbbiList
    try {
        const res = await fetch("https://raw.githubusercontent.com/siuspsrb/database/main/game/kbbi.json")
        if (!res.ok) throw new Error("gagal ambil kbbi.json")
        const json = await res.json()
        kbbiList = json
        lastFetched = now
        return kbbiList
    } catch {
        return kbbiList.length ? kbbiList : []
    }
}

const random = list => list[Math.floor(Math.random() * list.length)]

async function getRandomKataAwal() {
    const kbbi = await fetchKBBI()
    const huruf = random(["a","b","c","d","e","g","h","i","j","k","l","m","n","p","r","s","t","u","w"])
    const hasil = kbbi.filter(v => v.startsWith(huruf))
    return random(hasil)
}

commands.add({
    name: ["sambungkata"],
    command: ["sambungkata"],
    category: "game",
    desc: "main sambung kata mode solo / multi",
    usage: "<start|solo|join|stop>",
    group: true,

    run: async ({ sius, m, args }) => {
        db.game = db.game || {}
        db.game.sambungkata = db.game.sambungkata || {}

        const subcmd = (args[0] || "").toLowerCase()
        const game = db.game.sambungkata[m.chat]

        if (subcmd === "start" || subcmd === "solo") {
            if (game) return m.reply("⚠️ masih ada game berjalan, ketik *.sambungkata stop* utk akhiri")

            const kataAwal = await getRandomKataAwal()
            db.game.sambungkata[m.chat] = {
                mode: subcmd === "solo" ? "solo" : "multi",
                kata: kataAwal,
                pemain: [m.sender],
                giliran: m.sender,
                point: { [m.sender]: 0 },
                waktu: Date.now()
            }

            return m.reply(
                `📘 *GAME SAMBUNG KATA ${subcmd === "solo" ? "SOLO" : "MULTI"}*\n▢ kata awal: *${kataAwal}*\n▢ tinggal kirim kata aja buat main\n${subcmd === "solo" ? "▢ mode solo, kamu main sendiri" : "▢ ketik *.sambungkata join* untuk ikut\n▢ giliran: @" + m.sender.split("@")[0]}`,
                { mentions: [m.sender] }
            )
        }

        if (subcmd === "join") {
            if (!game) return m.reply("⚠️ belum ada game aktif")
            if (game.mode === "solo") return m.reply("⚠️ game ini mode solo, kamu gk bisa join")
            if (game.pemain.includes(m.sender)) return m.reply("⚠️ kamu udah join")

            game.pemain.push(m.sender)
            game.point[m.sender] = 0
            return m.reply(`👥 @${m.sender.split("@")[0]} ikut bermain!`, {
                mentions: [m.sender]
            })
        }

        if (subcmd === "stop") {
            if (!game) return m.reply("⚠️ belum ada game aktif")

            const skor = Object.entries(game.point)
                .map(([id, point], i) => `${i+1}. @${id.split("@")[0]} ➜ ${point} poin`)
                .join("\n")

            delete db.game.sambungkata[m.chat]
            return m.reply(`🏁 *GAME ${game.mode === "solo" ? "SOLO" : "MULTI"} SELESAI*\n\n📊 Skor akhir:\n${skor}`, {
                mentions: Object.keys(game.point)
            })
        }

        // fallback: ga ada subcmd
        return m.reply("*SAMBUNG KATA*\n\n▢ *.sambungkata start* – mulai multiplayer\n▢ *.sambungkata solo* – main sendiri\n▢ *.sambungkata join* – gabung game\n▢ *.sambungkata stop* – akhiri game")
    }
})