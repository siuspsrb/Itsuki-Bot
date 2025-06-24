import PDFDocument from "pdfkit"
import axios from "axios"
import QRCode from "qrcode"
import { promises as fs } from "fs"
import { createWriteStream } from "fs"
import { tmpdir } from "os"
import path from "path"

commands.add({
    name: ["ebook","text2book"],
    command: ["ebook", "buku", "bukupdf"],
    category: "pdf-maker",
    desc: "Ubah teks panjang jadi format eBook PDF",
    usage: "<isi_ebook>",
    example: "ini adalah cerita tentang perjalanan sius ke dunia anime..",
    query: false,
    limit: true,
    run: async ({ sius, m, args }) => {
        const text = m.quoted?.text || args.join(" ")
        if (!text || text.length < 100) return m.reply("⚠️ Masukin teks yang cukup panjang (minimal 100 karakter) untuk dijadikan eBook.\nBisa juga reply ke pesan panjang.")
        const filename = path.join(tmpdir(), `ebook-${m.sender.split("@")[0]}-${Date.now()}.pdf`)
        const stream = createWriteStream(filename)
        const isT = m.args?.length > 10
        const Y = m.quoted && isT ? m.args.join(" ") : "E - BOOK By Itsuki Nakano Bot"
        const doc = new PDFDocument({ size: "A5", margins: { top: 50, bottom: 50, left: 40, right: 40 } })
        doc.pipe(stream)
        // judul sementara di atas
        doc.fontSize(16).text(Y, {
            align: "center"
        })
        doc.moveDown(2)
        // isi ebook
        doc.fontSize(11).text(text, {
            align: "justify",
            lineGap: 4
        })
        doc.end()
        await new Promise((resolve, reject) => {
            stream.on("finish", resolve)
            stream.on("error", reject)
        })
        await sius.sendMessage(m.chat, {
            document: { url: filename },
            mimetype: "application/pdf",
            fileName: "ebook.pdf"
        }, { quoted: m })
    }
})

commands.add({
    name: ["quote2pdf","pdfquotes"],
    command: ["quote2pdf", "pdfquotes"],
    category: "pdf-maker",
    desc: "Bikin PDF dari quote (teks)",
    usage: "<quote>",
    query: true,
    example: "hiduplah seperti larry",
    limit: true,
    run: async ({ sius, m, args }) => {
        const text = m.quoted?.text || args.join(" ")
        const filename = path.join(tmpdir(), `quote-${m.sender.split("@")[0]}-${Date.now()}.pdf`)
        const stream = createWriteStream(filename)
        const doc = new PDFDocument({ size: "A4", margins: { top: 72, bottom: 72, left: 72, right: 72 } })
        doc.pipe(stream)
        doc.fontSize(20).fillColor("#555").text(`“${text}”`, {
            align: "center",
            lineGap: 10
        })
        doc.moveDown(2)
        doc.fontSize(12).fillColor("#888").text(`— diketik oleh ${m.pushName}`, {
            align: "center"
        })
        doc.end()
        await new Promise((resolve, reject) => {
            stream.on("finish", resolve)
            stream.on("error", reject)
        })
        await sius.sendMessage(m.chat, {
            document: { url: filename },
            mimetype: "application/pdf",
            fileName: "quote.pdf"
        }, { quoted: m })
    }
})

commands.add({
    name: ["pdf", "createpdf"],
    command: ["pdf", "createpdf"],
    category: "pdf-maker",
    desc: "Buat dokumen PDF dari teks",
    usage: "<teks>",
    example: "laporan harian",
    query: true,
    run: async ({ m, args }) => {
        const text = args.join(" ");
        const doc = new PDFDocument();
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);
            m.reply({ 
                document: pdfData, 
                mimetype: "application/pdf", 
                fileName: "document.pdf" 
            });
        });
        doc.fontSize(12)
           .text(text, { align: "left", indent: 30 });
        doc.end();
    }
});

