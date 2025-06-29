import fs from "fs"
import axios from "axios"
import FormData from "form-data"
import BodyForm from "form-data"

const api = axios.create({ baseURL: "https://api4g.iloveimg.com" })

async function getTaskId() {
    const { data: html } = await axios.get("https://www.iloveimg.com/id/hapus-latar-belakang")
    api.defaults.headers.post["authorization"] = `Bearer ${html.match(/ey[a-zA-Z0-9?%-_/]+/g)[1]}`
    return html.match(/taskId = '(\w+)/)[1]
}

async function uploadImageToServer(imageBuffer) {
    const taskId = await getTaskId()
    const fileName = Math.random().toString(36).slice(2) + ".jpg"
    const form = new FormData()
    form.append("name", fileName)
    form.append("chunk", "0")
    form.append("chunks", "1")
    form.append("task", taskId)
    form.append("preview", "1")
    form.append("file", imageBuffer, fileName)
    const reqUpload = await api.post("/v1/upload", form, { headers: form.getHeaders() }).catch(e => e.response)
    if (reqUpload.status !== 200) throw reqUpload.data || reqUpload.statusText
    return { serverFilename: reqUpload.data.server_filename, taskId }
}

async function removeBg(imageBuffer, responseType = "arraybuffer") {
    const { serverFilename, taskId } = await uploadImageToServer(imageBuffer)
    const form = new FormData()
    form.append("task", taskId)
    form.append("server_filename", serverFilename)
    const req = await api.post("/v1/removebackground", form, {
        headers: form.getHeaders(),
        responseType
    }).catch(e => e.response)
    const type = req.headers["content-type"]
    if (req.status !== 200 || !/image/.test(type)) {
        throw JSON.parse(req.data?.toString() || '{"error":{"message":"Gagal proses background"}}')
    }
    return req.data
}

async function CatBox(filePath) {
    try {
        const fileStream = fs.createReadStream(filePath)
        const formData = new BodyForm()
        formData.append("fileToUpload", fileStream)
        formData.append("reqtype", "fileupload")
        formData.append("userhash", "")
        const response = await axios.post("https://catbox.moe/user/api.php", formData, {
            headers: { ...formData.getHeaders() }
        })
        return response.data
    } catch (error) {
        console.error("Catbox Error:", error)
        return "Upload ke Catbox gagal."
    }
}

commands.add({
    name: ["removebg"],
    command: ["removebg"],
    category: "tools",
    alias: ["removebackground"],
    desc: "Menghapus latar belakang image",
    limit: 8,
    cooldown: 40,
    run: async ({ sius, m, Func }) => {
        let q = m.quoted || m
        let mime = (q.msg || q).mimetype || q.mediaType || ""
        if (!mime.startsWith("image/")) return m.reply(`[×] Reply atau kirim gambar yang ingin dihapus latar belakangnya dengan caption ${m.prefix + m.command}`)
        let wait = await m.reply({ react: { text: "🕣", key: m.key } })
        let start = Date.now()
        const mediaPath = await sius.downloadAndSaveMediaMessage(q)
        const mediaBuffer = fs.readFileSync(mediaPath)
        try {
            const noBg = await removeBg(mediaBuffer)
            const tmpFile = `${mediaPath}-nobg.png`
            fs.writeFileSync(tmpFile, noBg)
            let duration = ((Date.now() - start) / 1000).toFixed(2)
            await m.reply({ image: fs.readFileSync(tmpFile), caption: `[√] Berhasil menghapus background dalam ${duration} detik!` })
            fs.unlinkSync(tmpFile)
            fs.unlinkSync(mediaPath)
        } catch (err) {
            sius.cantLoad(err)
            m.reply("[×] Gagal menghapus background.")
            if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath)
        }
    }
})