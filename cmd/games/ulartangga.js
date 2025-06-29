import Jimp from 'jimp'
import axios from 'axios'

class GameSession {
	constructor(id, sMsg) {
		this.id = id
		this.players = []
		this.game = new SnakeAndLadderGame(sMsg)
	}
}

class SnakeAndLadderGame {
	constructor(sMsg) {
		this.sendMsg = sMsg
		this.players = []
		this.boardSize = 100
		this.snakesAndLadders = [
			{ start: 29, end: 7 }, { start: 24, end: 12 },
			{ start: 15, end: 37 }, { start: 23, end: 41 },
			{ start: 72, end: 36 }, { start: 49, end: 86 },
			{ start: 90, end: 56 }, { start: 75, end: 64 },
			{ start: 74, end: 95 }, { start: 91, end: 72 },
			{ start: 97, end: 78 }
		]
		this.currentPositions = {}
		this.currentPlayerIndex = 0
		this.bgImageUrl = 'https://i.pinimg.com/originals/2f/68/a7/2f68a7e1eee18556b055418f7305b3c0.jpg'
		this.player1ImageUrl = 'https://i.pinimg.com/originals/75/33/22/7533227c53f6c270a96d364b595d6dd5.jpg'
		this.player2ImageUrl = 'https://i.pinimg.com/originals/be/68/13/be6813a6086681070b0f886d33ca4df9.jpg'
		this.bgImage = null
		this.player1Image = null
		this.player2Image = null
		this.cellWidth = 40
		this.cellHeight = 40
		this.keyId = null
		this.started = false
	}

	initializeGame() {
		for (const player of this.players) this.currentPositions[player] = 1
		this.currentPlayerIndex = 0
		this.started = true
	}

	rollDice() {
		return Math.floor(Math.random() * 6) + 1
	}

	async movePlayer(player, steps) {
		if (!this.players.length) return
		let currentPosition = this.currentPositions[player]
		let newPosition = currentPosition + steps

		for (const other of this.players) {
			if (other !== player && this.currentPositions[other] === newPosition) {
				await m.reply(`😱 *Oh tidak!* @${player.split('@')[0]} *diinjak oleh* @${other.split('@')[0]}.* Kembali ke awal cell.`)
				newPosition = 1
			}
		}

		const found = this.snakesAndLadders.find(s => s.start === newPosition)
		if (found) newPosition = found.end
		this.currentPositions[player] = Math.min(newPosition, this.boardSize)
	}

	async fetchImage(url) {
		const res = await axios.get(url, { responseType: 'arraybuffer' })
		return await Jimp.read(Buffer.from(res.data, 'binary'))
	}

	async getBoardBuffer() {
		const board = new Jimp(420, 420)
		this.bgImage.resize(420, 420)
		board.composite(this.bgImage, 0, 0)
		for (const p of this.players) {
			const pos = this.currentPositions[p]
			const img = p === this.players[0] ? this.player1Image : this.player2Image
			const x = ((pos - 1) % 10) * this.cellWidth + 10
			const y = (9 - Math.floor((pos - 1) / 10)) * this.cellHeight + 10
			board.composite(img.clone().resize(this.cellWidth, this.cellHeight), x, y)
		}
		return board.getBufferAsync(Jimp.MIME_PNG)
	}

	async startGame(m, p1, p2) {
		await m.reply(`🐍🎲 *Selamat datang di Ular Tangga!* \n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}`)
		this.players = [p1, p2]
		this.initializeGame()
		if (!this.bgImage) this.bgImage = await this.fetchImage(this.bgImageUrl)
		if (!this.player1Image) this.player1Image = await this.fetchImage(this.player1ImageUrl)
		if (!this.player2Image) this.player2Image = await this.fetchImage(this.player2ImageUrl)
		const buf = await this.getBoardBuffer()
		const { key } = await m.reply({ image: buf })
		this.keyId = key
	}

