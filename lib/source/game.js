import { 
    sleep, 
    clockString, 
    formatUang,
    pickRandom
} from "./functions.js"

const rdGame = (bd, id, tm) => Object.keys(bd).find(a => a.startsWith(id) && a.endsWith(tm));
const iGame = (bd, id) => (a => a && bd[a].id)(Object.keys(bd).find(a => a.startsWith(id)));
const tGame = (bd, id) => (a => a && bd[a].time)(Object.keys(bd).find(a => a.startsWith(id)));

const gameCasinoSolo = async (conn, m, db) => {
	try {
		let buatall = 1
		const botNumber = await conn.decodeJid(conn.user.id)
		let randomaku = `${Math.floor(Math.random() * 101)}`.trim()
		let randomkamu = `${Math.floor(Math.random() * 81)}`.trim()
		let Aku = (randomaku * 1)
		let Kamu = (randomkamu * 1)
		let count = m.args[0]
		count = count ? "all" === count ? Math.floor(db.users[m.sender].uang / buatall) : parseInt(count) : m.args[0] ? parseInt(m.args[0]) : 1
		count = Math.max(1, count)
		if (m.args.length < 1) return m.reply("[×] Sertakan jumlah taruhannya!")
		if (isNaN(m.args[0])) return m.reply("[×] Sertakan jumlah taruhannya!")
		if (db.users[m.sender].money >= count * 1) {
			db.users[m.sender].limit -= 1
			db.users[m.sender].money -= count * 1
			db.set[botNumber].money += count * 1
			if (Aku > Kamu) {
				m.reply(`*💰 C A S I N O*\n\n▢ *Kamu:* ${Kamu} Point\n▢ *Bot:* ${Aku} Point\n▢ *Hasil:* Kalah\n\nKamu kehilangan *${formatUang(count)}*`.trim())
			} else if (Aku < Kamu) {
				db.users[m.sender].money += count * 2
				m.reply(`*💰 C A S I N O*\n\n▢ *Kamu:* ${Kamu} Point\n▢ *Bot:* ${Aku} Point\n▢ *Hasil:* Menang\n\nKamu mendapatkan *${formatUang(count * 2)}*`.trim())
			} else {
				db.users[m.sender].uang += count * 1
				m.reply(`*💰 C A S I N O*\n\n▢ *Kamu:* ${Kamu} Point\n▢ *Bot:* ${Aku} Point\n▢ *Hasil:* Seri\n\nKamu mendapatkan *${formatUang(count * 1)}*`.trim())
			}
		} else m.reply(`[×] Money kamu tidak mencukupi untuk Casino silahkan *kumpulkan* terlebih dahulu!`)
	} catch (e) {
		conn.cantLoad(e)
	}
}

