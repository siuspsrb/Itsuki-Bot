import store from "./store.js"
import fs from "fs"
import pino from "pino"
import chalk from "chalk"
import readline from "readline"
import NodeCache from "node-cache"
import baileys from "@adiwajshing/baileys"
import config from "../../settings.js"
import DataBase from "./database.js"
import qrcode from "qrcode-terminal"
import { Boom } from "@hapi/boom"
import parse from "awesome-phonenumber"
import { exec } from "child_process"
import EventEmitter from "events"
EventEmitter.defaultMaxListeners = 100;
import { readFile } from "fs/promises"
import { AutoReloadJadiBot } from "./jadibot.js"
import {
    GroupCacheUpdate,
    GroupParticipantsUpdate,
    MessagesUpsert
} from "./update.js"
import {
    Solving
} from "./message.js"
import {
    generateMessageTag,
    getBuffer,
    getSizeMedia,
    fetchJson,
    sleep
} from "./functions.js"
import express from "express"
import { createServer } from "http"

const app = express()
const server = createServer(app)
const PORT = config.PORT || 3000
const {
    default: WAConnection,
    useMultiFileAuthState,
    Browsers,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion
} = baileys
const pairingCode = process.argv.includes("--qr") ? false : process.argv.includes("--pairing-code") || true
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
let pairingStarted = false

const packageJson = JSON.parse(await readFile(new URL("../../package.json", import.meta.url)))
const database = new DataBase(config.database)
const msgRetryCounterCache = new NodeCache()
const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false })

/*
 * Create By Sius
 * Follow https://github.com/siuspsrb
 */
    
server.listen(PORT, () => {
	console.log("App listened on port", PORT)
})

