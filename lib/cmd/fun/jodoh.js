commands.add({
    name: ["jodoh"],
    command: ["jodoh"],
    category: "fun",
    group: true,
    run: async ({ m }) => {
        const members = m.metadata?.participants || [];
        const sender = m.sender;
        const filtered = members.filter(p => p.id !== sender);
        if (filtered.length < 1) return m.reply("[×] Gak ada member lain buat dijodohin 😢");
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        const teks = `💘 *Cieee... ada yang jodoh nih!*\n\n@${sender.split("@")[0]} ❤️ @${random.id.split("@")[0]}\n\nSemoga cocok yaaa 😍`;
        await m.reply(teks)
    }
});

commands.add({
    name: ["jodohkan"],
    command: ["jodohkan"],
    category: "fun",
    group: true,
    run: async ({ m }) => {
        const participants = m.metadata?.participants?.map(v => v.id).filter(v => !v.endsWith("g.us"));
        if (!participants || participants.length < 2) {
            return m.reply("[×] Butuh minimal 2 member buat dijodohin.");
        }
        let user1, user2;
        do {
            user1 = participants[Math.floor(Math.random() * participants.length)];
            user2 = participants[Math.floor(Math.random() * participants.length)];
        } while (user1 === user2);
        const teks = `💞 *Jodoh Hari Ini*\n\n@${user1.split("@")[0]} ❤️ @${user2.split("@")[0]}\n\nCiee, cocok ngga nih? 😍`;
        await m.reply(teks)
    }
});