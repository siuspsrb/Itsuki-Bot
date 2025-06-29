import fs from "fs"
import pino from "pino"
import store from "./store.js"
import path from "path"
import { Boom } from "@hapi/boom"
import NodeCache from "node-cache"
import { exec, spawn, execSync } from "child_process"
import baileys from "baileys"
import { GroupCacheUpdate, GroupParticipantsUpdate, MessagesUpsert } from "./update.js"
import { Solving } from "./message.js"
import config from "../settings.js"

const { default: WAConnection, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, proto, getAggregateVotesInPollMessage } = baileys
const client = {};
const isStopping = {}
const msgRetryCounterCache = new NodeCache();
global.jadibot = client
global.muteJadiBot = true
const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });

async function JadiBot(conn, from, m) {
	async function startJadiBot() {
		try {
			const { state, saveCreds } = await useMultiFileAuthState(`./lib/database/jadibot/${from}`);
			const { version, isLatest } = await fetchLatestBaileysVersion();
			const level = pino({ level: "silent" })
			
			const getMessage = async (key) => {
				if (store) {
					const msg = await store.loadMessage(key.remoteJid, key.id);
					return msg?.message || ""
				}
				return {
					conversation: "Halo Saya Adalah Bot"
				}
			}
		
			client[from] = WAConnection({
				isLatest,
				logger: level,
				getMessage,
				syncFullHistory: false,
				maxMsgRetryCount: 15,
				msgRetryCounterCache,
				retryRequestDelayMs: 10,
				defaultQueryTimeoutMs: 0,
				printQRInTerminal: false,
				cachedGroupMetadata: async (jid) => groupCache.get(jid),
				browser: Browsers.ubuntu("Chrome"),
				transactionOpts: {
					maxCommitRetries: 10,
					delayBetweenTriesMs: 10,
				},
				appStateMacVerification: {
					patch: true,
					snapshot: true,
				},
				auth: {
					creds: state.creds,
					keys: makeCacheableSignalKeyStore(state.keys, level),
				},
			})
			
			if (!client[from].authState.creds.registered) {
				let phoneNumber = from.replace(/[^0-9]/g, "")
				setTimeout(async () => {
					exec("rm -rf ./lib/database/jadibot/" + from + "/*")
					let code = await client[from].requestPairingCode(phoneNumber, "SIUSPSRB");
					let th = fs.readFileSync("./lib/database/jadibot.jpg")
					let pb = `*[ JADIBOT ]*

1. Pada halaman utama Whatsapp, tekan *( ⋮ )* di sudut kanan atas dan pilih *Perangkat Tertaut*.
2. Ketuk "Tautkan dengan nomor telepon saja"
3. Masukan kode ini : *${code?.match(/.{1,4}/g)?.join("-") || code}*
4. Kode akan kedaluwarsa dalam 60 detik.
5. Gunakan .stopjadibot untuk berhenti
`.trim()
					m.reply({ image: th, caption: pb })
					//m.reply(`Your Pairing Code : ${code?.match(/.{1,4}/g)?.join("-") || code}`);
				}, 3000)
			}
			
			store.bind(client[from].ev)
			
			await Solving(client[from], store)
			
			client[from].ev.on("creds.update", saveCreds)
			
			client[from].ev.on("connection.update", async (update) => {
				const { connection, lastDisconnect, receivedPendingNotifications } = update
				if (connection === "close") {
					const reason = new Boom(lastDisconnect?.error)?.output.statusCode
					if ([DisconnectReason.connectionLost, DisconnectReason.connectionClosed, DisconnectReason.restartRequired, DisconnectReason.timedOut, DisconnectReason.badSession, DisconnectReason.connectionReplaced].includes(reason)) {
						if (!isStopping[from]) JadiBot(conn, from, m);
					} else if (reason === DisconnectReason.loggedOut) {
						m.reply("⚠️ Scan again and run...");
						StopJadiBot(conn, from, m)
					} else if (reason === DisconnectReason.Multidevicemismatch) {
						m.reply("⚠️ Scan again...");
						StopJadiBot(conn, from, m)
					} else {
						m.reply("⚠️ Anda Sudah tidak lagi menjadi bot !!")
					}
				}
				if (connection == "open") {
				    m.reply("[√] Akun WhatsApp mu telah berhasil terhubung !!")
					let botNumber = await client[from].decodeJid(client[from].user.id);
					if (db.set[botNumber] && !db.set[botNumber]?.join) {
						db.set[botNumber].original = false
						if (config.channel.length > 0 && config.channel.includes("@newsletter")) {
							if (config.channel) await client[from].newsletterMsg(config.channel, { type: "follow" }).catch(e => {})
							db.set[botNumber].join = true
						}
					}
				}
				if (receivedPendingNotifications == "true") {
					client[from].ev.flush()
				}
			});
			
			client[from].ev.on("contacts.update", (update) => {
				for (let contact of update) {
					let id = client[from].decodeJid(contact.id)
					if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
				}
			});
			
			client[from].ev.on("call", async (call) => {
				let botNumber = await client[from].decodeJid(client[from].user.id);
				if (db.set[botNumber].anticall) {
					for (let id of call) {
						if (id.status === "offer") {
							let msg = await client[from].sendMessage(id.from, { text: `Saat Ini, Kami Tidak Dapat Menerima Panggilan ${id.isVideo ? "Video" : "Suara"}.\nJika @${id.from.split("@")[0]} Memerlukan Bantuan, Silakan Hubungi Owner :)`, mentions: [id.from]});
							await client[from].sendContact(id.from, config.owner, msg);
							await client[from].rejectCall(id.id, id.from)
						}
					}
				}
			});
			
			client[from].ev.on("groups.update", async (update) => {
				await GroupCacheUpdate(client[from], update, store, groupCache);
			});
			
			client[from].ev.on("group-participants.update", async (update) => {
				await GroupParticipantsUpdate(client[from], update, store, groupCache);
			});
			
			client[from].ev.on("messages.upsert", async (message) => {
    try {
        let msg = message.messages?.[0]
        if (!msg || msg.key?.fromMe) return

        // auto mute grup kalau bukan bot utama
        if (global.muteJadiBot && msg.key.remoteJid.endsWith("@g.us")) {
            let botUtama = config.bot.number.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            let isBotUtama = client[from].user?.id?.includes(config.bot.number.replace(/[^0-9]/g, ""))
            if (!isBotUtama) {
                let metadata = await client[from].groupMetadata(msg.key.remoteJid).catch(() => null)
                if (metadata?.participants?.some(p => p.id === botUtama)) {
                    return // skip total, karena ada bot utama di grup:v
                }
            }
        }

        // eksekusi normal
        await MessagesUpsert(client[from], message, store, groupCache)

    } catch (e) {
        console.log("mutejadibot error:", e)
    }
})
		
			return client[from]
		} catch (e) {
			console.log("Error di jadibot : ", e)
		}
	}
	return startJadiBot()
}

