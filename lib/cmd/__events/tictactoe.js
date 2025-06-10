import { TicTacToe } from "../../source/game.js"

export default {
    name: "tictactoe-handler",
    exec: async ({ sius, m }) => {
        if (!m.text || !m.isGroup) return;
        let tictactoe = db.game.tictactoe
        const room = Object.values(tictactoe).find(room =>
            room?.id?.startsWith("tictactoe") &&
            room?.game && room?.state === "PLAYING" &&
            [room.game.playerX, room.game.playerO].includes(m.sender)
        )
        if (!room) return;
        const parseMention = (text = '') => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }
        const now = Date.now()
        if (now - (room.lastMove || now) > 5 * 60 * 1000) {
            await m.reply("⏰ Game *TicTacToe* dibatalkan karena tidak ada aktivitas dalam 5 menit.")
            delete tictactoe[room.id]
            return
        }
        room.lastMove = now
        const surrenderRegex = /^(me)?nyerah|surr?ender|off|skip$/i
        const validInputRegex = /^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i
        if (!validInputRegex.test(m.text)) return;
        let isSurrender = surrenderRegex.test(m.text)
        if (m.sender !== room.game.currentTurn && !isSurrender) return;
        if (!(room.game instanceof TicTacToe)) {
            room.game = Object.assign(new TicTacToe(room.game.playerX, room.game.playerO), room.game)
        }
        let ok
        if (!isSurrender) {
            ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1)
            if (ok < 1) {
                const responses = {
                    "-3": "❌ Game telah berakhir.",
                    "-2": "❌ Input tidak valid.",
                    "-1": "❌ Posisi sudah diisi.",
                      0: "❌ Posisi tidak valid."
                }
                await m.reply(responses[ok] || "Error")
                return;
            }
        } else {
            room.game._currentTurn = m.sender === room.game.playerX
        }
        const arr = room.game.render().map(v => ({
            X: "❌", O: "⭕",
            1: "1️⃣", 2: "2️⃣", 3: "3️⃣",
            4: "4️⃣", 5: "5️⃣", 6: "6️⃣",
            7: "7️⃣", 8: "8️⃣", 9: "9️⃣"
        }[v]))
        const isWin = m.sender === room.game.winner || isSurrender
        const isTie = room.game.board === 511 && !isWin
        let winner = isWin ? room.game.currentTurn : null
        let text = `🎮 Room ID: *${room.id}*\n\n${arr.slice(0, 3).join("")}\n${arr.slice(3, 6).join("")}\n${arr.slice(6).join("")}\n\n`
        if (isWin) {
            db.users[m.sender].limit += 3
            db.users[m.sender].money += 3000
            text += `🎉 @${winner.split("@")[0]} Menang!\n`
        } else if (isTie) {
            text += `🤝 Game berakhir seri!\n`
        } else {
            const turn = ["❌", "⭕"][1 * room.game._currentTurn]
            const user = room.game.currentTurn.split("@")[0]
            text += `🎯 Giliran ${turn} (@${user})\n`
        }
        text += `\n❌: @${room.game.playerX.split("@")[0]}\n⭕: @${room.game.playerO.split("@")[0]}\n\nKetik *nyerah* untuk menyerah.`
        if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
            room[room.game._currentTurn ^ isSurrender ? "x" : "o"] = m.chat
        const quoted = { quoted: m }
        if (room.x !== room.o) await sius.sendMessage(room.x, { text, mentions: parseMention(text) }, quoted)
        await sius.sendMessage(room.o, { text, mentions: parseMention(text) }, quoted)
        if (isTie || isWin) delete tictactoe[room.id]
    }
}