	async playTurn(m, player) {
		if (!this.players.length) return m.reply('🛑 *Belum ada game berjalan.*')
		if (player !== this.players[this.currentPlayerIndex]) return m.reply(`🕒 *Bukan giliranmu*, giliran @${this.players[this.currentPlayerIndex].split('@')[0]}`)

		const roll = this.rollDice()
		await m.reply(`🎲 @${player.split('@')[0]} lempar dadu: *${roll}*\nDari: *${this.currentPositions[player]}* → *${this.currentPositions[player] + roll}*`)
		
		await this.movePlayer(player, roll)
		
		const effect = this.snakesAndLadders.find(s => s.start === this.currentPositions[player])
		if (effect) {
			const type = effect.end < effect.start ? 'ular 🐍' : 'tangga 🪜'
			await m.reply(`🎯 @${player.split('@')[0]} kena ${type}! Pindah ke kotak *${effect.end}*`)
			this.currentPositions[player] = effect.end
		}

		if (roll !== 6) this.switchPlayer()
		else await m.reply('🎲 Karena dadu 6, giliran kamu lanjut 🎉')

		if (this.currentPositions[player] === this.boardSize) {
			await m.reply(`🎉 @${player.split('@')[0]} menang game ini!`)
			this.resetSession()
		}

		await this.sendMsg.sendMessage(m.chat, { delete: this.keyId })
		const newBoard = await this.getBoardBuffer()
		const { key } = await m.reply({ image: newBoard })
		this.keyId = key
	}

	addPlayer(player) {
		if (this.players.length < 2 && !this.players.includes(player)) {
			this.players.push(player)
			return true
		}
		return false
	}

	switchPlayer() {
		this.currentPlayerIndex = 1 - this.currentPlayerIndex
	}

	resetSession() {
		this.players = []
		this.currentPositions = {}
		this.currentPlayerIndex = 0
		this.started = false
	}

	isGameStarted() {
		return this.started
	}
}

commands.add({
	name: ["ulartangga"],
	command: ["ulartangga", "ular", "snak", "snake", "ladders"],
	category: "games",
	desc: "main game ular tangga multiplayer",
	group: true,
	run: async ({ sius, m, args }) => {
		sius.ulartangga = sius.ulartangga || {}
		const sessions = sius.ulartangga_ = sius.ulartangga_ || {}
		const sessionId = m.chat
		const session = sessions[sessionId] || (sessions[sessionId] = new GameSession(sessionId, sius))
		const game = session.game
		const state = sius.ulartangga[m.chat]?.state ?? false

		switch ((args[0] || '').toLowerCase()) {
			case "join":
				if (state) return m.reply('🛑 Game udah mulai, gabisa join.')
				const player = m.sender
				if (game.addPlayer(player)) {
					await m.reply(`👤 @${player.split('@')[0]} join game.`)
				} else {
					await m.reply('⚠️ Game penuh atau kamu udah join.')
				}
				break

			case "start":
				if (state) return m.reply('🛑 Game udah mulai.')
				if (game.players.length < 2) return m.reply('👥 Butuh 2 pemain buat mulai.')
				sius.ulartangga[m.chat] = { ...sius.ulartangga[m.chat], state: true }
				await game.startGame(m, game.players[0], game.players[1])
				break

			case "roll":
				if (!state) return m.reply('⚠️ Game belum dimulai.')
				if (!game.isGameStarted()) return m.reply('⚠️ Game belum aktif.')
				await game.playTurn(m, m.sender)
				break

			case "reset":
				sius.ulartangga[m.chat] = { ...sius.ulartangga[m.chat], state: false }
				game.resetSession()
				delete sessions[sessionId]
				await m.reply('🔄 Game direset.')
				break

			case "help":
			default:
				await m.reply([
					"🎲 *ULAR TANGGA MULTIPLAYER*",
					`▢ ${m.prefix + m.command} join → gabung game`,
					`▢ ${m.prefix + m.command} start → mulai game (butuh 2 player)`,
					`▢ ${m.prefix + m.command} roll → lempar dadu giliranmu`,
					`▢ ${m.prefix + m.command} reset → reset game`
				].join("\n"))
		}
	}
})