async function StopJadiBot(conn, from, m) {
	if (!Object.keys(client).includes(from)) {
		return conn.sendMessage(m.chat, { text: "⚠️ Anda tidak sedang jadibot!" }, { quoted: m })
	}
	try {
	    isStopping[from] = true
		client[from].end("Stop")
		client[from].ev.removeAllListeners()
	} catch (e) {
		console.log("Errornya di stopjadibot : ", e)
	}
	delete client[from]
	exec(`rm -rf ./lib/database/jadibot/${from}`)
	return m.reply("[√] Sukses keluar dari sessi jadi bot")
	setTimeout(() => delete isStopping[from], 3000)
}

async function AutoReloadJadiBot(conn) {
    const basePath = "./lib/database/jadibot"
    if (!fs.existsSync(basePath)) return
    const sessions = fs.readdirSync(basePath).filter(name => {
        let fullPath = `${basePath}/${name}`
        return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
    })
    for (let name of sessions) {
        try {
            await JadiBot(conn, name, {
                reply: () => {} // dummy pesan object
            })
            console.log("[√] Reload session jadibot:", name)
        } catch (err) {
            console.log("⚠️ Gagal reload jadibot:", name, "-", err.message)
        }
    }
}

async function ListJadiBot(conn, m) {
	let teks = "LIST JADI BOT :\n\n"
	for (let jadibot of Object.values(client)) {
		teks += `▢ @${conn.decodeJid(jadibot.user.id).split("@")[0]}\n`
	}
	return m.reply(teks)
}

export { JadiBot, StopJadiBot, ListJadiBot, AutoReloadJadiBot }