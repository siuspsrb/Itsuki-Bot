import chalk from "chalk"
import util from "util"
import path from "path"
import fs from "fs"
import dl from "./scrape.js"
import infobot from "../../settings.js"
import * as Func from "./functions.js"
import * as prem from "./premium.js"
import { exec } from "child_process"
import { fileURLToPath } from "url"
import { setLimit } from "./game.js"
import { 
    GoogleGenerativeAI 
} from "@google/generative-ai"
import { 
    GroupUpdate, 
    LoadDataBase 
} from "./update.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { autoLoadAllJS } = Func;
const lastSapa = new Map()
const warnedUsers = new Map()

global.commands = new Func.botEvents()
global.config = infobot
global.cmdLogs = []
global.rateLimit = new Map()
global.events = []

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
    const isLimit = db.users[m.sender] ? (db.users[m.sender].limit > 0) : false
    const botNumber = await sius.decodeJid(sius.user.id);
    const set = db.set[botNumber]
    const listowner = config.owner
    const isOwner = listowner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
    const setgroups = db.groups[m.chat]
    const isPrem = prem.checkPremiumUser(m.sender, db.premium)
    sius.public = true
    const budy = (typeof m.text == "string" ? m.text :"")
        
    // lapor owner biar di fix (kalau bsa wkwk)
    sius.cantLoad = async(e) => {
        const stack = e.stack || "No stack trace";
        const fileMatch = stack.match(/at\s.*?\((.*?):(\d+):(\d+)\)/) || stack.match(/at\s(.*?):(\d+):(\d+)/);
        const fileInfo = fileMatch ? `${fileMatch[1]}:${fileMatch[2]}` : "Unknown file";
        const errorMsg = `*HALO PAK 🫡, LAPORAN ERROR!*\n\n*Message*: ${e.message || e}\n*File*: ${fileInfo}\n*stack*:\n${stack.slice(0, 500)}`;
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
    	
    const evFiles = fs.readdirSync("./lib/cmd/__events").filter(v => v.endsWith(".js"))
    //let eventsRan = false
    for (const file of evFiles) {
        const { default: ev } = await import(`../cmd/__events/${file}`)
        if (ev?.exec && typeof ev.exec === "function") {
            events.push(ev)
        }
    }
    for (const ev of events) {
        try {
            const result = await ev.exec({ sius, m, Func, msg, store });
            //eventsRan = true;
            if (result !== false) break;
        } catch (err) {
            sius.cantLoad(err)
        }
    }

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
                return sius.reply(m.chat, `Bot saat ini berjalan dalam mode *Group Only*. Akses melalui *PC / Private Chat* hanya tersedia untuk Premium User (akses penuh).

[√] Pilihan tersedia:
    ▢ Dapatkan status premium: ketik *.premium*
    ▢ Join grup publik bot: ${config.bot.group}   

📌 Fitur tetap bisa digunakan, tapi hanya dari dalam grup.`.trim(), "A C C E S S - D E N I E D", true)
            }
            return;
        }
    }
		
	// cek expired
	prem.expiredCheck(sius, db.premium)

    async function loadCommands() {
        commands.event = {}
        const cmdpath = path.join(__dirname, "../cmd")
        const commandFiles = fs.readdirSync(cmdpath).filter(file => file.endsWith(".js"))
        for (const file of commandFiles) {
            try {
                const filePath = path.join(cmdpath, file)
                const fileUrl = `file://${filePath}?update=${Date.now()}`
                await import(fileUrl)
                console.log(`[ LOAD ] Loaded command: ${file}`)
                global.cmdLogs.push({
                    type: "add",
                    file: file,
                    time: new Date().toLocaleString("id"),
                    status: "Loaded successfully"
                })
            } catch (err) {
                console.error(`[ ERROR ] Loading command ${file}:`, err)
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
            console.log(`[ RELOAD ] Detected ${eventType} in ${filename}`)
            try {
                const filePath = path.join(cmdpath, filename)
                const fileUrl = `file://${filePath}?update=${Date.now()}`
                if (!fs.existsSync(filePath)) {
                    console.log(`[ DELETE ] ${filename} deleted, reloading all...`)
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
                console.log(`[ RELOAD ] Reloaded command: ${filename}`)
                global.cmdLogs.push({
                    type: "update",
                    file: filename,
                    time: new Date().toLocaleString("id"),
                    status: "Reloaded successfully"
                })
            } catch (err) {
                console.error(`[ ERROR ] Reloading ${filename}:`, err)
                global.cmdLogs.push({
                    type: "error",
                    file: filename,
                    time: new Date().toLocaleString("id"),
                    status: `Error: ${err.message}`
                })
            }
        })
    }

    setupHotReload();

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
            const execPromise = util.promisify(exec)
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
                let chatHistory = db.game.chat_ai
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
                if (!last || now - last > 10000000) {
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