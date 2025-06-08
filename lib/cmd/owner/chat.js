import store from "../../source/store.js"
import fs from "fs/promises"
import path from "path"

commands.add({
    name: ["clearchat"],
    command: ["clearchat"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
    	await sius.chatModify({ delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.timestamp }] }, m.chat)
		m.reply("[√] Sukses Membersihkan Pesan")
	}
})

commands.add({
    name: ["storemsg"],
    command: ["storemsg"],
    category: "owner",
    owner: true,
    run: async({ sius, m, args }) => {
        let text = args.join(" ")
		let [teks1, teks2] = text.split`|`
		if (teks1 && teks2) {
			const msgnya = await store.loadMessage(teks1, teks2)
			if (msgnya?.message) await sius.relayMessage(m.chat, msgnya.message, {})
			else m.reply("[×] Pesan Tidak Ditemukan!")
		} else m.reply("[×] Contoh: .storemsg 123xxx@g.us|3EB0xxx")
	}
})

commands.add({
    name: ["clearcache"],
    command: ["clearcache"],
    category: "owner",
    owner: true,
    desc: "membersihkan file cache sampah",
    run: async ({ sius, m }) => {
        try {
            const dirPath = path.join(process.cwd(), "lib/media/sampah")
            try {
                await fs.access(dirPath)
            } catch {
                return m.reply("[×] Folder sampah tidak ditemukan!")
            }
            const files = await fs.readdir(dirPath, { withFileTypes: true })
            if (!files.length) {
                return m.reply("[×] Folder lib/media/sampah kosong, tidak ada yang perlu dihapus!")
            }
            const itemsToDelete = files.filter(item => item.name !== "@sius.psrb")
            if (!itemsToDelete.length) {
                return m.reply("[×] Tidak ada file yang bisa dihapus!")
            }
            let deletedCount = 0
            for (const item of itemsToDelete) {
                const itemPath = path.join(dirPath, item.name)
                try {
                    if (item.isDirectory()) {
                        await fs.rm(itemPath, { recursive: true, force: true })
                    } else {
                        await fs.unlink(itemPath)
                    }
                    deletedCount++
                    console.log(`[CLEARCACHE] deleted: ${itemPath}`)
                } catch (err) {
                    console.error(`[ERROR] gagal hapus ${itemPath}:`, err)
                    sius.cantLoad(err)
                }
            }
            await m.reply(`[√] Cache berhasil dihapus! ${deletedCount} item dihapus dari lib/media/sampah.`)
        } catch (err) {
            console.error("[ ERROR ] clearcache :", err)
            m.reply(`gagal menghapus cache: ${err.message || err}`)
        }
    }
})