commands.add({
    name: ["pdftable", "pdfgrid"],
    command: ["pdftable", "pdfgrid"],
    category: "pdf-maker",
    desc: "Buat PDF dengan tabel",
    usage: "<header1,header2|row1col1,row1col2|row2col1,row2col2>",
    example: "Nama,Umur|John,25|Doe,30",
    query: true,
    run: async ({ m, args }) => {
        if (!args.length) return m.reply("⚠️ Masukkan data tabel");
        const tableData = args.join(" ").split("|").map(row => row.split(","));
        if (tableData.length < 2) return m.reply("⚠️ Format tabel salah");
        const doc = new PDFDocument();
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);
            m.reply({ 
                document: pdfData, 
                mimetype: "application/pdf", 
                fileName: "table.pdf" 
            });
        });
        const startY = 50;
        const startX = 50;
        const colWidths = Array(tableData[0].length).fill(100);
        doc.font("Helvetica-Bold")
           .fontSize(12);
        tableData[0].forEach((cell, i) => {
            doc.text(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, {
                width: colWidths[i],
                align: "center"
            });
        });
        doc.moveTo(startX, startY + 20)
           .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), startY + 20)
           .stroke();
        // isi tabel
        doc.font("Helvetica");
        tableData.slice(1).forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                doc.text(cell, startX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), 
                    startY + 30 + (rowIndex * 20), {
                    width: colWidths[colIndex],
                    align: "center"
                });
            });
        });
        doc.end();
    }
});

commands.add({
    name: ["pdfimg", "pdfimage"],
    command: ["pdfimg", "pdfimage"],
    category: "pdf-maker",
    desc: "Buat PDF dengan gambar dari reply",
    usage: "<teks>",
    example: "laporan",
    query: true,
    run: async ({ sius, m, args, Func }) => {
        const q = m.quoted || m;
        const mime = (q.msg || q).mimetype || q.mediaType || "";
        if (!mime || !mime.startsWith("image/")) {
            return m.reply(`⚠️ Reply gambar dengan caption ${m.prefix + m.command} <teks>`);
        }
        const text = args.join(" ");
        if (!text) return m.reply("⚠️ Masukkan teks untuk dokumen");
        try {
            const mediaBuffer = await sius.downloadMediaMessage(q);
            const doc = new PDFDocument();
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", async () => {
                const pdfData = Buffer.concat(buffers);
                await m.reply({ 
                    document: pdfData, 
                    mimetype: "application/pdf", 
                    fileName: "document_with_image.pdf" 
                });
            });
            // tambahkan gambar dari buffer
            doc.image(mediaBuffer, {
                fit: [400, 300],
                align: "center",
                valign: "center"
            });
            doc.moveDown()
               .fontSize(12)
               .text(text, { align: "left" });
            doc.end();
        } catch (error) {
            console.error(error);
            m.reply("⚠️ Gagal memproses gambar");
        }
    }
});

commands.add({
    name: ["pdfqr", "pdfqrcode"],
    command: ["pdfqr", "pdfqrcode"],
    category: "pdf-maker",
    desc: "Buat PDF dengan QR Code dari teks/reply",
    usage: "<teks> atau reply pesan",
    example: "https://example.com",
    run: async ({ m, args }) => {
        const text = m.quoted?.text || args.join(" ");
        if (!text) return m.reply("⚠️ Masukkan teks atau reply pesan");
        try {
            const qrCodeBuffer = await QRCode.toBuffer(text, {
                width: 400,
                margin: 2
            });
            const doc = new PDFDocument();
            const buffers = [];            
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfData = Buffer.concat(buffers);
                m.reply({ 
                    document: pdfData, 
                    mimetype: "application/pdf", 
                    fileName: "qrcode.pdf" 
                });
            });
            doc.image(qrCodeBuffer, {
                align: "center",
                valign: "center"
            });
            doc.moveDown()
               .fontSize(12)
               .text(`QR Code untuk: ${text}`, { align: "center" });

            doc.end();
        } catch (error) {
            console.error(error);
            m.reply("⚠️ Gagal membuat QR Code");
        }
    }
});