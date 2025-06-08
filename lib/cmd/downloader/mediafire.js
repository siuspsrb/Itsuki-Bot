commands.add({
    name: ["mediafire"],
    command: ["mediafire"],
    category: "downloader",
    alias: ["mediafiredown"],
    param: "<url>",
    desc: "Pengunduh file MediaFire!",
    limited: true,
    run: async ({ sius, m, args, Func, dl }) => {
        try {
            if (!args[0]) return m.reply(`[×] Harap kirim link MediaFire yang ingin didownload!\n\n> Contoh: *.mediafire https://www.mediafire.com/file/56qiqi6h3lgvfy3/Shoyu+V1_s%40aima.zip/file*`)
            const url = args[0].trim();
            if (!url.includes('mediafire.com')) return m.reply(`[×] URL tidak valid! Pastikan URL dari MediaFire \n\n> Contoh: https://www.mediafire.com/file/56qiqi6h3lgvfy3/Shoyu+V1_s%40aima.zip/file`)
            m.reply({ react: { text: "🕣", key: m.key }})
            const apiUrl = `https://fastrestapis.fasturl.cloud/downup/mediafiredown?url=${encodeURIComponent(url)}`;
            const result = await Func.fetchJson(apiUrl)
            if (!result || result.status !== 200 || !result.result || !result.result.download) {
                return m.reply(`[×] Gagal mendownload file MediaFire: ${result?.message || 'Data tidak ditemukan'}.`)
            }
            const { filename, size, filetype, mimetype, owner, created, download } = result.result;

            const caption = `📁 *MediaFire - ${filename || 'Unknown'}*\n` +
                           `📏 Ukuran: ${size || 'Tidak diketahui'}\n` +
                           `📄 Tipe: ${filetype || 'Tidak diketahui'}\n` +
                           `👤 Pembuat: ${owner || 'Anonim'}\n` +
                           `📅 Dibuat: ${new Date(created).toLocaleDateString('id-ID')}`;

            const isMedia = ['video', 'image'].includes(filetype);
            if (isMedia) {
                await m.reply({
                    [filetype]: { url: download },
                    mimetype: mimetype || (filetype === 'video' ? 'video/mp4' : 'image/jpeg'),
                    caption
                });
            } else {
                await m.reply({
                    document: { url: download },
                    mimetype: mimetype || 'application/octet-stream',
                    fileName: filename || 'file',
                    caption
                });
            }
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})