import axios from "axios"

commands.add({
    name: ["hentai"],
    command: ["hentai"],
    category: "nsfw",
    desc: "ngambil gambar hentai dari API waifuim",
    premium: true,
    run: async ({ m }) => {
        const res = await axios.get("https://api.nekorinn.my.id/waifuim/hentai", {
            responseType: "arraybuffer"
        })

        m.reply({ image: res.data })
    }
})