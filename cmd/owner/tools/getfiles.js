import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

commands.add({
    name: ["getfile"],
    command: ["getfile"],
    alias: ["getfiles", "gf", "gp"],
    category: "owner-tools",
    owner: true,
    param: "<kategori> <index_file>",
    desc: "melihat dan mengambil file berdasarkan kategori",
    run: async ({ sius, m, args }) => {
        const baseDir = path.join(process.cwd(), "cmd")
        const files = fs.readdirSync(baseDir, { withFileTypes: true })
        const categories = files.filter(f => f.isDirectory()).map(f => f.name)

        if (!args[0]) {
            const list = categories.map((v, i) => `${i + 1}. _${v}_`).join("\n")
            return m.reply(`*📁 DAFTAR KATEGORI FILE:*\n\n${list}`)
        }

        const catIndex = parseInt(args[0]) - 1
        const fileIndex = parseInt(args[1]) - 1

        if (isNaN(catIndex) || catIndex < 0 || catIndex >= categories.length) {
            return m.reply(`⚠️ index kategori tidak valid!\n\n▢ contoh:\n- *${m.prefix + m.command}* → lihat kategori\n- *${m.prefix + m.command} 1* → lihat file kategori 1\n- *${m.prefix + m.command} 1 2* → isi file ke-2 dari kategori 1`)
        }

        const selectedCategory = categories[catIndex]
        const dirPath = path.join(baseDir, selectedCategory)
        const jsFiles = fs.readdirSync(dirPath).filter(f => f.endsWith(".js"))

        if (!args[1]) {
            const list = jsFiles.map((v, i) => `${i + 1}. _${v}_`).join("\n")
            return m.reply(`*📄 FILE DALAM KATEGORI "${selectedCategory}":*\n\n${list}`)
        }

        if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= jsFiles.length) {
            return m.reply(`⚠️ index file tidak valid!\n\n▢ contoh:\n- *${m.prefix + m.command} ${catIndex + 1}* → lihat file\n- *${m.prefix + m.command} ${catIndex + 1} ${fileIndex + 1}* → isi file`)
        }

        const filePath = path.join(dirPath, jsFiles[fileIndex])
        const code = fs.readFileSync(filePath, "utf-8")

        const maxChunk = 4000
        const chunks = code.match(new RegExp(`.{1,${maxChunk}}`, "gs")) || []

        for (let i = 0; i < chunks.length; i++) {
            await m.reply(chunks[i])
        }
    }
})