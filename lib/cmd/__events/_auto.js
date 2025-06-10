import fs from "fs/promises"
import cron from "node-cron"

export default { 
    name: "auto-handler", 
    exec: async ({ sius, m, Func }) => {
        const bot = sius.decodeJid(sius.user.id)
        const listowner = config.owner
        const prem = db.prem
        let set = db.set[bot]
        // autoread
        if (set.autoread) {
            try {
                await sius.readMessages([m.key])
            } catch (e) {
                console.log("[ AUTO READ ERROR ]", e)
            }
        }
        // auto bio
        if (set.autobio && (new Date() - set.status > 60000)) {
            try {
                await sius.updateProfileStatus(`🌊 ${sius.user.name} | Runtime : ${Func.runtime(process.uptime())}`)
                set.status = new Date() * 1
            } catch (e) {
                console.log("[ AUTO BIO ERROR ]", e)
            }
        }
        // auto reset limit & backup db
        let isSent = false
        cron.schedule("00 00 * * *", async () => {
            for (let o of listowner) {
                if (isSent) continue; // fix bug spam
                try {
                    await sius.sendMessage(o + "@s.whatsapp.net", { text: "[√] Berhasil melakukan reset limit kepada seluruh pengguna bot!" })
                    isSent = true
                } catch (e) {
                    console.log("[ × RESET LIMIT ]", e)
                }
            }
            console.log("[√] LIMIT USERS DIRESET")
            let users = Object.keys(db.users)
            for (let jid of users) {
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
                        await sius.sendMessage(o + "@s.whatsapp.net", { document: fs.readFileSync(datanya), mimetype: "application/json", fileName: tglnya + "_database.json" })
                        console.log(`[ AUTO BACKUP ] [√] Backup database berhasil dikirim ke ${o}`)
                    } catch (e) {
                        console.error(`[ AUTO BACKUP ] × Gagal mengirim backup database ke ${o}:`, e)
                    }
                }
            }
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        })
    }
}