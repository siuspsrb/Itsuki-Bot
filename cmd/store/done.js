import { createCanvas } from "canvas"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

commands.add({
    name: ["done"],
    command: ["done"],
    category: "store",
    desc: "buat struk transaksi png",
    usage: "<barang,harga,pembayaran>",
    example: "diamond ml,5000,dana",
    owner: true,
    query: true,
    run: async ({ sius, m, args }) => {
        let text = args.join(" ")
        if (!text.includes(",")) return m.reply("⚠️ format salah!\ncontoh: .done diamond,10000,dana")

        const [barang, harga, metode] = text.split(",").map(v => v.trim())
        if (!barang || !harga || !metode) return m.reply("⚠️ isi semua data: barang,harga,pembayaran")

        const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
        const canvasWidth = 600, canvasHeight = 450
        const canvas = createCanvas(canvasWidth, canvasHeight)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "#000"
        ctx.font = "bold 20px monospace"
        ctx.textAlign = "center"
        ctx.fillText("STRUK PEMBAYARAN", canvasWidth / 2, 40)

        ctx.font = "14px monospace"
        ctx.fillText(`Tanggal/Waktu: ${waktu}`, canvasWidth / 2, 65)

        ctx.textAlign = "left"
        ctx.fillText(`Layanan: ${barang}`, 20, 100)
        ctx.fillText(`Harga: Rp ${Number(harga).toLocaleString("id-ID")}`, 20, 130)
        ctx.fillText(`Metode Pembayaran: ${metode.toUpperCase()}`, 20, 160)

        ctx.beginPath()
        ctx.moveTo(20, 190)
        ctx.lineTo(canvasWidth - 20, 190)
        ctx.stroke()

        ctx.fillText(`Total Pembayaran: Rp ${Number(harga).toLocaleString("id-ID")}`, 20, 220)

        ctx.beginPath()
        ctx.moveTo(20, 250)
        ctx.lineTo(canvasWidth - 20, 250)
        ctx.stroke()

        ctx.font = "bold 14px monospace"
        ctx.textAlign = "center"
        ctx.fillText("TERIMA KASIH TELAH BERBELANJA", canvasWidth / 2, 280)
        ctx.fillText("Jangan Lupa Kembali Lagi!", canvasWidth / 2, 300)

        const tmp = path.join(__dirname, "..", "..", "lib/database/sampah")
        if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)

        const buffer = canvas.toBuffer("image/png")
        const filePath = path.join(tmp, `receipt_${Date.now()}.png`)
        fs.writeFileSync(filePath, buffer)

        const caption = `
[√] Transaksi selesai

▢ *Layanan:* ${barang}
▢ *Harga:* Rp ${Number(harga).toLocaleString("id-ID")}
▢ *Payment:* ${metode}
▢ *Tanggal:* ${waktu}
▢ *Note:* terima kasih telah percaya
        `.trim()
        m.reply({ image: fs.readFileSync(filePath), caption })
        fs.unlinkSync(filePath)
    }
})