import fs from "fs"

commands.add({
    name: ["inventory"],
    command: ["inventory"],
    alias: ["inv"],
    category: "user",
    desc: "Memeriksa harta di Gudang Cahaya Abadi Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        const now = Date.now()
        const inventoryStories = [`Kamu melangkah ke *Gudang Cahaya Abadi*, ruangan megah yang diterangi bintang. Harta dan hewanmu tersusun rapi, menanti petualangan berikutnya! ${user.activePet ? `*${user.activePet.toUpperCase()}* berlari di sampingmu, menjaga harta!` : ""}`,`Di bawah langit Arvandor, *Gudang Cahaya Abadi* membuka pintunya. Kamu memeriksa harta, senjata, dan hewanmu dengan penuh kebanggaan! ${user.activePet ? `*${user.activePet.toUpperCase()}* mengintip dengan rasa ingin tahu!` : ""}`,`Cahaya lembut menerangi *Gudang Cahaya Abadi*. Kamu menelusuri harta, merasakan semangat petualangan yang membara! ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat, siap mendampingimu!` : ""}`]        
        Func.addExp(user, 5)
        user.lastInventory = now
        db.users[userId] = user
        let inventorinya = `${inventoryStories[Math.floor(Math.random() * inventoryStories.length)].trim()}\n\n`
        inventorinya += `*STATUS PETUALANG*\n`
        inventorinya += `[💰] Money: ${Func.formatUang(user.money)}\n`
        inventorinya += `[🎖️] Point: ${user.point}\n`
        inventorinya += `[❤️] Health: ${user.health}/100${user.health < 30 ? " [!] Pulihkan dengan *!heal*" : ""}\n`
        inventorinya += `[🎓] Level: ${user.level} (EXP: ${user.exp}/${user.level * 100})\n`
        inventorinya += `[⚔️] Battle wins: ${user.battleWins}\n`
        inventorinya += `[🌾] Total produk kandang: ${user.totalProducts}\n`                
        inventorinya += `\n*ITEM DIMILIKI*\n`
        const items = [
            { name: "Potion", emoji: "🧪", count: user.potion },
            { name: "Pet food", emoji: "🌾", count: user.petFood },
            { name: "Limit", emoji: "⏳", count: user.limit }
        ]
        let hasItems = false
        for (let i of items) {
            if (i.count > 0) {
                hasItems = true
                inventorinya += `[${i.emoji}] ${i.name}: ${i.count}\n`
            }
        }
        if (!hasItems) inventorinya += "> Tidak ada item. Beli di !shop!\n"       
        inventorinya += `\n*MATERIAL DIMILIKI*\n`
        const materials = [
            { name: "Wood", emoji: "🪵", count: user.wood },
            { name: "Iron", emoji: "⛓️", count: user.iron },
            { name: "String", emoji: "🧵", count: user.string },
            { name: "Gold", emoji: "🪙", count: user.gold },
            { name: "Diamond", emoji: "💎", count: user.diamond },
            { name: "Rock", emoji: "🪨", count: user.rock }
        ]
        let hasMaterials = false
        for (let m of materials) {
            if (m.count > 0) {
                hasMaterials = true
                inventorinya += `[${m.emoji}] ${m.name}: ${m.count}\n`
            }
        }
        if (!hasMaterials) inventorinya += "> Tidak ada materials. Dapatkan dari !berburu!\n"        
        inventorinya += `\n*HASIL BURUAN*\n`
        const animals = [
            { name: "Sapi", emoji: "🐄", field: "sapi" },
            { name: "Banteng", emoji: "🐃", field: "banteng" },
            { name: "Harimau", emoji: "🐅", field: "harimau" },
            { name: "Gajah", emoji: "🐘", field: "gajah" },
            { name: "Kambing", emoji: "🐐", field: "kambing" },
            { name: "Panda", emoji: "🐼", field: "panda" },
            { name: "Buaya", emoji: "🐊", field: "buaya" },
            { name: "Kerbau", emoji: "🐂", field: "kerbau" },
            { name: "Monyet", emoji: "🐒", field: "monyet" },
            { name: "Ayam", emoji: "🐓", field: "ayam" },
            { name: "Domba", emoji: "🐑", field: "domba" },
            { name: "Horse", emoji: "🐎", field: "horse" }
        ]
        let hasAnimals = false
        for (let a of animals) {
            if (user[a.field] > 0) {
                hasAnimals = true
                inventorinya += `[${a.emoji}] ${a.name}: ${user[a.field]}\n`
            }
        }
        if (!hasAnimals) inventorinya += "> Tidak ada hewan. Buru dengan !berburu!\n"        
        inventorinya += `\n*KANDANG BINTANG LIAR* (${user.kandang.length}/${user.kandangCapacity})\n`
        inventorinya += `[🪵] Level kandang: ${user.kandangLevel}\n`
        inventorinya += `[🍂] Efisiensi: ${Math.floor(user.kandangEfficiency * 100)}%\n`
        inventorinya += `[🍁] Cooldown produksi: ${Math.floor(user.kandangProduceCooldown / 3600000)} jam\n`
        if (user.kandang.length === 0) {
            inventorinya += "> Kandang kosong. Tambahkan dengan *!addkandang!*\n"
        } else {
            for (let animal of user.kandang) {
                const emoji = animals.find(a => a.field === animal.type)?.emoji || "🦒"
                inventorinya += `- [${emoji}] ${animal.type}: ${animal.fed ? "sehat" : "lapar"}\n`
            }
        }        
        inventorinya += `\n*PRODUK KANDANG*\n`
        const products = [
            { name: "Milk", emoji: "🥛", count: user.products.milk },
            { name: "Wool", emoji: "🧶", count: user.products.wool },
            { name: "Egg", emoji: "🥚", count: user.products.egg },
            { name: "Golden egg", emoji: "🌟", count: user.products.goldenEgg }
        ]
        let hasProducts = false
        for (let p of products) {
            if (p.count > 0) {
                hasProducts = true
                inventorinya += `[${p.emoji}] ${p.name}: ${p.count}\n`
            }
        }
        if (!hasProducts) inventorinya += "> Tidak ada produk. Rawat kandang dengan !carekandang!\n"
        inventorinya += `\n*CRATES*\n`
        const crates = [
            { name: "Common", emoji: "⚱️", field: "common" },
            { name: "Uncommon", emoji: "🗳️", field: "uncommon" },
            { name: "Legendary", emoji: "🎁", field: "legendary" },
            { name: "Pet crate", emoji: "🪤", field: "pet" }
        ]
        let hasCrates = false
        for (let a of crates) {
            if (user[a.field] > 0) {
                hasCrates = true
                inventorinya += `[${a.emoji}] ${a.name}: ${user[a.field]}\n`
            }
        }
        if (!hasCrates) inventorinya += "> Tidak ada crate dimiliki.\n"                
        inventorinya += `\n*PET*\n`
        const pets = [
            { name: "Dog", emoji: "🐶", count: user.dog, level: user.dogLevel, exp: user.dogexp },
            { name: "Cat", emoji: "🐱", count: user.cat, level: user.catLevel, exp: user.catExp },
            { name: "Fox", emoji: "🦊", count: user.fox, level: user.foxLevel, exp: user.foxexp },
            { name: "Horse", emoji: "🐎", count: user.horse, level: user.horseLevel, exp: user.horseexp }
        ]
        let hasPets = false
        for (let p of pets) {
            if (p.count > 0) {
                hasPets = true
                const isActive = user.activePet === p.name.toLowerCase()
                inventorinya += `[${p.emoji}] ${p.name}\n Level: ${p.level} (${p.exp}/${p.level * 100})\n Status: ${isActive ? "Aktif" : "[×]"}\n`
            }
        }
        if (!hasPets) inventorinya += "> Tidak ada pet. Ketik *.buy* untik membeli!\n"        
        inventorinya += `\n*SENJATA DAN ARMOR*\n`
        const weapons = [
            { name: "Sword", emoji: "⚔️", count: user.sword, durability: user.sworddurability, max: 100 },
            { name: "Bow", emoji: "🏹", count: user.bow, durability: user.bowdurability, max: 100 },
            { name: "Magic wand", emoji: "🪄", count: user.magicWand, durability: user.magicWanddurability, max: 100 },
            { name: "Armor", emoji: "🛡️", count: user.armor, durability: user.armordurability, max: 100 }
        ]
        let hasWeapons = false
        for (let w of weapons) {
            if (w.count > 0) {
                hasWeapons = true
                inventorinya += `[${w.emoji}] ${w.name}: ${w.count} (Durabilitas: ${w.durability}/${w.max})${w.durability < 20 ? ", perbaiki dengan *!repair!*" : ""}\n`
            }
        }
        if (!hasWeapons) inventorinya += "> Tidak ada senjata atau armor. Craft dengan !craft!\n"
        inventorinya += `\n> 🎁 *+5* EXP`
        inventorinya += `\n> Gunakan !shop, !craft, !berburu, !kandang, atau !battle untuk mengelola harta ini!`        
        const buf = fs.readFileSync("./lib/media/rpg/inventory.jpg")
        m.reply(inventorinya, {
            contextInfo: {
                externalAdReply: {
                    title: "🛖 I N V E N T O R Y - U S E R",
                    thumbnail: buf,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    mediaUrl: null,
                    sourceUrl: null
                }
            }
        })
    }
})