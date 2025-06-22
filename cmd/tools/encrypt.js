import fs from "fs"
import path from "path"

commands.add({
    name: ["encrypt"],
    command: ["encrypt"],
    alias: ["enc"],
    category: "tools",
    run: async ({ m }) => {
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ""
        if (!/text|json|plain|xml|csv/.test(mime)) return m.reply("Kirim/reply file teks seperti .txt, .json, .env, dll")
        const buffer = await quoted.download()
        const originalName = quoted.msg?.fileName?.replace(/\.[^/.]+$/, "") || `file-${Date.now()}`
        const encoded = buffer.toString("base64")
        const jsContent = `(function(){
    const _0x${(Math.random() + 1).toString(36).substring(7)} = "${encoded}"
    const decode = atob(_0x${(Math.random() + 1).toString(36).substring(7)})
    console.log(decode)
})()`
        const fileName = `${originalName}.js`
        const filePath = path.join(process.cwd(), fileName)
        fs.writeFileSync(filePath, jsContent)
        await m.reply({
            document: fs.readFileSync(filePath),
            mimetype: "application/javascript",
            fileName
        })
        fs.unlinkSync(filePath)
    }
})

commands.add({
    name: ["jsobfuscate"],
    command: ["jsobfuscate"],
    category: "tools",
    premium: true,
    alias: ["obfuscate"],
    desc: "obfuscate javascript code using fasturl api",
    run: async({ sius, m, args, Func }) => {
        let input = args.join(" ")
        if (!input && m.quoted || m) {
            const quoted = m.quoted ? m.quoted : m
            const mime = (quoted.msg || quoted).mimetype || ""
            if (!/text|json|plain|xml|csv/.test(mime)) return m.reply("[×] Kirim/reply file teks seperti .txt, .json, .env, dll")
            const buffer = await quoted.download()
            if (buffer) {
                input = buffer.toString("base64")
            } else if (m.quoted?.text) {
                input = m.quoted.text
            }
        }
        if (!input) return m.reply("[×] Kirim atau balas file JS / teks dengan perintah ini\n▢ Contoh: .jsobfuscate console.clear() [atau] .jsobfuscate sambil reply file")
        m.reply({ react: { text: "🕣", key: m.key } })
        try {
            const endpoint = `https://fastrestapis.fasturl.cloud/tool/jsobfuscate?inputCode=${encodeURIComponent(input)}&encOptions=NORMAL&specialCharacters=on&fastDecode=off`
            const json = await Func.fetchJson(endpoint)
            if (json.status !== 200 || !json.result) return m.reply("[×] Gagal meng-obfuscate kode")
            let filename = `obfuscate_${Date.now()}.js`
            const filePath = path.join(process.cwd(), filename)
            fs.writeFileSync(filePath, json.result)
            let buff = fs.readFileSync(filePath)
            await m.reply({
                document: buff,
                fileName: filename,
                mimetype: "application/javascript"
            })
            fs.unlinkSync(filename)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})