commands.add({
    name: ["waifu","neko"],
    command: ["waifu","neko"],
    desc: "Random anime images!",
    limited: true,
    category: "anime",
    run: async({ sius, m, args, Func }) => {
        let text = args[0]
        let isNsfw = m.isGroup && db.groups[m.chat]?.nsfw || false
    	try {
		    if (!isNsfw && text === 'nsfw') return m.reply("*Filter Nsfw sedang aktif!*")
		    const res = await Func.fetchJson("https://api.waifu.pics/" + (text === "nsfw" ? "nsfw" : "sfw") + "/" + m.command)
			await m.reply({ image: { url: res.url }})
		} catch (e) {
			sius.cantLoad(e)
	    }
	}
})