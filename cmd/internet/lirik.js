commands.add({
    name: ["lirik"],
    command: ["lirik"],
    category: "search",
    alias: ["lyrics","lyric"],
    usage: "<judul>",
    limit: 5,
    desc: "Cari lirik lagu berdasarkan judul",
    run: async ({ sius, m, args, Func }) => {
        try {
            if (!args[0]) return m.reply(`*Harap masukkan judul lagu!*\n\n> Contoh penggunaan: *.lirik Beauty and the Beast*`)
            const query = args.join(" ")
            const apiUrl = `https://fastrestapis.fasturl.cloud/music/songlyrics-v2?name=${encodeURIComponent(query)}`;
            const result = await Func.fetchJson(apiUrl);
            if (!result || !result.result) {
                return m.reply(`*Lirik untuk "${query}" tidak ditemukan. Coba judul lain!`);
            }
            const { title, artist, album, albumCover, description, lyrics } = result.result;
            const lyricLines = lyrics
                .filter(line => line.type === "lyric")
                .map(line => line.text)
                .join("\n");
            const caption = `*▢ Judul:* ${title}\n*▢ Artis:* ${artist}\n*▢ Album:* ${album}\n*▢ Deskripsi:* ${description}\n\n*THE LYRICS:*\n${lyricLines}`;
            await m.reply(caption, { 
                contextInfo: {
                    externalAdReply: {
                        thumbnailUrl: albumCover,
                        mediaUrl: albumCover,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        previewType: "PHOTO",
                        sourceUrl: config.github
                    }
                }
            })
        } catch (err) {            
            sius.cantLoad(err)
        }
    }
})