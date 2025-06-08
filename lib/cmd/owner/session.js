import fs from "fs"

commands.add({
    name: ["getsession"],
    command: ["getsession"],
    category: "owner",
    owner: true,
    run: async ({ m }) => {
        try {
            await m.reply({
                document: fs.readFileSync('./sius/creds.json'),
                mimetype: 'application/json',
                fileName: 'creds.json'
            });
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["deletesession"],
    command: ["delsession"],
    category: "owner",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        try {
            const files = await fs.promises.readdir('./sius');
            const sessionFiles = files.filter(item => 
                ['session-', 'pre-key', 'sender-key', 'app-state'].some(ext => item.startsWith(ext))
            );
            if (sessionFiles.length === 0) return m.reply('Tidak ada session file terdeteksi');            
            if (args[0] === 'true') {
                const { key } = await m.reply('Menghapus session file...');
                await Promise.all(sessionFiles.map(file => 
                    fs.promises.unlink(`./sius/${file}`)
                ));
                await m.reply('Berhasil menghapus semua session file', { edit: key });
            } else {
                let teks = `Terdeteksi ${sessionFiles.length} session file:\n\n` +
                           sessionFiles.map((e, i) => `${i+1}. ${e}`).join('\n') +
                           `\n\nKetik .deletesession true untuk menghapus`;
                await m.reply(teks);
            }
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})