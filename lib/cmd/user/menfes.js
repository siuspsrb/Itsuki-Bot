const menfesTimeouts = new Map()
const menfes = global.db.game.menfes

commands.add({
    name: ["confess"],
    command: ["confess"], 
    alias: ["confess", "menfes", "menfess"],
    category: "user",
    desc: "mengirimkan pesan menfess ke seseorang secara anonim",
    limit: true,
    run: async ({ sius, m, args, Func }) => {
		if (m.isGroup) return m.reply("[×] Fitur ini khusus private chat")
		let text = args.join(" ")
		if (menfes[m.sender]) return m.reply(`[×] Kamu sedang berada di sesi ${m.command}!`)
		if (!text) return m.reply(`[!] Contoh penggunaan: ${m.prefix + m.command} 62xxxx|Nama Samaran`)
		let [teks1, teks2] = text.split`|`
		if (teks1) {
			const tujuan = teks1.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
			const onWa = await sius.onWhatsApp(tujuan)
			if (!onWa.length > 0) return m.reply('[×] Nomor tersebut tidak terdaftar di whatsapp!')
			menfes[m.sender] = {
				tujuan: tujuan,
				nama: teks2 ? teks2 : 'Orang'
			}
			menfes[tujuan] = {
				tujuan: m.sender,
				nama: 'Penerima',
			};
			const timeout = setTimeout(() => {
				if (menfes[m.sender]) {
				m.reply(`Waktu ${m.command} habis`);
				delete menfes[m.sender];
				}
				if (menfes[tujuan]) {
					sius.sendMessage(tujuan, { text: `_Waktu ${command} habis_` });
					delete menfes[tujuan];
				}
				menfesTimeouts.delete(m.sender);
				menfesTimeouts.delete(tujuan);
			}, 600000)
			menfesTimeouts.set(m.sender, timeout);
			menfesTimeouts.set(tujuan, timeout);
			sius.sendMessage(tujuan, { text: `_${m.command} Connected_\nHai, seseorang ingin melakukan sesi confess kepadamu!\n\n> Reply pesan ini dan pesan balasan yang akan mendatang supaya pesan kamu terkirim ke pengirim` })
			m.reply(`_Memulai ${m.command}..._\n*Silahkan Mulai kirim pesan/media*\n*Durasi ${m.command} hanya selama 10 menit*\n*Note :* 1. Jika ingin mengakhiri ketik _*${m.prefix}del${m.command}*_\n2. Reply pesan ini dan pesan balasan yang akan mendatang supaya pesan kamu terkirim ke penerima!`)
		} else m.reply(`[×] Masukkan nomornya!\n\n> Contoh penggunaan: ${m.prefix + m.command} 62xxxx|Nama Samaran`)
	}
})

commands.add({
    name: ["delconfess"],
    command: ["delconfess"],
    alias: ["delconfess", "delmenfes", "delmenfess"],
    category: "user",
    desc: "mengakhiri sesi confess/menfess",
    run: async ({ sius, m, args }) => {
		if (!menfes[m.sender]) return m.reply(`[×] Kamu tidak sedang berada di sesi ${m.command.split('del')[1]}!`)
		let anu = menfes[m.sender]
		if (menfesTimeouts.has(m.sender)) {
			clearTimeout(menfesTimeouts.get(m.sender))
			menfesTimeouts.delete(m.sender);
		}
		if (menfesTimeouts.has(anu.tujuan)) {
			clearTimeout(menfesTimeouts.get(anu.tujuan))
			menfesTimeouts.delete(anu.tujuan);
		}
		sius.sendMessage(anu.tujuan, { text: `[×] Chat di akhiri oleh ${anu.nama ? anu.nama : 'seseorang'}` })
		m.reply(`[√] Sukses mengakhiri sesi ${m.command.split('del')[1]}!`)
		delete menfes[anu.tujuan]
		delete menfes[m.sender]
	}
})