import axios from "axios"

commands.add({
    name: ["hitamkan"],
    command: ["hitamkan"],
    category: "ai-tools",
    desc: "ubah gambar jadi hitam (grayscale)",
    register: false,
    query: false,
    run: async ({ sius, m }) => {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ""
        if (!mime?.startsWith("image/")) return m.reply("⚠️ balas gambar dengan perintah *hitamkan*")

        let start = Date.now()

        let buffer = await q.download()
        let payload = {
            imageData: buffer.toString("base64"),
            filter: "hitam"
        }

        let res = await axios.post("https://negro.consulting/api/process-image", payload)
        if (res.data?.status !== "success" || !res.data.processedImageUrl)
            return m.reply("⚠️ Gagal proses gambar, coba ulangi")

        let img = await axios.get(res.data.processedImageUrl, { responseType: "arraybuffer" })
        let caption = `[√] Berhasil dihitamkan dalam waktu ${(Date.now() - start) / 1000}s`

        await m.reply({ image: Buffer.from(img.data), caption })
    }
})