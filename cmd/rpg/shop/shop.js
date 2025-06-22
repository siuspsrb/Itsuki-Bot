commands.add({
    name: ["shop","market"],
    command: ["shop","market"],
    category: "rpg",
    register: true,
    desc: "Mengunjungi pasar bintang jatuh di Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]        
        const shopItems = [ // untuk dibeli 
            { name: "Potion", emoji: "🧪", type: "item", price: 500, desc: "Memulihkan 30-50 HP", field: "potion" },
            { name: "Pet Food", emoji: "🌾", type: "item", price: 300, desc: "Makanan untuk pet setiamu", field: "petFood" },
            { name: "Limit", emoji: "⏳", type: "item", price: 1000, desc: "Meningkatkan akses ke fitur bot", field: "limit" },
            { name: "Wood", emoji: "🪵", type: "material", price: 100, desc: "Kayu untuk crafting", field: "wood" },
            { name: "Iron", emoji: "⛓️", type: "material", price: 200, desc: "Besi untuk crafting", field: "iron" },
            { name: "String", emoji: "🧵", type: "material", price: 150, desc: "Tali untuk crafting", field: "string" },
            { name: "Dog", emoji: "🐶", type: "pet", price: 5000, desc: "Anjing setia, membantu di petualangan", field: "dog", minLevel: 5 },
            { name: "Cat", emoji: "🐱", type: "pet", price: 5000, desc: "Kucing gesit, mengurangi risiko", field: "cat", minLevel: 5 }
        ]        
        const sellableItems = [ // untuk dijual
            { name: "Sapi", emoji: "🐄", field: "sapi", price: 1000, desc: "Hasil buruan yang berharga" },
            { name: "Banteng", emoji: "🐃", field: "banteng", price: 1500, desc: "Hewan kuat dari savana" },
            { name: "Harimau", emoji: "🐅", field: "harimau", price: 2000, desc: "Predator ganas" },
            { name: "Gajah", emoji: "🐘", field: "gajah", price: 2500, desc: "Raksasa yang megah" },
            { name: "Kambing", emoji: "🐐", field: "kambing", price: 800, desc: "Hewan lincah dari hutan" },
            { name: "Panda", emoji: "🐼", field: "panda", price: 1800, desc: "Hewan langka dari rawa" },
            { name: "Buaya", emoji: "🐊", field: "buaya", price: 1700, desc: "Reptil mematikan" },
            { name: "Kerbau", emoji: "🐂", field: "kerbau", price: 1200, desc: "Hewan tangguh" },
            { name: "Monyet", emoji: "🐒", field: "monyet", price: 600, desc: "Hewan cerdik" },
            { name: "Ayam", emoji: "🐓", field: "ayam", price: 400, desc: "Unggas kecil" },
            { name: "Domba", emoji: "🐑", field: "domba", price: 700, desc: "Hewan berbulu lembut" },
            { name: "Horse", emoji: "🐎", field: "horse", price: 2000, desc: "Kuda cepat" },
            { name: "Wood", emoji: "🪵", field: "wood", price: 50, desc: "Kayu dari hutan" },
            { name: "Iron", emoji: "⛓️", field: "iron", price: 100, desc: "Besi dari tambang" },
            { name: "String", emoji: "🧵", field: "string", price: 75, desc: "Tali dari buruan" }
        ]
        
        let replyText = `Di bawah langit berkilau Lembah Arvandor, Pasar Bintang Jatuh hidup dengan sorak pedagang dan gemerlap barang ajaib. Apa yang kau cari, petualang?\n\n`        
        replyText += "\`🛒 BARANG UNTUK DIBELI\`\n"
        for (let item of shopItems) {
            let minLvl = ""
            if (item.minLevel) {
                minLvl = `(Min. Level: ${item.minLevel})`
            }
            const price = Func.getDynamicPrice(item.price, user.level)
            replyText += `▢ ${item.emoji} *${item.name}:* ${formatUang(price)} ${minLvl}`
            replyText += "\n"
        }
        
        replyText += "\n\`💰 BARANG UNTUK DIJUAL*\`\n"
        for (let item of sellableItems) {
            const price = Func.getDynamicPrice(item.price, user.level)
            replyText += `▢ ${item.emoji} *${item.name}:* ${formatUang(price)}`
            replyText += "\n"
        }
        
        replyText += `\n> *💵 Saldo:* ${formatUang(user.money)}\n`
        replyText += `> *🎖️ Poin:* ${user.point} Point`
        m.reply(replyText, {
            contextInfo: {
                externalAdReply: {
                    thumbnailUrl: "https://i.pinimg.com/originals/50/0a/09/500a0985932d190d9102912d23dbd51d.jpg",
                    mediaUrl: "https://i.pinimg.com/originals/50/0a/09/500a0985932d190d9102912d23dbd51d.jpg",
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    sourceUrl: config.github
                }
            }
        })
        //sius.reply(m.chat, replyText, "🌟 *PASAR BINTANG JATUH*", false)
    }
})

function formatUang(amount, options = {}) {
    const currency = options.currency || "";
    const decimals = options.decimals ?? 1;
    const num = Number(amount);
    if (isNaN(num)) return `Rp 0`; //hijwr bule
    const absNum = Math.abs(num);
    if (absNum >= 1e9) {
        return `Rp ${(num / 1e9).toFixed(decimals).replace(/\.0$/, "")} Miliar`;
    }
    if (absNum >= 1e6) {
        return `Rp ${(num / 1e6).toFixed(decimals).replace(/\.0$/, "")} Juta`;
    }
    const formatted = Math.floor(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${num < 0 ? "-" : ""} Rp ${formatted} ${currency}`;
}