import fetch from "node-fetch"
// ganti pake apikeymu yaaa ajggg, gratis tinggal daftar
const OMDB_API_KEY = "2f41b399"; // daftar di http://www.omdbapi.com/apikey.aspx

commands.add({
    name: ["movie", "film"],
    command: ["movie", "film"],
    category: "search",
    param: "<judul>",
    desc: "Menampilkan info film berdasarkan judul",
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            if (!args[0]) return m.reply("Sertakan judul film (contoh: .movie good wiill hunting)!")           
            const title = args.join(" ").trim()
            const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
            const response = await fetch(apiUrl);
            if (!response.ok) return m.reply("Gagal mengakses API OMDB")
            const data = await response.json()
            if (data.Response === "False") return m.reply(`Film *${title}* tidak ditemukan!`);
            // format pesan
            const zer = await dl.googleImage(title + "movie") // biar akurat
            const er = Math.floor(Math.random() * zer.length)
            const movieMsg = `*▢ Judul:* ${data.Title}\n` +
                `*▢ Tahun:* ${data.Year}\n` +
                `*▢ Direktor:* ${data.Director || "N/A"}\n` +
                `*▢ Aktor:* ${data.Actors || "N/A"}\n` +
                `*▢ Genre:* ${data.Genre || "N/A"}\n` +
                `*▢ Rating:* ${data.imdbRating || "N/A"}/10\n` +
                `*▢ Sinopsis:* ${data.Plot || "Tidak ada deskripsi"}`;
            await m.reply(movieMsg, { 
                contextInfo: {
                    externalAdReply: {
                        title: data.Title.toUpperCase(),
                        thumbnailUrl: er,
                        mediaUrl: "",
                        mediaType: 1,
                        previewType: "PHOTO",
                        renderLargerThumbnail: true
                    }
                }
            })
        } catch (err) {            
            sius.cantLoad()
        }
    }
})