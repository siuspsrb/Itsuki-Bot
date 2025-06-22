import yts from "yt-search"

commands.add({
    name: ["youtubeaudio"],
    command: ["youtubeaudio"],
    category: "downloader",
    alias: ["yta","ytmp3","youtubemp3","ytaudio"],
    desc: "Download audio dari link YouTube!",
    limit: 5,
    query: true,
    cooldown: 30,
    run: async ({ sius, m, args, Func, dl }) => {
        const url = args[0]
        if (!url) return m.reply(`[×] Contoh: .ytmp3 https://youtu.be/dQw4w9WgXcQ`)
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return m.reply("[×] Linknya bukan dari YouTube!")
        }
        //m.reply({ react: { text: "🕣", key: m.key }})
        try {
            const zer = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(args[0])}&quality=128kbps&server=auto`)
            let x = zer.result
            if (!zer.result || zer.status !== 200) return m.reply("Gagal dapetin audio-nya!")
            let y = await dl.youtube(args[0])
            await m.reply(`*Judul:* ${x.title}\n*Channel:* ${x.author.name}\n*Views:* ${x.metadata.views}\n*Published:* ${x.metadata.uploadDate}`, {
                contextInfo: {
                externalAdReply: {
                    title: x.title,
                    body: x.metadata.description,
                    thumbnailUrl: x.metadata.thumbnail,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    mediaUrl: args[0],
                    sourceUrl: args[0]
                }
                }
            })
            await m.reply({
                audio: { url: x.media },
                mimetype: "audio/mpeg",
                fileName: `${x.metadata?.id || "audio"}.mp3`,
                caption: "ini dia audionya~"
            }).catch(async() => {
                await m.reply({
                    audio: { url: y.urlmp3 },
                    mimetype: "audio/mpeg",
                    fileName: `${Func.randomInt(1, 10000000) || "audio"}.mp3`,
                    caption: "here you gooo",
                })
            })
        } catch (err) {
            console.log(err)
            m.reply(`Gagal convert YouTube: ${err.message || err}`)
        }
    }
})


commands.add({
    name: ["youtubevideo"],
    command: ["youtubevideo"],
    alias: ["ytv","ytmp4","youtubemp4","ytvideo"],
    category: "downloader",
    desc: "Download video dari link YouTube!",
    limit: 5,
    query: true,
    cooldown: 30,
    run: async ({ sius, m, args, Func, dl }) => {
        const url = args[0]
        if (!url) return m.reply(`[×] Contoh: .ytmp4 https://youtube.com/watch?v=0qE2mTzg5Iw`)
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return m.reply("[×] Itu bukan link YouTube bro~")
        }
        //m.reply({ react: { text: "🕣", key: m.key }})
        try {
            const vid = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(args[0])}&quality=480&server=auto`)
            const re = vid.result
            const zer = await dl.youtube(args[0])
            if (vid.status !== 200) return m.reply("Gagal mengambil video-nya!")
            await m.reply({
                video: { url: zer.urlmp4 },
                mimetype: "video/mp4",
                caption: `*––––––『 YOUTUBE 』––––––*\n\n*▢ Judul:* ${re.title}\n*▢ Channel:* ${re.author.name}\n*▢ Views:* ${re.metadata.views}\n*▢ Published:* ${re.metadata.uploadDate}`.trim()
            })
        } catch (err) {
            console.log(err)
            m.reply(`[×] Gagal convert YouTube: ${err.message || err}`)
        }
    }
})

commands.add({
    name: ["play"],
    command: ["play"],
    category: "internet",
    desc: "Cari lagu lalu dikirim dalam bentuk audio!",
    limit: 5,
    query: true,
    cooldown: 30,
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            const txt = args.join(" ")
            if (!txt) return m.reply("[×] Sertakan judul lagu yang ingin dimainkan!")
            //m.reply({ react: { text: "🕣", key: m.key }})
            const lo = await yts.search(txt)
            const hasil = lo.all[0]
            if (!hasil || !hasil.url) return m.reply("[×] Tidak ditemukan hasil.")
            const teksnya = `
*––––––『 MUSIC PLAY 』––––––*

*▢ Title        :* ${hasil.title || 'Tidak tersedia'}
*▢ Description :* ${hasil.description || 'Tidak tersedia'}
*▢ Channel    :* ${hasil.author?.name || 'Tidak tersedia'}
*▢ Duration    :* ${hasil.seconds || 'Tidak tersedia'} second (${hasil.timestamp || 'Tidak tersedia'})
*▢ Source     :* ${hasil.url || 'Tidak tersedia'}

*_dalam proses mengirim audio_*
`.trim()
            const zer = await dl.youtube(hasil.url)
            await m.reply(teksnya, {
                contextInfo: {
                externalAdReply: {
                    title: hasil.title,
                    body: hasil.description,
                    thumbnailUrl: hasil.thumbnail,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    mediaUrl: hasil.url,
                    sourceUrl: hasil.url
                }
                }
            });
            const x = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(hasil.url)}&quality=128kbps&server=auto`)
            await Func.sleep(1000)
            const { media, metadata } = x.result
            await m.reply({
                audio: { url: media },
                mimetype: 'audio/mp4',
                fileName: `${metadata?.id || "audio"}.mp3`,
                ptt: false
            }).catch(async() => {
                await m.reply({
                    audio: { url: zer.urlmp3 },
                    mimetype: "audio/mpeg",
                    fileName: `${Func.randomInt(1, 10000000) || "audio"}.mp3`,
                    caption: "here you gooo",
                })
            })
        } catch (err) {
            console.log(err)
            m.reply("[×] Gagal menemukan lagu.")
        }
    }
})

