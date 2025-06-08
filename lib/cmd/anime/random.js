commands.add({
    name: ["awoo","blush","bonk","cry","cuddle","hug","kiss","lick","pat","shinobu","smug","wink","yeet"],
    command:["awoo","blush","bonk","cry","cuddle","hug","kiss","lick","pat","shinobu","smug","wink","yeet"],
    category: "anime",
    desc: "Generate anime image.",
    run: async ({ sius, m, args, Func }) => {
        try {
            let zer = await Func.fetchJson(`https://api.waifu.pics/sfw/${m.command}`)
            if (!zer || !zer.url) return m.reply("[×] Gagal mengirim gambar");
            await m.reply({ image: { url: zer.url }})
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})