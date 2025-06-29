commands.add({
    name: ["jadwalsholat"],
    command: ["jadwalsholat"],
    category: "muslim",
    desc: "menampilkan jadwal sholat harian berdasarkan kota",
    query: true,
    usage: "<cityname>",
    example: "Jakarta",
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        try {
            const resKota = await Func.fetchJson("https://api.myquran.com/v2/sholat/kota/semua")
            const kota = resKota.data.find(k =>
      k.lokasi.toLowerCase().includes(text.toLowerCase()))
            if (!kota) return m.reply("Kota tidak ditemukan. Pastikan penulisan sudah benar.")
            const idKota = kota.id
            const lokasi = kota.lokasi
            const now = new Date()
            const tahun = now.getFullYear()
            const bulan = String(now.getMonth() + 1).padStart(2, '0')
            const tanggal = String(now.getDate()).padStart(2, '0');
            const url = `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tahun}/${bulan}/${tanggal}`;
            const rej = await Func.fetchJson(url);
            const jadwal = rej.data.jadwal;
            let hasil = `*🕌 JADWAL SHOLAT*\n\n`;
                hasil += `▢ *Imsak :* ${jadwal.imsak}\n`
                hasil += `▢ *Subuh :* ${jadwal.subuh}\n`
                hasil += `▢ *Terbit :* ${jadwal.terbit}\n`
                hasil += `▢ *Dhuha :* ${jadwal.dhuha}\n`
                hasil += `▢ *Dzuhur :* ${jadwal.dzuhur}\n`
                hasil += `▢ *Ashar :* ${jadwal.ashar}\n`
                hasil += `▢ *Maghrib :* ${jadwal.maghrib}\n`
                hasil += `▢ *Isya :* ${jadwal.isya}\n\n`
                hasil += jadwal.tanggal
                hasil += `\n\n> *Semoga ibadahmu berkah hari ini.*`
                m.reply(hasil);
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})