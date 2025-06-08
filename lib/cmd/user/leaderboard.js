commands.add({
    name: ["leaderboard"],
    command: ["leaderboard"],
    alias: ["rank"],
    param: "<keyword>",
    category: "user",
    desc: "Melihat Papan Kehormatan Bintang di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        if (!user) return
        const now = Date.now()
        let guilds = global.db.guilds || {}
        const categories = {
            money: { 
                name: "money", 
                field: "money", 
                emoji: "💵", 
                title: "Miliarder Avandor" 
            },
            point: { 
                name: "Poin Keberanian", 
                field: "point", 
                emoji: "🎖️", 
                title: "Pahlawan Keberanian" 
            },
            battle: { 
                name: "Kemenangan Pertempur", 
                field: "battleWins", 
                emoji: "⚔️", 
                title: "Pahlawan Arena"
            },
            products: { 
                name: "Produktivitas Kandang", 
                field: "totalProducts", 
                emoji: "🌾", 
                title: "Penguasa Ladang" 
            },
            slot: { 
                name: "Kemenangan slot", 
                field: "slotWins", 
                emoji: "🎰", 
                title: "Penguasa Mesin Bintang" 
            },
            diamond: { 
                name: "Inti Berlian", 
                field: "diamond", 
                emoji: "💎", 
                title: "Kolektor Berlian" 
            },
            gold: { 
                name: "Emas Purnama", 
                field: "gold", 
                emoji: "🪙", 
                title: "Sultan Arvandor" 
            },
            limit: {
                name: "Limit kebebasan",
                field: "limit",
                emoji: "🎟️",
                title: "Pengasa kebebasan"
            }
        }
        const categoryInput = (args[0] || "money").toLowerCase()
        const category = categories[categoryInput] || categories.money
        const allUsers = Object.entries(db.users)
            .map(([id, data]) => ({
                id,
                level: data["level"] || "0",
                role: data["role"] || "-",
                tag: id.split("@")[0],
                value: data[category.field] || 0
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
        const userRank = allUsers.findIndex(u => u.id === userId) + 1;
        let userValue = user[category.field] || 0;
        const leaderboardStories = [`Di tengah Pasar Bintang Jatuh, *Papan Kehormatan Bintang* bersinar terang, menampilkan nama-nama petualang terhebat di Lembah Arvandor! ${user.activePet ? `*${user.activePet.toUpperCase()}* menggonggong bangga di sampingmu!` : ""}`,`Cahaya bintang menerangi *Papan Kehormatan Bintang*, mengukir legenda para pahlawan Arvandor. Nama-nama besar bersinar, dan kau menatapnya dengan tekad! ${user.activePet ? `*${user.activePet.toUpperCase()}* menatap papan dengan mata berbinar!` : ""}`,`Di bawah langit malam Arvandor, *Papan Kehormatan Bintang* memamerkan petualang terbaik. Namamu ada di sana, menanti untuk naik lebih tinggi! ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat, mendukungmu!` : ""}`]
        Func.addExp(user, 10)
        let rewardText = "";
        if (userRank <= 3 && userRank > 0) {
            const rewards = [
                { type: "money", value: 1000, emoji: "" },
                { type: "potion", value: 2, emoji: "🧪" },
                { type: "limit", value: 1, emoji: "⏳" }
            ]
            const reward = rewards[Math.floor(Math.random() * rewards.length)]
            user[reward.type] = (user[reward.type] || 0) + reward.value
            rewardText = `*🏆 Hadiah Harian!*\nKarena peringkat ${userRank}, kamu mendapatkan ${reward.emoji} ${reward.value} ${reward.type}!`
        }
        db.users[userId] = user
        const story = leaderboardStories[Math.floor(Math.random() * leaderboardStories.length)];
        let replyText = `${story.trim()}\n\n`;
        replyText += `*Posisimu ${userRank > 0 ? `ke-${userRank} dari ${Object.keys(db.users).length} pengguna*` : "belum masuk top 10*"}\n\n`
        replyText += `*TOP 10 GLOBAL ${category.name.toUpperCase()}*`;
        let ab = []
        allUsers.forEach((u, i) => {
            if (category.name == "money") {
                u.value = Func.formatUang(u.value)
            }        
            replyText += `
${i + 1}. @${u.tag}
         ├ ${category.emoji} ${category.name}: ${u.value} 
         ├ ⚜️ Role: ${u.role}
         └ 🎖: Level ${u.level}`;
            ab.push(u)
        });
        replyText += rewardText;
        replyText += `\n> Gunakan !leaderboard <money|point|battle|products|slot|limit> untuk kategori lain`
        replyText += "\n> *+ 10 EXP*"
        let abc = ab.map(x => x.id)
        m.reply(replyText, {
            contextInfo: {
                mentionedJid: abc,
                externalAdReply: {
                    title: "L E A D E R B O A R D - U S E R",
                    thumbnailUrl: "https://i.pinimg.com/originals/ec/c0/24/ecc024c495305910f0a3317254d32630.jpg",
                    mediaUrl: "https://i.pinimg.com/originals/ec/c0/24/ecc024c495305910f0a3317254d32630.jpg",
                    sourceUrl: null,
                    mediaType: 1,
                    previewType: "PHOTO",
                    renderLargerThumbnail: true
                }
            }
        })
    }
})