commands.add({
    name: ["playaudio","lagu"],
    command: ["playaudio"],
    alias: ["song"],
    category: "downloader",
    limit: 5,
    query: true,
    cooldown: 30,
    desc: "Cari lagu lalu memberikan media audionya",
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            const txt = args.join(" ")
            if (!txt) return m.reply("[×] Sertakan judul lagu yang ingin dimainkan!")
            //m.reply({ react: { text: "🕣", key: m.key }})
            const li = await yts.search(txt)
            const hasil = li.all[0]
            if (!hasil || !hasil.url) return m.reply("[×] Tidak ditemukan hasil.")
            const x = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(hasil.url)}&quality=128kbps&server=auto`)
            const zer = await dl.youtube(hasil.url)
            await Func.sleep(1000)
            const { media, metadata } = x.result
            await m.reply({
                audio: { url: media },
                mimetype: 'audio/mp4',
                fileName: `${metadata?.id || "audio"}.mp3`,
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: hasil.title,
                        body: hasil.description,
                        thumbnailUrl: hasil.thumbnail,
                        renderLargerThumbnail: true,
                        mediaType: 1,
                        previewType: "PHOTO",
                        mediaUrl: hasil.url,
                        sourceUrl: hasil.url
                    }
                }
            }).catch(async() => {
                await m.reply({
                    audio: { url: zer.urlmp3 },
                    mimetype: "audio/mpeg",
                    fileName: `${Func.randomInt(1, 10000000) || "audio"}.mp3`,
                    caption: "here you gooo",
                })
            })
        } catch (err) {
            console.log(err)
            m.reply("[×] Gagal menemukan lagu.")
        }
  }
})


commands.add({
    name: ["playvideo"],
    command: ["playvideo"],
    category: "downloader",
    limit: 5,
    query: true,
    cooldown: 30,
    desc: "Mencari video yt, lalu mengirimkannya!",
    run: async ({ sius, m, args, Func, dl }) => {
    try {
        const txt = args.join(" ")
        if (!txt) return m.reply("[×] Sertakan judul lagu yang ingin dimainkan!")
        //m.reply({ react: { text: "🕣", key: m.key }})
        const op = await yts.search(txt)
        const hasil = op.all[0]
        if (!hasil || !hasil.url) return sius.reply("[×] Tidak ditemukan hasil.")
        const teksnya = `
*––––––『 VIDEO 』––––––*

*▢ Title         :* ${hasil.title || 'Tidak tersedia'}
*▢ Description  :* ${hasil.description || 'Tidak tersedia'}
*▢ Channel     :* ${hasil.author?.name || 'Tidak tersedia'}
*▢ Duration     :* ${hasil.seconds || 'Tidak tersedia'} second (${hasil.timestamp || 'Tidak tersedia'})
*▢ Source       :* ${hasil.url || 'Tidak tersedia'}
`.trim()
        const zer = await dl.youtube(hasil.url)
        const vid = await Func.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(hasil.url)}&quality=480&server=auto`)
        const res = vid.result
        m.reply({
            video: { url: res.media },
            caption: teksnya,
            mimetype: 'video/mp4'
        }).catch(async() => {
            await m.reply({
                audio: { url: y.urlmp3 },
                mimetype: "audio/mpeg",
                fileName: `${Func.randomInt(1, 10000000) || "audio"}.mp3`,
                caption: "here you gooo",
            })
        })
    } catch(e) {
        console.log(e)
    }
  }
})