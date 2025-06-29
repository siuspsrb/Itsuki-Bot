import { proto } from "baileys"
import moment from "moment-timezone"

commands.add({
    name: ["addlist"],
    command: ["addlist"],
    category: "store",
    desc: "tambah item ke daftar list store (balas pesan)",
    usage: "<nama list>",
    example: "harga",
    group: true,
    admin: true,
    query: true,
    run: async ({ sius, m, args }) => {
        let name = args.join(" ").toLowerCase()
        if (!m.quoted) return m.reply(`⚠️ Balas pesan yang mau disimpan`)
        if (!name) return m.reply(`⚠️ Masukkan nama list-nya`)
        let msgs = db.groups[m.chat].list || {}
        if (name in msgs) return m.reply(`⚠️ '${name}' udah ada di list`)
        let M = proto.WebMessageInfo
        msgs[name] = M.fromObject(await m.getQuotedObj()).toJSON()
        db.groups[m.chat].list = msgs
        m.reply(`[√] Berhasil menambahkan '${name}' ke List Store`)
    }
})

commands.add({
    name: ["dellist"],
    command: ["dellist"],
    category: "store",
    desc: "hapus item dari list store",
    usage: "<nama list>",
    example: "harga",
    group: true,
    admin: true,
    query: true,
    run: async ({ sius, m, args }) => {
        let name = args.join(" ").toLowerCase()
        let msgs = db.groups[m.chat].list || {}
        if (!(name in msgs)) return m.reply(`⚠️ '${name}' gak ada di list`)
        delete msgs[name]
        m.reply(`[√] Berhasil hapus list '${name}'`)
    }
})

commands.add({
    name: ["updatelist"],
    command: ["updatelist"],
    category: "store",
    desc: "update isi list store yg udah ada (balas pesan)",
    usage: "<nama list>",
    example: "tes2",
    group: true,
    admin: true,
    query: true,
    run: async ({ sius, m, args }) => {
        let name = args.join(" ").toLowerCase()
        if (!m.quoted) return m.reply(`⚠️ Balas pesan yg mau dijadikan isi baru untuk '${name}'`)
        if (!name) return m.reply(`⚠️ Masukkan nama list yg mau diupdate`)
        let msgs = db.groups[m.chat].list || {}
        if (!(name in msgs)) return m.reply(`⚠️ '${name}' belum terdaftar di list store`)
        let M = proto.WebMessageInfo
        msgs[name] = M.fromObject(await m.getQuotedObj()).toJSON()
        db.groups[m.chat].list = msgs
        m.reply(`[√] Berhasil update isi dari *${name}* di List Store`)
    }
})

commands.add({
    name: ["list"],
    command: ["list"],
    category: "store",
    desc: "tampilkan semua list yang disimpan",
    group: true,
    run: async ({ sius, m }) => {
        const msgs = db.groups[m.chat]?.list || {}
        const list = Object.keys(msgs)
        
        if (!list.length) {
            return m.reply(`⚠️ Belum ada list ditambahkan\nKetik *.addlist <nama>* untuk menambahkan.`)
        }
        const waktu = moment.tz("Asia/Jakarta").format("HH:mm")
        const greeting = ucapan()
        const userTag = "@" + m.sender.split("@")[0]
        const rows = list.map(name => ({
            title: name.toUpperCase(),
            description: `Klik untuk melihat isi list "${name}"`,
            id: name
        }))
        await sius.sendMessage(m.chat, {
            text: `📋 ${greeting} ${userTag}\nBerikut adalah daftar List Store:\n\n> 🕒 ${waktu}`,
            footer: config.bot.footer,
            buttons: [
            {
                buttonId: 'list_show',
                buttonText: { 
                    displayText: '📦 List Store' 
                },
                type: 4,
                nativeFlowInfo: {
                    name: "single_select",
                    paramsJson: JSON.stringify({
                        title: "🗂️ Daftar List Tersimpan",
                        sections: [
                        {
                           title: "List Store Aktif",
                           highlight_label: "📌 Pilih List",
                           rows
                        }
                        ]
                    })
                }
            }
            ],
            headerType: 1,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        }, { quoted: m })
    }
})

function ucapan() {
    const jam = parseInt(moment.tz("Asia/Jakarta").format("HH"))
    if (jam >= 3 && jam <= 10) return "🌅 Selamat Pagi"
    if (jam > 10 && jam <= 15) return "☀️ Selamat Siang"
    if (jam > 15 && jam <= 18) return "🌇 Selamat Sore"
    return "🌃 Selamat Malam"
}