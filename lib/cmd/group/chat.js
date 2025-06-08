import store from "../../source/store.js"

commands.add({
    name: ["listonline"],
    command: ["listonline"],
    alias: ["liston"],
    category: "group",
    desc: "Melihat member dengan status online",
    admin: true,
    group: true,
    botAdmin: true,
    run: async ({ sius, m, args }) => {
	    let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
	    let botNumber = sius.decodeJid(sius.user.id)
		if (!store.presences || !store.presences[id]) return m.reply('Sedang Tidak ada yang online!')
		let online = [...Object.keys(store.presences[id]), botNumber]
		await m.reply('List Online:\n\n' + online.map(v => '    ▢ @' + v.replace(/@.+/, '')).join`\n`, { mentions: online }).catch((e) => m.reply('Sedang Tidak Ada Yang Online..'))
	}
})

commands.add({
    name: ["totalpesan"],
    command: ["totalpesan"],
    category: "group",
    desc: "Menampilkan jumlah pesan per anggota di grup",
    alias: ["totalmsg","totalchat","chattotal"],
    group: true,
    run: async ({ sius, m, args }) => {
        try {
            const metadata = m.metadata || (store?.messages[m.chat]?.array?.slice(-1)[0]?.metadata);
            if (!metadata) {
                return await sius.reply(m.chat, "Gagal mengambil informasi grup. Coba lagi nanti.", global.config.botname, false);
            }
            const participants = metadata.participants?.map(p => p.id) || [];
            if (!participants.length) {
                return await sius.reply(m.chat, "Tidak ada anggota di grup ini.", global.config.botname, false);
            }
            let messageCount = {};
            let messages = store?.messages[m.chat]?.array || [];
            messages.forEach(mes => {
                if (mes.sender && mes.message) {
                    messageCount[mes.sender] = (messageCount[mes.sender] || 0) + 1;
                }
            });
            let totalMessages = Object.values(messageCount).reduce((a, b) => a + b, 0, 0);
            let date = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            let messageList = Object.entries(messageCount).map(([sender, count], index) => {
                return `▢ @${sender.replace(/[^0-9]/g, '')}: ${count} Pesan`;
            });
            let showSider = args.includes('sider');
            let zeroMessageUsers = participants
                .filter(user => !messageCount[user])
                .map(user => `▢ @${user.replace(/[^0-9]/g, '')}`);
            let siderText = showSider
                ? (zeroMessageUsers.length > 0
                    ? `Sisa Anggota yang tidak mengirim pesan (Sider):\n${zeroMessageUsers.join('\n')}`
                    : 'Semua anggota sudah mengirim pesan!')
                : `Cek Sider? .totalpesan sider`;
            let result = `*TOTAL PESAN DI GRUP*\n\n` +
                         `▢ Total Pesan: ${totalMessages} dari ${participants.length} anggota\n` +
                         `▢ Tanggal: ${date}\n\n` +
                         `*Daftar Pesan:*\n${messageList.length > 0 ? messageList.join('\n') : 'Belum ada pesan.'}\n\n` +
                         `*Note:*\n${siderText}`;
            await m.reply(result)
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});