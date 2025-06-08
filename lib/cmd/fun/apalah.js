import store from "../../source/store.js"

commands.add({
    name: ["bisakah"],
    command: ["bisakah"],
    category: "fun",
    desc: "Bertanya apakah bisa? mengenai suatu hal",
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`[×] Contoh: .bisakah saya menang?`)
        let bisa = ['Bisa','Coba Saja','Pasti Bisa','Mungkin Saja','Tidak Bisa','Tidak Mungkin','Coba Ulangi','Lu mimpi ya?','Yakin bisa?']
	    let keh = bisa[Math.floor(Math.random() * bisa.length)]
		m.reply(keh)
	}
})

commands.add({
    name: ["halah", "hilih", "huluh", "heleh", "holoh"],
    command: ["halah", "hilih", "huluh", "heleh", "holoh"],
    category: "fun",
    desc: "ubah pesan kamu dalam huruf vocal tertentu",
    run: async ({ sius, m, args, Func }) => {
        let q = args.join(" ")
        if (!m.quoted && !q) {
            return m.reply(`[×] kirim/reply text dengan caption ${m.prefix + m.command}`)
        }
        let ter = m.command.toLowerCase()
        let tex = m.quoted?.text || q || m.text
        try {
            m.reply(tex.replace(/[aiueo]/gi, (v) =>
                v === v.toUpperCase() ? ter.toUpperCase() : ter
            ))
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["apakah"],
    command: ["apakah"],
    category: "fun",
    desc: "Bertanya apakah iya? mengenai suatu hal",
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`[×] Contoh: .apakah saya cantik?`)
        let apa = ['Iya','Tidak','Bisa Jadi','Coba Ulangi','Mungkin Saja','Mungkin Tidak','Mungkin Iya','Ntahlah']
	    let kah = apa[Math.floor(Math.random() * apa.length)]
		m.reply(kah)
	}
})

commands.add({
    name: ["kapankah"],
    command: ["kapankah"],
    category: "fun",
    desc: "Bertanya kapan? mengenai suatu hal",
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`[×] Contoh: .kapankah saya menang?`)
        let apa = ['Besok','Lusa','Nanti','4 Hari Lagi','5 Hari Lagi','6 Hari Lagi','1 Minggu Lagi','2 Minggu Lagi','3 Minggu Lagi','1 Bulan Lagi','2 Bulan Lagi','3 Bulan Lagi','4 Bulan Lagi','5 Bulan Lagi','6 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','6 Tahun Lagi','1 Abad lagi','3 Hari Lagi','Bulan Depan','Ntahlah','Tidak Akan Pernah']
	    let kah = apa[Math.floor(Math.random() * apa.length)]
		m.reply(kah)
	}
})

commands.add({
    name: ["siapakah"],
    command: ["siapakah"],
    category: "fun",
    desc: "Bertanya siapa? di antara member grup lainnya",
    group: true,
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`[×] Contoh: .siapakah pedofil?`)
        let member = (store.groupMetadata[m.chat] ? store.groupMetadata[m.chat].participants : m.metadata.participants).map(a => a.id)
		let siapakh = Func.pickRandom(member)
		m.reply(`@${siapakh.split('@')[0]}`);
	}
})

commands.add({
    name: ["kerangajaib"],
    command: ["kerangajaib"],
    category: "fun",
    desc: "Tanyakan hal random kepada kerang!",
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`[×] Contoh: .kerangajaib boleh pinjam 100?`)
        let krng = ['Mungkin suatu hari', 'Tidak juga', 'Tidak keduanya', 'Kurasa tidak', 'Ya', 'Tidak', 'Coba tanya lagi', 'Tidak ada']
		let jwb = Func.pickRandom(krng)
		m.reply(jwb)
	}
})

commands.add({
    name: ["ceksifat"],
    command: ["ceksifat"],
    category: "fun",
    desc: "Cek sifat kamu! cukup sertakan nama yang ingin di cek!",
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`[×] Contoh: .ceksifat <namamu>`)
		let sifat_a = ['Bijak','Sabar','Kreatif','Humoris','Mudah bergaul','Mandiri','Setia','Jujur','Dermawan','Idealis','Adil','Sopan','Tekun','Rajin','Pemaaf','Murah hati','Ceria','Percaya diri','Penyayang','Disiplin','Optimis','Berani','Bersyukur','Bertanggung jawab','Bisa diandalkan','Tenang','Kalem','Logis']
		let sifat_b = ['Sombong','Minder','Pendendam','Sensitif','Perfeksionis','Caper','Pelit','Egois','Pesimis','Penyendiri','Manipulatif','Labil','Penakut','Vulgar','Tidak setia','Pemalas','Kasar','Rumit','Boros','Keras kepala','Tidak bijak','Pembelot','Serakah','Tamak','Penggosip','Rasis','Ceroboh','Intoleran']
		let teks = `╭──❍「 *Cek Sifat* 」❍\n│• Sifat ${text && m.mentionedJid ? text : '@' + m.sender.split('@')[0]}${(text && m.mentionedJid ? '' : (`\n│• Nama : *${text ? text : m.pushName}*` || '\n│• Nama : *Tanpa Nama*'))}\n│• Orang yang : *${Func.pickRandom(sifat_a)}*\n│• Kekurangan : *${Func.pickRandom(sifat_b)}*\n│• Keberanian : *${Math.floor(Math.random() * 100)}%*\n│• Kepedulian : *${Math.floor(Math.random() * 100)}%*\n│• Kecemasan : *${Math.floor(Math.random() * 100)}%*\n│• Ketakutan : *${Math.floor(Math.random() * 100)}%*\n│• Akhlak Baik : *${Math.floor(Math.random() * 100)}%*\n│• Akhlak Buruk : *${Math.floor(Math.random() * 100)}%*\n╰──────❍`
		m.reply(teks)
	}
})

commands.add({
    name: ["cekkhodam"],
    command: ["cekkhodam"],
    desc: "Cek khodam nya kak hihi",
    category: "fun",
    run: async ({ sius, m, args, Func }) => {
        const text = args.join(" ")
        if (!text) return m.reply(`[×] Contoh: .cekkhodam <namamu>`)
		try {
			const res = await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/random/cekkhodam.json');
			const hasil = Func.pickRandom(res);
			m.reply(`Khodam dari *${text}* adalah *${hasil.nama}*\n_${hasil.deskripsi}_`)
		} catch (e) {
			m.reply(Func.pickRandom(['Dokter Indosiar','Sigit Rendang','Ustadz Sinetron','Bocil epep']))
		}
	}
})

commands.add({
    name: ["rate"],
    command: ["rate"],
    desc: "Suruh bot ngerating",
    category: "fun",
    run: ({ m }) => m.reply(`Rate Bot : *${Math.floor(Math.random() * 100)}%*`)
})