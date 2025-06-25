import moment from "moment-timezone"

commands.add({
    name: ["proses"],
    command: ["proses"],
    category: "store",
    desc: "notifikasi pesanan sedang diproses",
    usage: "<barang,harga,pembayaran>",
    example: "diamond ml,10000,dana",
    owner: true,
    query: true,
    run: async ({ sius, m, args }) => {
        let text = args.join(" ")
        if (!text.includes(",")) return m.reply("⚠️ format salah!\ncontoh: .proses diamond,5000,dana")
        const [barang, harga, metode] = text.split(",").map(v => v.trim())
        if (!barang || !harga || !metode) return m.reply("⚠️ format gak lengkap!\ncontoh: .proses barang,harga,pembayaran")
        const waktu = moment().tz("Asia/Jakarta")
        const tampilTanggal = waktu.format("dddd, DD MMMM YYYY")
        const tampilWaktu = waktu.format("HH:mm:ss")
        const caption = `
[√] Pesanan sedang diproses...

▢ *Layanan:* ${barang}
▢ *Harga:* Rp ${Number(harga).toLocaleString("id-ID")}
▢ *Payment:* ${metode.toUpperCase()}
▢ *Tanggal:* ${tampilTanggal}
▢ *Waktu:* ${tampilWaktu} WIB

harap tunggu sebentar ya... pesanan sedang kami proses 😊
        `.trim()

        sius.reply(m.chat, caption, ucapan(), false)
    }
})

function ucapan() {
    const jam = moment().tz("Asia/Jakarta").hour()
    if (jam >= 4 && jam < 10) return "🌅 Selamat Pagi"
    if (jam >= 10 && jam < 15) return "☀️ Selamat Siang"
    if (jam >= 15 && jam < 18) return "🌇 Selamat Sore"
    return "🌃 Selamat Malam"
}