import { iGame } from "../../lib/game.js"
import similarity from "similarity"
import fs from "fs/promises"

export default {
    name: "game-handler",
    exec: async ({ sius, m, Func }) => {
        if (!m.text) return false;
        const {
            tekateki, tebaklirik, tebaklagu, tebakkata, 
            kuismath, susunkata, tebakkimia, 
            caklontong, tebakangka, tebaknegara,
            tebakgambar, tebakbendera, asahotak, 
            siapakahaku, tebakanime
        } = db.game
        const games = {
            tebaklirik, tekateki, tebaklagu, tebakkata, 
            kuismath, susunkata, tebakkimia, 
            caklontong, tebakangka, tebaknegara,
            tebakgambar, tebakbendera, asahotak, 
            siapakahaku, tebakanime
        }
        const budy = typeof m.text === "string" ? m.text.toLowerCase() : ""
        const almost = 0.72
        for (const name in games) {
            const game = games[name]
            const id = iGame(game, m.chat)
            const session = game[m.chat + id]
            if (!id || !session || !m.quoted || m.quoted.id !== id) continue
            const answer = session.jawaban.toString().toLowerCase()
            const userAns = budy
            if (name === "kuismath") {
                if (isNaN(userAns)) continue
                const mode = session.mode || "noob"
                const scale = { noob: 1, easy: 1.5, medium: 2.5, hard: 4, extreme: 5, impossible: 6, impossible2: 7 }[mode] || 1
                const reward = scale * 50
                const penalty = scale * 10
                if (userAns === answer) {
                    db.users[m.sender].point += reward
                    await m.reply({ sticker: await fs.readFile("./lib/database/benar.webp") })
                    await m.reply(`*+${reward} Point*`)
                    delete game[m.chat + id]
                    return true
                } else {
                    db.users[m.sender].point -= penalty
                    await m.reply({ sticker: await fs.readFile("./lib/database/salah.webp") })
                    await m.reply(`*-${penalty} Point*`)
                    return true;
                }
            } else {
                const fuzzy = /tekateki|tebaklirik|tebaklagu|tebakkata|tebaknegara|tebakbendera|asahotak|siapakahaku|tebakanime/.test(name)
                const isCorrect = fuzzy ? similarity(userAns, answer) >= almost : userAns === answer
                const bonus = {
                    caklontong: 500,
                    tebaklirik: 350,
                    susunkata: 234,
                    asahotak: 175,
                    tebakanime: 1000
                }[name] || 150
                if (isCorrect) {
                    db.users[m.sender].point += bonus
                    await m.reply({ sticker: await fs.readFile("./lib/database/benar.webp") })
                    await m.reply(`*+${bonus} Point*`)
                    delete game[m.chat + id]
                    return true;
                } else {
                    db.users[m.sender].point -= bonus
                    await m.reply({ sticker: await fs.readFile("./lib/database/salah.webp") })
                    await m.reply(`*-${bonus} Point*`)
                    return true;
                }
            };
        }
        return false;
    }
}