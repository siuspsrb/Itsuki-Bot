import chalk from "chalk"
import cron from "node-cron"
import axios from "axios"
import util from "util"
import path from "path"
import similarity from "similarity"
import fs from "fs"
import dl from "./scrape.js"
import infobot from "../../settings.js"
import * as Func from "./functions.js"
import * as prem from "./premium.js"
import { exec } from "child_process"
import { promisify } from "util"
import { iGame, setLimit } from "./game.js"
import { 
    GoogleGenerativeAI 
} from "@google/generative-ai"
import { 
    GroupUpdate, 
    LoadDataBase 
} from "./update.js"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { autoLoadAllJS } = Func
const lastSapa = new Map()
const warnedUsers = new Map()
global.commands = new Func.botEvents()
global.config = infobot
global.cmdLogs = []
global.rateLimit = new Map()

export async function handler(sius, m, msg, store, groupCache) {

    try {
        await autoLoadAllJS("./cmd", commands)
    } catch (e) {
        console.log("[×] Gagal menerima cmd " + e)
    }
 
	if (!store.messages[msg.key.remoteJid]?.array?.some(a => a.key.id === msg.key.id)) return
    if (!msg.message) return

	await LoadDataBase(sius, m)
	await GroupUpdate(sius, m, store)
    
    let text = (m.type === "conversation") ? m.message.conversation :
		      (m.type == "imageMessage") ? m.message.imageMessage.caption :
		      (m.type == "videoMessage") ? m.message.videoMessage.caption :
		      (m.type == "extendedTextMessage") ? m.message.extendedTextMessage.text :
		      (m.type == "buttonsResponseMessage") ? m.message.buttonsResponseMessage.selectedButtonId :
		      (m.type == "listResponseMessage") ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
		      (m.type == "templateButtonReplyMessage") ? m.message.templateButtonReplyMessage.selectedId :
		      (m.type == "messageContextInfo") ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) :
		      (m.type == "editedMessage") ? (m.message.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.editedMessage?.message?.protocolMessage?.editedMessage?.conversation || "") :
		      (m.type == "protocolMessage") ? (m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.protocolMessage?.editedMessage?.conversation || m.message.protocolMessage?.editedMessage?.imageMessage?.caption || m.message.protocolMessage?.editedMessage?.videoMessage?.caption || "") : ""

    // attribute 
    const isCommand = commands.prefix.test(text)
    const isLimit = global.db.users[m.sender] ? (global.db.users[m.sender].limit > 0) : false
    const botNumber = await sius.decodeJid(sius.user.id);
    const set = db.set[botNumber]
    const almost = 0.72
    const listowner = config.owner
    const isOwner = listowner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
    const setgroups = db.groups[m.chat]
    const isPrem = prem.checkPremiumUser(m.sender, db.premium)
    sius.public = true
    const budy = (typeof m.text == "string" ? m.text : "")
    const parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
        
    // database games
	const suit = db.game.suit
	const chat_ai = db.game.chat_ai
	const menfes = db.game.menfes
	const tekateki = db.game.tekateki
	const akinator = db.game.akinator
	const tictactoe = db.game.tictactoe
	const tebaklirik = db.game.tebaklirik
	const kuismath = db.game.kuismath
	const tebaklagu = db.game.tebaklagu
	const tebakkata = db.game.tebakkata
	const family100 = db.game.family100
	const susunkata = db.game.susunkata
	const tebakbom = db.game.tebakbom
	const tebakkimia = db.game.tebakkimia
	const caklontong = db.game.caklontong
	const tebakangka = db.game.tebakangka
	const tebaknegara = db.game.tebaknegara
	const tebakgambar = db.game.tebakgambar
	const tebakbendera = db.game.tebakbendera
	const asahotak = db.game.asahotak
	const siapakahaku = db.game.siapakahaku
	const tebakanime = db.game.tebakanime
	
	// autoread
    if (set.autoread) {
        await sius.readMessages([msg.key])
            .catch((e) => console.log(e))
    }

	// auto set bio
	if (set.autobio) {
		if (new Date() * 1 - set.status > 60000) {
			await sius.updateProfileStatus(`🪽 ${sius.user.name} | Runtime : ${Func.runtime(process.uptime())}`).catch(e => {})
			set.status = new Date() * 1
		}
	}
	
    // reset limit & backup db
	cron.schedule("00 00 * * *", async () => {
		for (let o of listowner) {
			    try {
					await sius.sendMessage(o +"@s.whatsapp.net", { text: "[√] Berhasil Melakukan reset limit kepada seluruh pengguna bot!" })
				} catch(e) {
				    console.log(e)
				}
	    }
		console.log("Reseted Limit Users")
		let user = Object.keys(db.users)
		for (let jid of user) {
		    const limitUser = db.users[jid].vip ? config.limit.vip : prem.checkPremiumUser(jid, db.premium) ? config.limit.premium : config.limit.free
		    if (db.users[jid].limit < limitUser) db.users[jid].limit = limitUser
	    }
		if (set.autobackup) {
			let datanya = "./lib/media/database/" + config.database
			if (config.database.startsWith("mongodb")) {
			    datanya = "./lib/media/database/backup_database.json"
			    fs.writeFileSync(datanya, JSON.stringify(global.db, null, 2), "utf-8")
			}
			let tglnya = new Date().toISOString().replace(/[:.]/g, "-")
			for (let o of listowner) {
			    try {
					await sius.sendMessage(o +"@s.whatsapp.net", { document: fs.readFileSync(datanya), mimetype: "application/json", fileName: tglnya + "_database.json" })
					console.log(`[AUTO BACKUP] Backup berhasil dikirim ke ${o}`)
				} catch (e) {
					console.error(`[AUTO BACKUP] Gagal mengirim backup ke ${o}:`, error)
				}
			}
		}
	}, {
	    scheduled: true,
		timezone: "Asia/Jakarta"
	})
	
	if (!isOwner) { //owner mah bebas ajg
	
        // set mode
	    if (db.users[m.sender]?.ban) return
        if (set.privateonly && m.isGroup) return
        if (!sius.public && !m.key.fromMe) return
        if (m.isGroup && setgroups.mute) return
        if (m.isBot) return
        if (set.grouponly && !m.isGroup) {
            if (!warnedUsers.has(m.sender) && !isPrem) {
                warnedUsers.set(m.sender, true)
                return m.reply(`乂  *ACCESS DENIED*
                
Bot saat ini berjalan dalam mode *Group Only*. Akses melalui *PC / Private Chat* hanya tersedia untuk Premium User (akses penuh).

[√] Pilihan tersedia:
    ▢ Beli akses premium: ketik *.buy premium*
    ▢ Join grup publik bot: ${config.bot.group}   

📌 Fitur tetap bisa digunakan, tapi hanya dari dalam grup.`.trim())
            }
            return;
        }
        
        // anti nomor luar 
        const blockedCodes = ["93", "212", "91", "92", "90", "54", "55", "95", "94", "256"]
        if (blockedCodes.some(code => m.sender.startsWith(code))) {
            sius.updateBlockStatus(m.sender, "block")
        }
        
        // groups
        if (!m.key.fromMe && m.isBotAdmin && !m.isAdmin) {
        
        // anti hidetag
        if (m.mentionedJid?.length === m.metadata.participants.length && setgroups.antihidetag) {
            await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
            await m.reply("*Anti hidetag sedang Aktif❗*")
        }
        
        // anti tagsw
        if (m.type === "groupStatusMentionMessage" || m.message?.groupStatusMentionMessage || m.message?.protocolMessage?.type === 25 || Object.keys(m.message).length === 1 && Object.keys(m.message)[0] === "messageContextInfo" && setgroups.antitagsw) {
            if (!setgroups.tagsw[m.sender]) {
				setgroups.tagsw[m.sender] = 1
				await m.reply(`Grup ini terdeteksi ditandai dalam Status WhatsApp\n@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp\nPeringatan ${setgroups.tagsw[m.sender]}/5, akan dikick sewaktu waktu❗`)
			} else if (setgroups.tagsw[m.sender] >= 5) {
				await sius.groupParticipantsUpdate(m.chat, [m.sender], "remove").catch((err) => m.reply("Gagal!"))
				await m.reply(`@${m.sender.split("@")[0]} telah dikeluarkan dari grup\nKarena menandai grup dalam status WhatsApp sebanyak 5x`)
				delete setgroups.tagsw[m.sender]
			} else {
				setgroups.tagsw[m.sender] += 1
				await m.reply(`Grup ini terdeteksi ditandai dalam Status WhatsApp\n@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp\nPeringatan ${setgroups.tagsw[m.sender]}/5, akan dikick ketika peringatan mencapai batas❗`)
			}            
        }
        
        // anti toxic 
        if (budy.toLowerCase().split(/\s+/).some(word => config.badWords.includes(word)) && setgroups.antitoxic) {
            await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
            await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Berkata Toxic\nMohon gunakan bahasa yang sopan.`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Toxic❗*"}, ...m.key }}}, {})
        }
        
        // anti delete 
        if (m.type == "protocolMessage" && setgroups.antidelete) {
    		const mess = msg.message.protocolMessage
    		if (store.messages && store.messages[m.chat] && store.messages[m.chat].array) {
        		const chats = store.messages[m.chat].array.find(a => a.id === mess.key.id)
        		if (!chats.msg) return
        		chats.msg.contextInfo = { mentionedJid: [chats.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Delete❗*"}, ...chats.key }
        		const pesan = chats.type === "conversation" ? { extendedTextMessage: { text: chats.msg, contextInfo: { mentionedJid: [chats.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Delete❗*"}, ...chats.key }}} : { [chats.type]: chats.msg }
        		await sius.relayMessage(m.chat, pesan, {})
    		}
        }
        
        // antilink
        if (budy.match("chat.whatsapp.com/") && setgroups.antilink && !isOwner && m.isBotAdmin && !m.isAdmin) {
            await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
    		await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Mengirim Link Group\nMaaf Link Harus Di Hapus..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Link❗*"}, ...m.key }}}, {})
        }
        
        // antivirtex
        if (setgroups.antivirtex) {
            if (budy.length > 10000) {
                await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
    			await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Mengirim Virtex..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Virtex❗*"}, ...m.key }}}, {})
    			await sius.groupParticipantsUpdate(m.chat, [m.sender], "remove")
            }
            if (m.msg.nativeFlowMessage && m.msg.nativeFlowMessage.messageParamsJson && m.msg.nativeFlowMessage.messageParamsJson.length > 3500) {
                await sius.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
				await sius.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split("@")[0]} Mengirim Bug..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: "*Anti Bug❗*"}, ...m.key }}}, {})
				await sius.groupParticipantsUpdate(m.chat, [m.sender], "remove")
            }
        }
        // end of group's function
        }
    }
    		
	// salam
	if (/^a(s|ss)alamu("|)alaikum(| )(wr|)( |)(wb|)$/.test(budy?.toLowerCase())) {
		const jwb_salam = ["wa\"alaikumusalam","wa\"alaikumusalam wr wb","wa\"alaikumusalam warohmatulahi wabarokatuh"]
		m.reply(Func.pickRandom(jwb_salam))
	}
		
	// cek expired
	prem.expiredCheck(sius, db.premium)

	// tictactoe
	const room = Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith("tictactoe") && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == "PLAYING")
	if (room) {
		let now = Date.now();
		if (now - (room.lastMove || now) > 5 * 60 * 1000) {
			m.reply("Game Tic-Tac-Toe dibatalkan karena tidak ada aktivitas selama 5 menit.");
			delete tictactoe[room.id];
			return;
		}
		room.lastMove = now;
		let ok, isWin = false, isTie = false, isSurrender = false;
		if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return
		isSurrender = !/^[1-9]$/.test(m.text)
		if (m.sender !== room.game.currentTurn) {
			if (!isSurrender) return true
		}
		if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
			m.reply({"-3": "Game telah berakhir","-2": "Invalid","-1": "Posisi Invalid",0: "Posisi Invalid"}[ok])
			return true
		}
		if (m.sender === room.game.winner) isWin = true
		else if (room.game.board === 511) isTie = true
		if (!(room.game instanceof TicTacToe)) {
			room.game = Object.assign(new TicTacToe(room.game.playerX, room.game.playerO), room.game)
		}
		let arr = room.game.render().map(v => ({X: "❌",O: "⭕",1: "1️⃣",2: "2️⃣",3: "3️⃣",4: "4️⃣",5: "5️⃣",6: "6️⃣",7: "7️⃣",8: "8️⃣",9: "9️⃣"}[v]))
		if (isSurrender) {
			room.game._currentTurn = m.sender === room.game.playerX
			isWin = true
		}
		let winner = isSurrender ? room.game.currentTurn : room.game.winner
		if (isWin) {
			db.users[m.sender].limit += 3
			db.users[m.sender].money += 3000
		}
		let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join("")}\n${arr.slice(3, 6).join("")}\n${arr.slice(6).join("")}\n\n${isWin ? `@${winner.split("@")[0]} Menang!` : isTie ? `Game berakhir` : `Giliran ${["❌", "⭕"][1 * room.game._currentTurn]} (@${room.game.currentTurn.split("@")[0]})`}\n❌: @${room.game.playerX.split("@")[0]}\n⭕: @${room.game.playerO.split("@")[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
		if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
		room[room.game._currentTurn ^ isSurrender ? "x" : "o"] = m.chat
		if (room.x !== room.o) await sius.sendMessage(room.x, { text: str, mentions: parseMention(str) }, { quoted: m })
		await sius.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
		if (isTie || isWin) delete tictactoe[room.id]
	}

    async function loadCommands() {
        commands.event = {}
        const cmdpath = path.join(__dirname, "../cmd")
        const commandFiles = fs.readdirSync(cmdpath).filter(file => file.endsWith(".js"))
        for (const file of commandFiles) {
            try {
                const filePath = path.join(cmdpath, file)
                const fileUrl = `file://${filePath}?update=${Date.now()}`
                await import(fileUrl)
                console.log(`[LOAD] Loaded command: ${file}`)
                global.cmdLogs.push({
                    type: "add",
                    file: file,
                    time: new Date().toLocaleString("id"),
                    status: "Loaded successfully"
                })
            } catch (err) {
                console.error(`[ERROR] Loading command ${file}:`, err)
                global.cmdLogs.push({
                    type: "error",
                    file: file,
                    time: new Date().toLocaleString("id"),
                    status: `Error: ${err.message}`
                })
            }
        }
    }

    function setupHotReload() {
        const cmdpath = path.join(__dirname, "../cmd")
        fs.watch(cmdpath, { recursive: true }, async (eventType, filename) => {
            if (!filename || !filename.endsWith(".js")) return
            console.log(`[RELOAD] Detected ${eventType} in ${filename}`)
            try {
                const filePath = path.join(cmdpath, filename)
                const fileUrl = `file://${filePath}?update=${Date.now()}`
                if (!fs.existsSync(filePath)) {
                    console.log(`[DELETE] ${filename} deleted, reloading all...`)
                    global.cmdLogs.push({
                        type: "delete",
                        file: filename,
                        time: new Date().toLocaleString("id"),
                        status: "File deleted"
                    })
                    await loadCommands()
                    return
                }
                await import(fileUrl)
                console.log(`[RELOAD] Reloaded command: ${filename}`)
                global.cmdLogs.push({
                    type: "update",
                    file: filename,
                    time: new Date().toLocaleString("id"),
                    status: "Reloaded successfully"
                })
            } catch (err) {
                console.error(`[ERROR] Reloading ${filename}:`, err)
                global.cmdLogs.push({
                    type: "error",
                    file: filename,
                    time: new Date().toLocaleString("id"),
                    status: `Error: ${err.message}`
                })
            }
        })
    }

    setupHotReload()

	// suit pvp
	const roof = Object.values(suit).find(roof => roof.id && roof.status && [roof.p, roof.p2].includes(m.sender))
	if (roof) {
		let now = Date.now();
		let win = "", tie = false;
		if (now - (roof.lastMove || now) > 3 * 60 * 1000) {
			m.reply("Game Suit dibatalkan karena tidak ada aktivitas selama 3 menit.");
			delete suit[roof.id];
			return;
		}
		roof.lastMove = now;
		if (m.sender == roof.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(m.text) && m.isGroup && roof.status == "wait") {
			if (/^(tolak|gamau|nanti|n|ga(k.)?bisa)/i.test(m.text)) {
			    m.reply(`@${roof.p2.split`@`[0]} menolak suit,\nsuit dibatalkan`)
			    delete suit[roof.id]
			    return !0
			}
			roof.status = "play";
			roof.asal = m.chat;
			m.reply(`Suit telah dikirimkan ke chat\n\n@${roof.p.split`@`[0]} dan @${roof.p2.split`@`[0]}\n\nSilahkan pilih suit di chat masing-masing klik https://wa.me/${botNumber.split`@`[0]}`)
			if (!roof.pilih) sius.sendMessage(roof.p, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️\n\n> Cukup ketik balasan tanpa menggunakan emoji untuk menjawab!` }, { quoted: m })
			if (!roof.pilih2) sius.sendMessage(roof.p2, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️\n\n> Cukup ketik balasan tanpa menggunakan emoji untuk menjawab!` }, { quoted: m })
		}
		let jwb = m.sender == roof.p, jwb2 = m.sender == roof.p2;
		let g = /gunting/i, b = /batu/i, k = /kertas/i, reg = /^(gunting|batu|kertas)/i;
		if (jwb && reg.test(m.text) && !roof.pilih && !m.isGroup) {
			roof.pilih = reg.exec(m.text.toLowerCase())[0];
			roof.text = m.text;
			m.reply(`Kamu telah memilih ${m.text} ${!roof.pilih2 ? `\n\nMenunggu lawan memilih` : ""}`);
			if (!roof.pilih2) sius.sendMessage(roof.p2, { text: "_Lawan sudah memilih_\nSekarang giliran kamu" })
		}
		if (jwb2 && reg.test(m.text) && !roof.pilih2 && !m.isGroup) {
			roof.pilih2 = reg.exec(m.text.toLowerCase())[0]
			roof.text2 = m.text
			m.reply(`Kamu telah memilih ${m.text} ${!roof.pilih ? `\n\nMenunggu lawan memilih` : ""}`)
			if (!roof.pilih) sius.sendMessage(roof.p, { text: "_Lawan sudah memilih_\nSekarang giliran kamu" })
		}
		let stage = roof.pilih
		let stage2 = roof.pilih2
		if (roof.pilih && roof.pilih2) {
			if (b.test(stage) && g.test(stage2)) win = roof.p
			else if (b.test(stage) && k.test(stage2)) win = roof.p2
			else if (g.test(stage) && k.test(stage2)) win = roof.p
			else if (g.test(stage) && b.test(stage2)) win = roof.p2
			else if (k.test(stage) && b.test(stage2)) win = roof.p
			else if (k.test(stage) && g.test(stage2)) win = roof.p2
			else if (stage == stage2) tie = true
			db.users[roof.p == win ? roof.p : roof.p2].limit += tie ? 0 : 3
			db.users[roof.p == win ? roof.p : roof.p2].money += tie ? 0 : 3000
			sius.sendMessage(roof.asal, { text: `_*Hasil Suit*_${tie ? "\nSERI" : ""}\n\n@${roof.p.split`@`[0]} (${roof.text}) ${tie ? "" : roof.p == win ? ` Menang \n` : ` Kalah \n`}\n@${roof.p2.split`@`[0]} (${roof.text2}) ${tie ? "" : roof.p2 == win ? ` Menang \n` : ` Kalah \n`}\n\nPemenang Mendapatkan\n*Hadiah :* Uang(3000) & Limit(3)`.trim(), mentions: [roof.p, roof.p2] }, { quoted: m })
			delete suit[roof.id]
		}
	}
	
	if (!Array.isArray(set.money)) set.money = []

	// tebak bomb
    let pilih = "✅", bomb = "💥"
    if (m.sender in tebakbom) {
    if (!/^[1-9]$/i.test(text) && !isCommand && !isOwner) return !0
    let pilihan = parseInt(text) - 1
    if (tebakbom[m.sender].petak[pilihan] === 1) return !0
    if (tebakbom[m.sender].petak[pilihan] === 2) {
        tebakbom[m.sender].board[pilihan] = bomb
        tebakbom[m.sender].pick++
        //sius.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        tebakbom[m.sender].bomb--
        tebakbom[m.sender].nyawa.pop()
        let brd = tebakbom[m.sender].board
        let display = `${brd.slice(0, 3).join("")}\n${brd.slice(3, 6).join("")}\n${brd.slice(6, 9).join("")}`
        if (tebakbom[m.sender].nyawa.length < 1) {
            await m.reply(
`*GAME TELAH BERAKHIR*
kamu terkena bomb

${display}

▢ Terpilih : ${tebakbom[m.sender].pick}
▢ Pengurangan limit : 1`)
            delete tebakbom[m.sender]
        } else {
            await m.reply(
`乂  *B O M B*

kamu terkena bomb
${display}

▢ Terpilih : ${tebakbom[m.sender].pick}
▢ Sisa nyawa : ${tebakbom[m.sender].nyawa.join("")}`)
        }
        return !0
    }
    if (tebakbom[m.sender].petak[pilihan] === 0) {
        tebakbom[m.sender].petak[pilihan] = 1
        tebakbom[m.sender].board[pilihan] = pilih
        tebakbom[m.sender].pick++
        tebakbom[m.sender].lolos--
        let brd = tebakbom[m.sender].board
        let display = `${brd.slice(0, 3).join("")}\n${brd.slice(3, 6).join("")}\n${brd.slice(6, 9).join("")}`
        if (tebakbom[m.sender].lolos < 1) {
            db.users[m.sender].money += 6000
            await m.reply(
`*KAMU HEBAT !!*

${display}

▢ Terpilih : ${tebakbom[m.sender].pick}
▢ Sisa nyawa : ${tebakbom[m.sender].nyawa.join("")}
▢ Bomb : ${tebakbom[m.sender].bomb}
▢ Bonus uang 💰 *+$6.000*`)
            delete tebakbom[m.sender]
        } else {
            m.reply(
`乂  *B O M B*

${display}

▢ Terpilih : ${tebakbom[m.sender].pick}
▢ Sisa nyawa : ${tebakbom[m.sender].nyawa.join("")}
▢ Bomb : ${tebakbom[m.sender].bomb}`)
        }
    }
    }
        
	// game
	const games = { tebaklirik, tekateki, tebaklagu, tebakkata, kuismath, susunkata, tebakkimia, caklontong, tebakangka, tebaknegara, tebakgambar, tebakbendera, asahotak, siapakahaku, tebakanime, tebaklagu }
	for (let gameName in games) {
		let game = games[gameName];
		let id = iGame(game, m.chat);
		if (m.quoted && id == m.quoted.id) {
			if (gameName == "kuismath") {
				let jawaban = game[m.chat + id].jawaban
				const difficultyMap = { "noob": 1, "easy": 1.5, "medium": 2.5, "hard": 4, "extreme": 5, "impossible": 6, "impossible2": 7 };
				let poinn = difficultyMap[kuismath[m.chat + id].mode]
				if (!isNaN(budy)) {
					if (budy.toLowerCase() == jawaban) {
						db.users[m.sender].point += poinn * 50
						await sius.sendMessage(m.chat, { sticker: fs.readFileSync("./lib/media/assets/benar.webp")}, { quoted: msg })
						await m.reply(`*+${poinn * 50} Point*`)
						delete kuismath[m.chat + id]
					} else {
					    db.users[m.sender].point -= poinn * 10
					    await sius.sendMessage(m.chat, { sticker: fs.readFileSync("./lib/media/assets/salah.webp")}, { quoted: msg })
					    await m.reply(`*-${poinn * 10} Point*`)
					}
				}
			} else {
				let jawaban = game[m.chat + id].jawaban
				let jawabBenar = /tekateki|tebaklirik|tebaklagu|tebakkata|tebaknegara|tebakbendera|asahotak|siapakahaku|tebakanime|tebaklagu/.test(gameName) ? (similarity(budy.toLowerCase(), jawaban) >= almost) : (budy.toLowerCase() == jawaban)
				let bonus = gameName == "caklontong" ? 500 : gameName == "tebaklirik" ? 350 : gameName == "susunkata" ? 234 : gameName == "asahotak" ? 175 : gameName === "tebakanime" ? 1000 : 150
				if (jawabBenar) {
					db.users[m.sender].point += bonus * 1
					await sius.sendMessage(m.chat, { sticker: fs.readFileSync("./lib/media/assets/benar.webp")}, { quoted: msg })
					await m.reply(`*+${bonus} Point*`)
					delete game[m.chat + id]
				} else {
				    db.users[m.sender].point -= bonus * 1
				    await sius.sendMessage(m.chat, { sticker: fs.readFileSync("./lib/media/assets/salah.webp")}, { quoted: msg })
				    await m.reply(`*-${bonus} Point*`)
				}
			}
		}
	}
		
	// family 100
	if (m.chat in family100) {
		if (m.quoted && m.quoted.id == family100[m.chat].id && !isCommand) {
			let room = family100[m.chat]
			let teks = budy.toLowerCase().replace(/[^\w\s\-]+/, "")
			let isSurender = /^((me)?nyerah|surr?ender)$/i.test(teks)
			if (!isSurender) {
				let index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, "") === teks)
				if (room.terjawab[index]) return !0
				room.terjawab[index] = m.sender
			}
			let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
			let caption = `Jawablah Pertanyaan Berikut :\n${room.soal}\n\n\nTerdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(" ")) ? `(beberapa Jawaban Terdapat Spasi)` : ""}\n${isWin ? `Semua Jawaban Terjawab` : isSurender ? "Menyerah!" : ""}\n${Array.from(room.jawaban, (jawaban, index) => { return isSurender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? "@" + room.terjawab[index].split("@")[0] : ""}`.trim() : false }).filter(v => v).join("\n")}\n${isSurender ? "" : `Perfect Player`}`.trim()
			m.reply(caption)
			if (isWin || isSurender) delete family100[m.chat]
		}
	}
		
	// menfes room 
	if (menfes[m.sender] && m.key.remoteJid !== "status@broadcast" && !m.isGroup) {
		if (!/^(del(menfe(s|ss)|confe(s|ss))|<|>|$)$/i.test(m.command)) {
			m.msg.contextInfo = { isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: `*Pesan Dari ${menfes[m.sender].nama ? menfes[m.sender].nama : "Seseorang"}*`}, key: { remoteJid: "0@s.whatsapp.net", fromMe: false, participant: "0@s.whatsapp.net" }}
			const pesan = m.type === "conversation" ? { extendedTextMessage: { text: m.msg, contextInfo: { isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: `*Pesan Dari ${menfes[m.sender].nama ? menfes[m.sender].nama : "Seseorang"}*`}, key: { remoteJid: "0@s.whatsapp.net", fromMe: false, participant: "0@s.whatsapp.net" }}}} : { [m.type]: m.msg }
			await sius.relayMessage(menfes[m.sender].tujuan, pesan, {});
		}
	}
		
	// afk
	let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
	for (let jid of mentionUser) {
		let user = db.users[jid]
		if (!user) continue
		let afkTime = user.afkTime
		if (!afkTime || afkTime < 0) continue
		let reason = user.afkReason || ""
		m.reply(`Jangan tag dia!\nDia sedang AFK ${reason ? "dengan alasan " + reason : "tanpa alasan"}\nSelama ${Func.clockString(new Date - afkTime)}`.trim())
	}
	if (db.users[m.sender].afkTime > -1) {
		let user = db.users[m.sender]
		m.reply(`@${m.sender.split("@")[0]} berhenti AFK${user.afkReason ? " setelah " + user.afkReason : ""}\nSelama ${Func.clockString(new Date - user.afkTime)}`)
		user.afkTime = -1
		user.afkReason = ""
	}
		
    // 🤏🏼
    sius.load = async () => {
        if (set.autotyping) {
            await sius.sendPresenceUpdate("composing", m.chat)
        }
    }
    
    // default replyAd 
    sius.reply = async(chat, q, sil, renderLarge, options = {}) => {
        let img = config.thumb.reply
        await sius.sendMessage(chat, {
            text: q,           
            contextInfo: {
                externalAdReply: {
                    title: sil,
                    previewType: "PHOTO",
                    thumbnailUrl: img,
                    renderLargerThumbnail: renderLarge,
                    mediaUrl: img,
                    mediaType: 1,
                    sourceUrl: config.github
                }
            },
            ...options
        }, { quoted: m });
    }

    sius.adChannel = async(q, options = {}) => {
        m.reply(q, {
        contextInfo: {
            forwardingScore: 10,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.channel,
                serverMessageId: null,
                newsletterName: options.txt ? options.txt : config.bot.name
            },
            externalAdReply: {
                title: options.title ? options.title : config.bot.name,
                thumbnailUrl: options.thumb ? options.thumb : config.thumb.reply,
                renderLargerThumbnail: options.render ? options.render : false,
                mediaType: 1,
                mediaUrl: options.thumb ? options.thumb : config.thumb.reply,
                sourceUrl: config.channel
            }
        }
        })
    }
    
    // auto lapor ownerny biar difix (klo dia bisa hhe)
    sius.cantLoad = async(e) => {
        const stack = e.stack || "No stack trace";
        const fileMatch = stack.match(/at\s.*?\((.*?):(\d+):(\d+)\)/) || stack.match(/at\s(.*?):(\d+):(\d+)/);
        const fileInfo = fileMatch ? `${fileMatch[1]}:${fileMatch[2]}` : "Unknown file";
        const errorMsg = `*Halo pak 🫡, laporan error!*\n\n*Message*: ${e.message || e}\n*File*: ${fileInfo}\n*stack*:\n${stack.slice(0, 500)}`;
        const owners = config.owner.map(o => `${o.trim()}@s.whatsapp.net`);
        if (owners.length) {
            try {
                await Promise.all(owners.map(owner =>
                    sius.sendMessage(owner, { text: errorMsg }, { quoted: m })
                ));
            } catch (ee) {
                console.error("Gagal kirim laporan:", ee);
            }
        }
        if (msg?.key?.remoteJid) { //m.chat
            await sius.sendMessage(msg.key.remoteJid, { text: config.mess.failed }, { quoted: msg });
        }
    }
    
    sius.roomAi = sius.roomAi || {}
    
    if (text) {;
        console.log(chalk.hex("#999999")("─────────────────────────────"))
        console.log(chalk.bgHex("#4a69bd").white.bold("  📥 New Message  "))
        console.log(chalk.bgHex("#ffffff").hex("#333333")(
        `▢ Tanggal     : ${new Date().toLocaleString()}\n` +
        `▢ Pesan       : ${text || body}\n` +
        `▢ Pengirim    : ${m.pushName}\n` +
        `▢ JID         : ${m.sender}`
        ))
        if (m.isGroup) {
            console.log(chalk.bgHex("#ffffff").hex("#333333")(
            `▢ Grup        : ${m.metadata.subject || "-"}\n` +
            `▢ GroupJID    : ${m.chat}`
            ))
        }
        console.log(chalk.hex("#999999")("─────────────────────────────\n"))
            
        // levelling & role user
        const user = db.users[m.sender];
        function checkUserLevelUp() {
            const baseExp = 1000;
            const neededExp = Math.floor(baseExp * Math.pow(1.2, user.level - 1));
            if (user.exp >= neededExp) {
                // kalau mau ubah sesuatu hati-hati 
                const roles = [
                    { minLevel: 0, name: "🦗 Beginner" },
                    { minLevel: 5, name: "⚔️ Warrior" },
                    { minLevel: 10, name: "🛡️ Knight" },
                    { minLevel: 15, name: "⚜️ Lord" },
                    { minLevel: 20, name: "💎 Elite" },
                    { minLevel: 30, name: "👑 Legend" }
                ];        
                const oldLevel = user.level;
                user.level += 1;
                user.money = (Number(user.money) + 5000).toString();        
                // check role upgrade ya ajg
                const newRole = roles.reverse().find(r => user.level >= r.minLevel)?.name || roles[0].name;
                let roleMsg = "";        
                if (user.role !== newRole) {
                    user.role = newRole;
                    roleMsg = `\n🎖️ *NEW ROLE*: ${newRole}`;                    
                } 
                return `(Lv.${oldLevel} → Lv.${user.level}) | +5.000 💵${roleMsg}`;
            }
            return null;
        }
        function checkPetLevelUp(petName) {
            const pets = {
                dog: { expKey: "dogexp", levelKey: "dogLevel", emoji: "🐶" },
                cat: { expKey: "catngexp", levelKey: "catngLevel", emoji: "🐱" },
                fox: { expKey: "foxexp", levelKey: "foxLevel", emoji: "🦊" },
                horse: { expKey: "horseexp", levelKey: "horseLevel", emoji: "🐎" }
            };
            const pet = pets[petName];
            if (!pet || !user[pet.expKey]) return null;    
            const expNeeded = 500 * Math.pow(1.1, user[pet.levelKey] || 1);
            if (user[pet.expKey] >= expNeeded) {
                const oldLevel = user[pet.levelKey] || 0;
                user[pet.levelKey] = oldLevel + 1;
                return `✨ ${pet.emoji} *PET LEVEL UP* (Lv.${oldLevel} → Lv.${user[pet.levelKey]})`;
            }
            return null;
        }        
        const levelUpMessages = [];
        const userLevelMsg = checkUserLevelUp();
        if (userLevelMsg) {
            levelUpMessages.push(userLevelMsg)
            db.users[m.sender] = user
        }
        const pets = ["dog", "cat", "fox", "horse"]
        pets.forEach(pet => {
            if (user[pet] > 0) { // buat yg punya aj 
                const petMsg = checkPetLevelUp(pet);
                if (petMsg) levelUpMessages.push(petMsg);
                db.users[m.sender] = user
            }
        });
        
        // auto level up
        if (levelUpMessages.length > 0) {
            sius.reply(m.sender, levelUpMessages.join("\n"), "🎉 L E V E L - U P", false).catch(console.error)
        
        // eval
        } else if (text.startsWith("=> ") && isOwner) {
            const code = text.slice(3)
            try {
                let result = await eval(code)
                if (typeof result !== "string") {
                    result = util.inspect(result)
                }
                await sius.sendMessage(m.chat, { text: result }, { quoted: m })
            } catch (err) {
                await m.reply(`Error:\n${err.message}`)
            }
        
        // exec
        } else if (text.startsWith("$") && isOwner) {
            const execPromise = promisify(exec)
            const commandShell = text.slice(1).trim()
            if (!commandShell) return m.reply("Perintah kosong.")
            try {
                const { stdout, stderr } = await execPromise(commandShell)
                if (stdout.trim()) {
                    m.reply(stdout)
                } else if (stderr.trim()) {
                    m.reply(`! Error:\n\n${stderr}`)
                } else {
                    m.reply("Perintah selesai tapi tidak ada output.")
                }
            } catch (err) {
                m.reply(`× Gagal:\n${err.message}`)
            }
        
        // command
        } else if (isCommand) {
            const xx = Func.isSpam(rateLimit, m.sender)
            try {
                text = text.replace(commands.prefix, "").trim()
                const [command, ...args] = text.split(" ")
                
                // antispam (premium bebas)
                if (xx && set.antispam && !isPrem) {
                    await sius.adChannel("Terdeteksi penggunaan command berlebihan! Tunggu 1 menit sebelum mengirim lagi.")
                    return
                }
                
                // didyoumean
                const allc = Object.values(commands.event).flatMap(e => [...e.command, ...(e.alias || [])])
                const result = Func.suggestCommand(command.toLowerCase(), allc)
                if (result && result.similarity < 100 && result.similarity > 70) {
                    return sius.adChannel(`🚩 Command yang kamu gunakan salah, cobalah mengikuti rekomendasi ini:

➠ *.${result.suggestion}* (${result.similarity}%)`)
                }

                // process cmd
                let executed = false
                const commandName = Object.keys(commands.event).find(k => {
                    const cmd = commands.event[k]
                    return cmd.command.includes(m.command) || cmd.name.includes(m.command)
                })
                if (db.set.money?.includes(commandName)) return m.reply(`[×] Fitur *${m.command}* sedang dinonaktifkan oleh Owner.`)
                for (const event of Object.values(commands.event)) {
                    if (!event.command.includes(command.toLowerCase()) && !(event.alias && event.alias.includes(command.toLowerCase()))) {
                        continue;
                    }
                    if (executed) break;
                    await sius.load()
                    if (event.owner && !isOwner) {
                        return m.reply(config.mess.owner)
                        executed = true
                        break;
                    }
                    if (event.group && !m.isGroup) {
                        return m.reply(config.mess.group)
                        executed = true
                        break;
                    }
                    if (event.admin && !m.isAdmin) {
                        return m.reply(config.mess.admin)
                        executed = true
                        break;
                    }
                    if (event.botAdmin && !m.isBotAdmin) {
                        return m.reply(config.mess.botAdmin)
                        executed = true
                        break;
                    }
                    if (event.premium && !isPrem) {
                        return m.reply(config.mess.prem)
                        executed = true
                        break;
                    }       
                    if (event.limited && !isOwner) {
                        if (!isLimit) {
                            return m.reply(config.mess.limit)
                            executed = true
                            break;
                        } else {
                            if (isPrem) return
                            await setLimit(m, global.db)
                            m.reply("[√] 1 limit terpakai")
                        }
                    }
                    if (m.isGroup && !m.isAdmin) {
                        if (setgroups.adminonly) {
                            return m.reply(`⚠️ Maaf, grup ini sedang dalam mode *admin only*.\n\n> Command *${m.command}* hanya bisa digunakan oleh admin grup.`);
                        }
                    }
                    
                    if (typeof event.execute === "function") {
                        const cmdName = event.command[0];
                        if (!global.db.hit[cmdName]) global.db.hit[cmdName] = 0;
                        global.db.hit[cmdName]++;
                        await event.execute({
                            sius,
                            m,
                            args,
                            Func,
                            dl,
                            command
                        })
                        executed = true
                    }
                }
            } catch (e) {
                console.log(e)
                sius.cantLoad(e)
            }
            
        } else {
            const thanksKeywords = ["makasih", "terimakasih", "thanks", "tq", "thank you","terima kasih","makasi","makacii"];
            const isOnlyThanks = thanksKeywords.some(keyword => budy === keyword);
            const ownerNumber = config.creator.split("@")[0] + "@s.whatsapp.net";
            const isTaggedOwner = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(ownerNumber);
            const isQuoted = m.quoted && m.quoted.fromMe
            const isTagged = (msg.message.conversation?.toLowerCase().includes(`@${sius.user.id.split(":")[0]}`) || msg.message.extendedTextMessage?.text.toLowerCase().includes(`@${sius.user.id.split(":")[0]}`))            
            if (isOnlyThanks) {
                const responses = ["Dengan sukacita! Semoga selalu bahagia ya~ 🌷","Sama-sama! Aku tersenyum membantu kamu, hehe~ 💕","Terima kasih atas apresiasinya! Semoga harimu cerah, ya~ ☀️","Senang bisa membantu! Jangan sungkan lagi, ya~ 🐾","Sama-sama! Semoga sukses terus, ehehe~ 🌈","Dengan senang hati! Semoga harimu penuh kebahagiaan~ 🌸","Sama-sama! Aku senang bisa bantu, hihihi~ 🌟","Terima kasih kembali! Semoga selalu ceria, ya! 🥰","Senang bisa membantu! Aku tunggu cerita suksesmu, ya~ 💖","Sama-sama! Semoga hari ini penuh keajaiban, ehehe~ 🌟","Dengan penuh cinta! Semoga harimu indah, ya~ 🌼","Sama-sama! Aku bahagia bisa membantu, hehe~ 🐼","Terima kasih atas ucapannya! Semoga sukses selalu, ya~ 🌈","Senang bisa bantu! Jangan lupa tersenyum hari ini, ya~ 😺","Sama-sama! Semoga harimu dipenuhi keberuntungan~ 🍀","Dengan kebahagiaan! Semoga selalu semangat, ya~ 🌻","Sama-sama! Aku senang bisa jadi bagian dari harimu~ 💞","Terima kasih kembali! Semoga harimu penuh tawa, ya~ 😽","Senang bisa membantu! Aku doakan yang terbaik untukmu~ 🌺","Sama-sama! Semoga harimu secerah bunga matahari, ya~ 🌞"] //bnyk bet jirla hha
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                await m.reply(randomResponse);
                
            } else if (isTaggedOwner) {
                const ownerResponses = ["Ownerku sedang sibuk, tapi aku akan sampaikan pesanmu! 😸","Wah, ownerku dipanggil! Sabar ya, aku bantu sampaikan~ 🌸","Ownerku sedang istirahat, aku gantikan dulu, ya! 🐾",
    "Makasih udah tag ownerku! Aku bantu jawab dulu, hihihi~ 💕","Ownerku sedang bekerja keras, aku bantu sampaikan pesanmu, ya~ 🌟","Sabar ya, ownerku lagi offline! Aku bantu dulu, hehe~ 🥰","Ownerku sedang sibuk, tapi aku di sini buat bantu, ya~ 🌷","Wah, ownerku dipanggil nih! Aku sampaikan pesanmu, sabar ya~ 😽","Ownerku sedang istirahat, aku gantikan dengan senang hati, ya~ 💖","Makasih udah tag! Ownerku sibuk, aku bantu jawab, ehehe~ 🌈","Ownerku sedang offline, aku bantu sampaikan pesanmu, ya! 🌼","Sabar ya, ownerku lagi busy! Aku bantu dulu, hihihi~ 🐱","Ownerku sedang rapat, aku gantikan dengan ceria, ya~ ☀️","Wah, ownerku dipanggil! Aku sampaikan pesanmu, tunggu ya~ 🌺","Ownerku sedang istirahat sejenak, aku bantu dulu, ya~ 💞","Makasih udah tag ownerku! Aku bantu jawab, sabar ya~ 🌻","Ownerku sedang sibuk, aku di sini buat bantu, hehe~ 🍀","Sabar ya, ownerku lagi offline! Aku gantikan dulu, ya~ 😺","Ownerku sedang bekerja, aku sampaikan pesanmu, tunggu ya~ 🌞","Wah, ownerku dipanggil nih! Aku bantu jawab dulu, hihihi~ 🐾"]
                const randomOwnerResponse = ownerResponses[Math.floor(Math.random() * ownerResponses.length)];
                await m.reply(randomOwnerResponse);
                
            } else if ((!m.isGroup && db.users[m.sender]?.autodl)  || (m.isGroup && (isQuoted || isTagged) && db.users[m.sender]?.autodl)) {
                await sius.load()
                const userMessage = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
                if (userMessage) {
                const genAI = new GoogleGenerativeAI("AIzaSyC1kPq2Ntf5vK7_77RuXkstTPYCdvz4y4g");                   
                let chatHistory = sius.roomAi
                if (!chatHistory[m.sender]) {
                    chatHistory[m.sender] = [];
                }
                if (chatHistory[m.sender].length > 20) {
                    chatHistory[m.sender].shift();
                }
                chatHistory[m.sender].push({ role: "user", content: text });
                const historyText = chatHistory[m.sender].map(msg => `${msg.role}: ${msg.content}`).join("\n");
                const prompt = config.prompt
                const model = genAI.getGenerativeModel({
                        model: "gemini-1.5-flash",
                        systemInstruction: prompt,
                });
                const fullPrompt = `${prompt}\n\nprevious conversation:\n${historyText}\n\nuser: ${text}`;
                const result = await model.generateContent(fullPrompt);
                const g = result.response.text();
                chatHistory[m.sender].push({ role: "assistant", content: g });
                await m.reply(g);
                }
            } else if (m.isGroup && config.owner.includes(m.sender.split("@")[0])) {
                const key = `${m.chat}-${m.sender}`
                const last = lastSapa.get(key)
                const now = Date.now()
                const sapaan = ["Hey Boss! Lagi ngopi atau ngoding nih? ☕","Halo Captain! Bug hari ini dikalahkan belum? 🦸","Waduh si Owner keren mampir! Ada urusan? 😎","Yahh pak bos datang! Butuh apa hari ini? ✨","Wkwk, akhirnya yang punya akun muncul juga~","Selamat datang kembali, sang pembuat takdirku!","Oalaa~ kalo bukan Owner siapa lagi? Ada perintah? 👀","Halo sayang~ eh salah, halo Owner maksudku 😘","Wishh.. ada yang baru aja login dengan aura coding level 99!","Bang owner! Jangan lupa istirahat ya, jangan coding mulu! 💤","Halo Master~ kalo butuh bantuan aku siap 24/7 (kecuali pas kehabisan baterai) 🔋","Busyet, nih orang ajaib muncul! Ada yang bisa aku bantu? 🎩","Halo Master! Aku udah kangen nih sama perintah-perintahmu~","Waktunya kerja nih kayaknya, Owner udah datang wkwk","Yahaha~ muncul juga si manusia legend! ✨","Asikk, Owner online! Aku jadi semangat nih~ 💪","Halo Creator! Hari ini mau bikin dunia digital apa? 🌎","Eh ad owner, panggil aku kalo butuh apa aja ya Boss!","Hadir bagaikan tetangga pas ada acara makan-makan! Ada perlu apa Owner? 😋","Halo Pak Bos! Mood coding hari ini gimana nih? 😄"];
                const greto = Func.pickRandom(sapaan)
                if (!last || now - last > 3600000) {
                    lastSapa.set(key, now)
                    sius.adChannel(greto)
                }
            }
        }
    }
}

/*
 [🫅] github: Hyzerr
 [🫅] creator: sius (hyzer xcx)
 [🫅] yg ngehapus credit hasil buatan orang itu binatang
*/
