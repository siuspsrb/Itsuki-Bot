import axios from "axios"

commands.add({
    name: ["nulis"],
    command: ["nulis"],
    category: "tools",
    desc: "ubah teks jadi tulisan tangan di buku",
    usage: "<teks>",
    example: "halo dunia",
    query: true,
    run: async ({ sius, m, args }) => {
        let text = args.join(" ")
        if (!text) return
        const response = await axios.post(
            "https://lemon-write.vercel.app/api/generate-book",
            {
                text,
                font: "default",
                color: "#000000",
                size: "28"
            },
            {
                responseType: "arraybuffer",
                headers: { "Content-Type": "application/json" }
            }
        )
        m.reply({ image: response.data })
    }
})