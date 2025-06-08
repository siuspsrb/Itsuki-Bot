commands.add({
    name: ["qr"],
    command: ["qr"],
    category: "maker",
    alias: ["qrcode","generateqr"],
    desc: "membuat QR Code dari teks/link",
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        if (!text) return m.reply("*Contoh:* .qr https://google.com")
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
        await m.reply({ 
            image: { url: qrUrl },
            caption: `*▢ Teks:* ${text}\n\n> Scan QR code di atas untuk melihat konten`
        })
    }
})