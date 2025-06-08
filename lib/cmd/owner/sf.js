import { 
    writeFileSync, 
    unlinkSync, 
    existsSync 
} from "fs"
import { join } from "path"

commands.add({
    name: ["savefile"],
    command: ["savefile"],
    category: "owner",
    owner: true,
    alias: ["sf"],
    param: "<path>",
    desc: "Simpan kode dari pesan yang di-reply ke file tertentu",
    run: async ({ sius, m, args, Func }) => {
        try {
            if (!args[0]) return m.reply(`Harap masukkan path file!\n\n> Contoh: *.savefile ./commands/test.js*`)
            const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quotedMsg || !quotedMsg.conversation) {
                return m.reply(`Harap reply pesan yang berisi kode!`)
            }
            const code = quotedMsg.conversation;
            const filePath = join(process.cwd(), args.join(" ").trim())
            writeFileSync(filePath, code);
            await m.reply(`*SAVE FILE*\n\nBerhasil menyimpan file ke: *${filePath}*\n\n> File akan otomatis di-reload.`);
            setTimeout(async () => {
                try {
                    if (existsSync(filePath)) {
                        const module = await import(`file://${filePath}?update=${Date.now()}`);
                        if (!module) throw new Error("Module tidak valid");
                    }
                } catch (err) {
                    console.error('[ERROR] Save file failed:', err);
                    if (existsSync(filePath)) {
                        unlinkSync(filePath);
                        await m.reply(`*SAVE FILE*\n\nFile *${filePath}* gagal di-load (error: ${err.message || err}). File telah dihapus untuk keamanan.`);
                    }
                }
            }, 2000); // Delay 2 detik untuk kasih waktu hot reload jalan
        } catch (err) {
            sius.cantLoad(err);
        }
    }
})