const gameSamgongSolo = async (conn, m, db) => {
	const suits = ["♥️", "♦️", "♣️", "♠️"];
	const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
	if (db.users[m.sender].limit < 1) return m.reply(process.env.WARN_LIMIT)
	const count = parseInt(m.args[0]);
	if (isNaN(count) || count < 5000) return m.reply("[×] Sertakan jumlah taruhannya!\n\n> Taruhan minimal adalah *5000!*");
	if (db.users[m.sender].money < count) return m.reply(`[×] Uang kamu tidak mencukupi untuk Samgong silahkan *kumpulkan* terlebih dahulu!`)
	db.users[m.sender].money -= count;
	db.users[m.sender].limit -= 1
	let { key } = await m.reply("*🃏 S A M G O N G*\n\nPermainan dimulai, kartu sedang dibagikan...");
	await sleep(5000);
	const deck = ranks.flatMap(rank => suits.map(suit => `${rank} ${suit}`)).sort(() => Math.random() - 0.5);
	const draw = () => [deck.pop(), deck.pop(), deck.pop()];
	const calcScore = hand => hand.reduce((sum, card) => sum + (["J", "Q", "K"].includes(card.split(" ")[0]) ? 10 : card.split(" ")[0] === "A" ? 15 : parseInt(card)), 0);
	let playerHand = draw(), botHand = draw();
	let playerScore = calcScore(playerHand), botScore = calcScore(botHand);
	await m.reply(`*🃏 KARTU DIBAGIKAN:*\n👤 *Kamu:* ${playerHand.join(", ")}\n👀 *Bot:* ${botHand.join(", ")}`, { edit: key });
	await sleep(2000);
	while (playerScore < 30 && botScore < 30 && playerHand.length < 4) {
		if (playerScore < 30) playerHand.push(deck.pop());
		if (botScore < 30) botHand.push(deck.pop());
		playerScore = calcScore(playerHand);
		botScore = calcScore(botHand);
	}	
	let winnings = count * 1.5;
	let result = playerScore > 30 ? "💀 Kamu kalah!" : playerScore === botScore ? "🤝 Hasil Seri! Taruhan dikembalikan" : botScore > 30 || playerScore > botScore ? `🎉 Kamu menang! +${winnings} 💵` : "😋 Bot menang!";
	if (playerScore <= 30 && (botScore > 30 || playerScore > botScore)) db.users[m.sender].money += (playerScore === botScore ? count : winnings);
	await m.reply(`*🃏 S A M G O N G*\n\n*Hasil Akhir:*\n👤 *Kamu:* ${playerHand.join(", ")} (${playerScore})\n👀 *Bot:* ${botHand.join(", ")} (${botScore})\n\n${result}`, { edit: key })
}

const gameMerampok = async (m, db) => {
	let __timers = (new Date - db.users[m.sender].lastrampok)
	let _timers = (3600000 - __timers)
	let timers = clockString(_timers)
	if (new Date - db.users[m.sender].lastrampok > 3600000) {
		let dapat = (Math.floor(Math.random() * 10000))
		let who
		if (m.isGroup) who = m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.mentionedJid[0]
		else who = m.chat
		if (!who) return m.reply("[×] Tag member yang ingin kamu rampok!")
		if (!db.users[who]) return m.reply("[×] Target tidak terdaftar di database!")
		if (10000 > db.users[who].money) return m.reply("[×] Target tidak memiliki cukup money!")
		db.users[who].money -= dapat
		db.users[m.sender].money += dapat
		db.users[m.sender].lastrampok = new Date * 1
		m.reply(`[√] Berhasil merampok money target sebesar ${formatUang(dapat)}`)
	} else m.reply(`[×] Anda Sudah merampok dan berhasil sembunyi, tunggu *${timers}* untuk merampok lagi`)
}

const setLimit = (m, db) => db.users[m.sender].limit -= 1
const addLimit = (jumlah, no, db) => db.users[no].limit += parseInt(jumlah)
const setUang = (m, db) => db.users[m.sender].money -= 1000
const addUang = (jumlah, no, db) => db.users[no].money += parseInt(jumlah)

