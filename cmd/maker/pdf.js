import PDFDocument from "pdfkit"
import { createWriteStream } from "fs"
import { tmpdir } from "os"
import path from "path"

commands.add({
    name: ["pdf","buatpdf"],
    command: ["pdf", "buatpdf"],
    category: "tools",
    desc: "Convert teks jadi file PDF",
    usage: "<teks>",
    limit: true,
    run: async ({ sius, m, args }) => {
        const text = m.quoted?.text || args.join(" ")
        if (!text) return m.reply("⚠️ Masukin teks yang mau dijadiin PDF, bisa juga reply ke pesan teks.\n\nContoh: *.pdf halo dunia*")

        const filename = path.join(tmpdir(), `${m.sender.split("@")[0]}-${Date.now()}.pdf`)
        const output = createWriteStream(filename)

        const doc = new PDFDocument()
        doc.pipe(output)
        doc.fontSize(16).text(text, { align: "left" })
        doc.end()

        // biar g error om wkwk
        await new Promise((resolve, reject) => {
            output.on("finish", resolve)
            output.on("error", reject)
        })

        await sius.sendMessage(m.chat, {
            document: { url: filename },
            mimetype: "application/pdf",
            fileName: "hasil.pdf"
        }, { quoted: m })
    }
})