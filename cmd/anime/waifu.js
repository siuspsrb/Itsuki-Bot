commands.add({
    name: ["waifu","neko"],
    command: ["waifu","neko"],
    desc: "Random anime images!",
    limit: 10,
    category: "anime - image",
    cooldown: 20,
    run: async({ sius, m, args, Func }) => {
        let text = args[0]
        let isNsfw = m.isGroup && db.groups[m.chat]?.nsfw || m.isPrem
		if (!isNsfw && text === 'nsfw') return m.reply("⚠️ Filter Nsfw sedang aktif atau anda membutuhkan izin admin atau setidak-tidaknya menjadi pengguna premium bot!")
		const res = await Func.fetchJson("https://api.waifu.pics/" + (text === "nsfw" ? "nsfw" : "sfw") + "/" + m.command)
		await m.reply({ image: { url: res.url }})
	}
})