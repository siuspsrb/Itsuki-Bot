import { JadiBot, StopJadiBot, ListJadiBot } from "../../source/jadibot.js"
import fs from "fs" 
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = (url) => dirname(fileURLToPath(url))

commands.add({ 
    name: ["jadibot"], 
    command: ["jadibot"], 
    category: "jadibot", 
    premium: false,
    desc: "menjadi bot dan clone bot kami", 
    run: async({ sius, m, args, Func }) => { 
        const text = args.join(" ") 
        const nmrnya = text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : m.sender 
        const onWa = await sius.onWhatsApp(nmrnya) 
        if (!onWa.length > 0) return m.reply("[×] Nomor tersebut tidak terdaftar di Whatsapp!")
        const newClient = sius.decodeJid(sius.user.id)
        const mainBot = Func.formatNumber(config.bot.number)
        const clients = global.jadibot || {}
        const keys = Object.keys(clients)
        const on = Object.keys(clients).filter(jid => clients[jid]?.ws?.socket?.readyState === 1)
        if (newClient !== mainBot) return m.reply(`[×] Perintah ini hanya bisa dijalankan di bot utama, klik link di bawah ini untuk menuju akun bot utama kami!\nhttps://wa.me/${config.bot.number}?text=.menu`)
        const maxClients = 5
        if (on.length >= maxClients) return m.reply(`[🔐] Batas jadibot telah mencapai maksimal (${maxClients}). Silahkan tunggu ada slot kosong.`)
        await JadiBot(sius, nmrnya, m)
    }
})

commands.add({
    name: ["stopjadibot"],
    command: ["stopjadibot"],
    category: "jadibot",
    //premium: true,
    desc: "berhanti menjadi bot dan clone bot kami",
    run: async({ sius, m, args }) => {
        const text = args.join(" ")
		const nmrnya = text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : m.sender
		const onWa = await sius.onWhatsApp(nmrnya)
		if (!onWa.length > 0) return m.reply("Nomor Tersebut Tidak Terdaftar Di Whatsapp!")
		await StopJadiBot(sius, nmrnya, m)
	}
})

commands.add({
    name: ["listjadibot"],
    command: ["listjadibot"],
    category: "jadibot",
    alias: ["listbot","clients"],
    desc: "menampilkan status semua client jadibot yg terhubung",
    owner: true,
    run: async ({ sius, m, Func }) => {
        try {
            const clients = global.jadibot || {}
            const keys = Object.keys(clients)
            const total = Object.keys(clients).length
            const on = Object.keys(clients).filter(jid => clients[jid]?.ws?.socket?.readyState === 1)
            if (!total) return m.reply("[×] Tidak ada client yang sedang aktif.")
            let txt = `☷  *I N F O - C L I E N T S*\n\n`
            txt += `Total client aktif: *${on.length}*\n\n`
            keys.forEach((jid, i) => {
                let cl = clients[jid]
                let user = cl.user || {}
                let status = cl.ws?.socket?.readyState === 1 ? "√" : "×"
                let displayName = user.name || "Tanpa Nama"
                txt += `${i + 1} *${displayName}*\n`
                txt += `   ├ @${jid.split("@")[0]}\n`
                txt += `   └ Status: ${status}\n`
            })
            txt += `\n> √: Terhubung\n> ×: Putus koneksi`
            m.reply(txt.trim())
        } catch (e) {
            console.error(e)
            m.reply("[×] Gagal mengambil data client.")
        }
    }
})

commands.add({
    name: ["clearclients"],
    command: ["clearclients"],
    category: "jadibot",
    desc: "menghapus client yang koneksinya sudah terputus",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        try {
            const clients = global.jadibot || {}
            const baseDir = path.join(__dirname(import.meta.url), "../../media/database/jadibot")
            const keys = Object.keys(clients)
            if (!keys.length) return m.reply("[×] Tidak ada client aktif")
            let removed = 0
            for (let jid of keys) {
                const client = clients[jid]
                const isConnected = client.ws?.socket?.readyState === 1
                if (!isConnected) {
                    delete global.jadibot[jid]
                    const folderName = jid.split("@")[0]
                    const sessionPath = path.join(baseDir, folderName)
                    if (fs.existsSync(sessionPath)) {
                        fs.rmSync(sessionPath, { recursive: true, force: true })
                    }
                    removed++
                }
            }
            if (removed === 0) return m.reply("[×] Tidak ada client yang putus koneksi")
            m.reply(`[√] Berhasil menghapus ${removed} client yang putus koneksi`)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})