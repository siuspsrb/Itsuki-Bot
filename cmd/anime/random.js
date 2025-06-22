commands.add({
    name: ["awoo","blush","bonk","cry","cuddle","hug","kiss","lick","pat","shinobu","smug","wink","yeet"],
    command:["awoo","blush","bonk","cry","cuddle","hug","kiss","lick","pat","shinobu","smug","wink","yeet"],
    category: "anime - image",
    desc: "Generate anime image.",
    cooldown: 25,
    limit: 5,
    run: async ({ sius, m, args, Func }) => {
        let zer = await Func.fetchJson(`https://api.waifu.pics/sfw/${m.command}`)
        if (!zer || !zer.url) return m.reply("⚠️ Gagal");
        let caption = `✨ ${m.command.toUpperCase()}`
        await m.reply({ image: { url: zer.url }, caption })
    }
})