async function startSiusBot() {
    const { state, saveCreds } = await useMultiFileAuthState("sius")
    const { version } = await fetchLatestBaileysVersion()
    const level = pino({ level: "silent" })
    try {
        const loadData = await database.read()
        if (loadData && Object.keys(loadData).length === 0) {
            global.db = {
                hit: {},
                set: {},
                users: {},
                game: {},
                groups: {},
                database: {},
                premium: [],
                sewa: [],
                events: {},
                guilds: {},
                menfess: {},
                ...(loadData || {}),
            }
            await database.write(global.db)
        } else {
            global.db = loadData
        }
        setInterval(async () => {
            if (global.db) await database.write(global.db)
        }, 30 * 1000)
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
    const getMessage = async (key) => {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message || ""
        }
        return {
            conversation: "Halo Saya Sius Bot"
        }
    }
    const sius = WAConnection({
        logger: level,
        getMessage,
        syncFullHistory: true,
        maxMsgRetryCount: 15,
        msgRetryCounterCache,
        retryRequestDelayMs: 10,
        connectTimeoutMs: 60000,
        printQRInTerminal: !pairingCode,
        browser: Browsers.ubuntu("Chrome"),
        generateHighQualityLinkPreview: true,
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
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
    store.bind(sius.ev)
    await Solving(sius, store)
    
    sius.ev.on("creds.update", saveCreds)
    
    setInterval(() => {
        sius.sendPresenceUpdate("available")
    }, 60000)
    
    sius.ev.on("connection.update", async (update) => { 
        const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications } = update
        if ((connection == "connecting" || !!qr) && pairingCode && !sius.authState.creds.registered && !pairingStarted) {
            pairingStarted = true
            let phoneNumber
            async function getPhoneNumber() {
                phoneNumber = config.bot.number ? config.bot.number : await question("Please type your WhatsApp number : ")
                phoneNumber = phoneNumber.replace(/[^0-9]/g, "")

                if (phoneNumber.length < 6) {
                    console.log(chalk.bgBlack(chalk.redBright("Start with your Country WhatsApp code") + chalk.whiteBright(",") + chalk.greenBright(" Example : 62xxx")))
                    await getPhoneNumber()
                }
            }
            setTimeout(async () => {
                await getPhoneNumber()
                await exec("rm -rf ../../sius/*")
                console.log("Requesting Pairing Code...")
                await new Promise(resolve => setTimeout(resolve, 5000))
                let code = await sius.requestPairingCode(phoneNumber, "ITSUKIMD")
                console.log(`Your Pairing Code : ${code}`)
            }, 3000)
        }

        if (connection == "close") {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if ([DisconnectReason.connectionLost, DisconnectReason.connectionClosed, DisconnectReason.restartRequired, DisconnectReason.timedOut].includes(reason)) {
                console.log("Disconnected. Reconnecting...")
                startSiusBot()
            } else if ([DisconnectReason.badSession, DisconnectReason.loggedOut, DisconnectReason.forbidden, DisconnectReason.multideviceMismatch].includes(reason)) {
                console.log("Session invalid. Please re-scan QR.")
                exec("rm -rf ../../sius/*")
                process.exit(1)
            } else {
                sius.end(`Unknown DisconnectReason : ${reason}|${connection}`)
            }
        }
        if (connection === "open") {
            console.log('Connected to : ' + JSON.stringify(sius.user, null, 2));
            sius.sendMessage(config.creator, { text: "[√] Connected!" })
            await AutoReloadJadiBot(sius)
            const botNumber = await sius.decodeJid(sius.user.id)

            if (global.db?.set[botNumber] && !global.db?.set[botNumber]?.join) {
                if (config.channel?.length > 0 && config.channel.includes("@newsletter")) {
                    await sius.newsletterMsg(config.channel, { type: "follow" }).catch(() => {})
                    global.db.set[botNumber].join = true
                }
            }
        }
        if (isNewLogin) console.log(chalk.green("New device login detected"))
        if (receivedPendingNotifications) {
            console.log("Please wait about 1 minute...")
            sius.ev.flush()
        }
    })
    sius.ev.on("contacts.update", (update) => {
        for (const contact of update) {
            const id = sius.decodeJid(contact.id)
            if (store?.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })
    /*
    sius.ev.on("qr", qr => {
        console.info("Loading QR Code for WhatsApp, Please Scan...")
        qrcode.generate(qr, { small: true })
    })
    */
    sius.ev.on("call", async (call) => {
        const botNumber = await sius.decodeJid(sius.user.id)
        if (global.db?.set[botNumber]?.anticall) {
            for (const callItem of call) {
                if (callItem.status === "offer") {
                    const msg = await sius.sendMessage(
                        callItem.from,
                        {
                            text: `Saat ini, kami tidak dapat menerima panggilan ${callItem.isVideo ? "video" : "suara"}.\nJika @${callItem.from.split("@")[0]} memerlukan bantuan, silakan hubungi owner :)`,
                            mentions: [callItem.from]
                        }
                    )
                    await sius.sendContact(callItem.from, config.owner, msg)
                    await sius.rejectCall(callItem.id, callItem.from)
                }
            }
        }
    })
    sius.ev.on("messages.upsert", async (message) => {
        await MessagesUpsert(sius, message, store, groupCache)
    })
    sius.ev.on("groups.update", async (update) => {
        await GroupCacheUpdate(sius, update, store, groupCache)
    })
    sius.ev.on("group-participants.update", async (update) => {
        await GroupParticipantsUpdate(sius, update, store, groupCache)
    })
    /*
    setInterval(async () => {
        await sius.sendPresenceUpdate("available", sius.decodeJid(sius.user.id)).catch(() => {})
    }, 10 * 60 * 1000)
    */
    return sius
}

//Func.printStartupBanner()

startSiusBot().catch(err => {
    console.error("Failed to start bot:", err)
})

process.on("exit", async () => {
    if (global.db) await database.write(global.db)
    console.log("Cleaning up...")
	server.close(() => {
		console.log("Server closed successfully.")
	})    
})

process.on("uncaughtException", err => {
    console.error("uncaughtException:", err)
})

process.on("unhandledRejection", err => {
    console.error("unhandledRejection:", err)
})

process.on("SIGINT", async () => {
	if (global.db) await database.write(global.db)
	console.log("Received SIGINT. Closing server...")
	server.close(() => {
		console.log("Server closed. Exiting process.")
		process.exit(0)
	})
})

server.on("error", (error) => {
	if (error.code === "EADDRINUSE") {
		console.log(`Address localhost:${PORT} in use. Please retry when the port is available!`)
		server.close()
	} else console.error("Server error:", error)
})