const transfer = async (m, args, db) => {
	if (args[0] == "limit") {
		if (!args[1].length > 7) return m.reply("Contoh penggunaan: .transfer limit @tag jumlah\n\n> Opsi tersedia: limit | money")
		let count = parseInt(args[2] && args[2].length > 0 ? Math.min(9999999, Math.max(parseInt(args[2]), 1)) : Math.min(1))
		let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[1] ? (args[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net") : false
		if (!who) return m.reply("[×] Tag member yang ingin ditransfer")
		if (db.users[who]) {
			if (db.users[m.sender].limit >= count * 1) {
				try {
					db.users[m.sender].limit -= count * 1
					db.users[who].limit += count * 1
					m.reply(`[√] Berhasil mentransfer limit sebesar ${count}, kepada @${who.split("@")[0]}`)
				} catch (e) {
					db.users[m.sender].limit += count * 1
					m.reply("[×] Gagal melakukan transfer")
				}
			} else m.reply(`[×] Limit kamu tidak mencukupi!!\n\n> Dimiliki: *${db.users[m.sender].limit}*`)
		} else m.reply(`[×] Member ${who.split("@")[0]} bukan pengguna bot!`)
	} else if (args[0] == "money" || args[0] == "uang") {
		if (!args[1].length > 7) return m.reply("Contoh penggunaan: .transfer money @tag jumlah\n\n> Opsi tersedia: limit | money")
		let count = parseInt(args[2] && args[2].length > 0 ? Math.min(9999999, Math.max(parseInt(args[2]), 1)) : Math.min(1))
		let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[1] ? (args[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net") : false
		if (!who) return m.reply("[×] Tag member yang ingin ditransfer")
		if (db.users[who]) {
			if (db.users[m.sender].money >= count * 1) {
				try {
					db.users[m.sender].money -= count * 1
					db.users[who].money += count * 1
					m.reply(`[√] Berhasil mentransfer uang sebesar ${formatUang(count)}, kepada @${who.split("@")[0]}`)
				} catch (e) {
					db.users[m.sender].uang += count * 1
					m.reply("[×] Gagal melakukan transfer")
				}
			} else m.reply(`[×] Uang tidak mencukupi!!\n\n> Dimiliki: *${db.users[m.sender].money}*`)
		} else m.reply(`[×] Member ${who.split("@")[0]} bukan pengguna bot!`)
	} else return m.reply("Contoh penggunaan: .transfer limit @tag jumlah\n\n> Opsi tersedia: limit | money")
}

class TicTacToe {
    constructor(playerX = "x", playerO = "o") {
        this.playerX = playerX
        this.playerO = playerO
        this._currentTurn = false
        this._x = 0
        this._o = 0
        this.turns = 0
    }
    get board() {
        return this._x | this._o
    }
    get currentTurn() {
        return this._currentTurn ? this.playerO : this.playerX
    }
    get enemyTurn() {
        return this._currentTurn ? this.playerX : this.playerO
    }
    static check(state) {
        for (let combo of [7, 56, 73, 84, 146, 273, 292, 448])
            if ((state & combo) === combo)
                return !0
        return !1
    }
    /**
     * ```js
     * TicTacToe.toBinary(1, 2) // 0b010000000
     * ```
     */
    static toBinary(x = 0, y = 0) {
        if (x < 0 || x > 2 || y < 0 || y > 2) throw new Error("invalid position")
        return 1 << x + (3 * y)
    }
    /**
     * @param player `0` is `X`, `1` is `O`
     * 
     * - `-3` `Game Ended`
     * - `-2` `Invalid`
     * - `-1` `Invalid Position`
     * - ` 0` `Position Occupied`
     * - ` 1` `Sucess`
     * @returns {-3|-2|-1|0|1}
     */
    turn(player = 0, x = 0, y) {
        if (this.board === 511) return -3
        let pos = 0
        if (y == null) {
            if (x < 0 || x > 8) return -1
            pos = 1 << x
        } else {
            if (x < 0 || x > 2 || y < 0 || y > 2) return -1
            pos = TicTacToe.toBinary(x, y)
        }
        if (this._currentTurn ^ player) return -2
        if (this.board & pos) return 0
        this[this._currentTurn ? "_o" : "_x"] |= pos
        this._currentTurn = !this._currentTurn
        this.turns++
        return 1
    }
    /**
     * @returns {("X"|"O"|1|2|3|4|5|6|7|8|9)[]}
     */
    static render(boardX = 0, boardO = 0) {
        let x = parseInt(boardX.toString(2), 4)
        let y = parseInt(boardO.toString(2), 4) * 2
        return [...(x + y).toString(4).padStart(9, "0")].reverse().map((value, index) => value == 1 ? "X" : value == 2 ? "O" : ++index)
    }
    /**
     * @returns {("X"|"O"|1|2|3|4|5|6|7|8|9)[]}
     */
    render() {
        return TicTacToe.render(this._x, this._o)
    }
    get winner() {
        let x = TicTacToe.check(this._x)
        let o = TicTacToe.check(this._o)
        return x ? this.playerX : o ? this.playerO : false
    }
}
new TicTacToe().turn

export { rdGame, iGame, tGame, gameCasinoSolo, gameSamgongSolo, gameMerampok, setLimit, addLimit, addUang, setUang, transfer, TicTacToe }