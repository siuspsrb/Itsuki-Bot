import fs from "fs"

commands.add({
    name: ["daily"],
    command: ["daily"],
    category: "rpg",
    register: true,
    desc: "Mengambil hadiah harian rpg.",
    run: async({ sius, m, args, Func }) => {
        const user = db.users[m.sender]
        const _timers = (86400000 - (new Date - user.lastclaim))
        const timers = Func.clockString(_timers) 
        if (new Date - user.lastclaim > 86400000) {
            const buf = fs.readFileSync('./lib/database/daily.jpg')
            const cpt = `+ $ 1.000 Money 💵
+ 1 Wood 🪵
+ 2 Rock 🪨
+ 1 Potion 🥤
+ 2 Common crate 📦
+ 1 Sword ⚔️
+ 2 Pet Food 🍖
+ 5 String 🕸️
+ 1 Pet Crate 🪤
`.trim()
            m.reply(cpt, {
                contextInfo: {
                externalAdReply: {
                    title: "Hadiah harian! 🎉",
                    thumbnail: buf,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    previewType: "PHOTO",
                    mediaUrl: config.github,
                    sourceUrl: config.github
                }
                }
            })
            user.money += 1000 * 1
            user.potion += 1 * 1
            user.wood += 1 * 1
            user.rock += 2 * 1
            user.common += 2 * 1
            user.sword += 1 * 1
            user.petFood += 2 * 1
            user.pet += 1 * 1
            user.string += 5 * 1
            user.lastclaim = new Date * 1
        } else {
            m.reply(`Kamu sudah melakukan claim hari ini, silahkan menunggu sampai besok untuk melakukan claim lagi.\n\nTimeout : [ *${timers}* ]`)
        }
    }
})



commands.add({
    name: ["hourly"],
    command: ["hourly"],
    category: "rpg",
    register: true,
    desc: "Mengambil hadiah rpg setiap jam.",
    run: async({ sius, m, args, Func }) => {
        const user = db.users[m.sender]
        const _timers = (3600000 - (new Date - user.lasthourly))
        const timers = Func.clockString(_timers) 
        if (new Date - user.lasthourly > 3600000) {
            const bufer = fs.readFileSync('./lib/database/hourly.jpg')
            const cpp = `+ $ 250 Money 💵
+ 1 Wood 🪵
+ 2 Potion 🥤
+ 5 Rock 🪨
+ 10 String 🕸️
+ 1 Common Crate 📦
`.trim() 
            m.reply(cpp, {
                contextInfo: {
                externalAdReply: {
                    title: "Claim hadiah setiap jam! 🎉",
                    thumbnail: bufer,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    mediaUrl: config.github,
                    sourceUrl: config.github
                }
                }
            })            
            user.money += 250 * 1
            user.wood += 1 * 1
            user.potion += 2 * 1
            user.rock += 1 * 5
            user.string += 2 * 5
            user.common += 1 * 1
            user.lasthourly = new Date * 1
        } else {
            m.reply(`Kamu sudah melakukan hourly, silahkan menunggu satu jam kemudian untuk melakukan hourly lagi.\n\nTimeout : [ *${timers}* ]`)
        }
    }
})


commands.add({
    name: ["weekly"],
    command: ["weekly"],
    category: "rpg",
    register: true,
    desc: "Mengambil hadiah mingguan rpg.",
    run: async({ sius, m, args, Func }) => {
        const user = db.users[m.sender]
        const _timers = (604800000 - (new Date - user.lastweekly))
        const timers = Func.clockString(_timers) 
        if (new Date - user.lastweekly > 604800000) {
            const bufer = fs.readFileSync('./lib/database/weekly.jpg')
            const cpp = `+ $ 10.000 Money 💵
+ 1 Armor 🥋
+ 2 Dog 🐶
+ 1 Fox 🦊
+ 2 Uncommon crate 📦
+ 1 Diamond 💎
+ 5 Pet Food 🍖
+ 10 String 🕸️
+ 2 Pet Crate 🪤
`.trim() 
            m.reply(cpp, {
                contextInfo: {
                externalAdReply: {
                    title: "Hadiah Mingguan! 🎉",
                    thumbnail: bufer,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    mediaUrl: config.github,
                    sourceUrl: config.github
                }
                }
            })            
            user.money += 10000 * 1
            user.armor += 1 * 1
            user.dog += 2 * 1
            user.fox += 1 * 1
            user.uncommon += 2 * 1
            user.diamond += 1 * 1
            user.petFood += 5 * 1
            user.pet += 2 * 1
            user.string += 5 * 2
            user.lastweekly = new Date * 1
        } else {
            m.reply(`Kamu sudah melakukan weekly, silahkan menunggu satu minggu kemudian untuk melakukan claim lagi.\n\nTimeout : [ *${timers}* ]`)
        }
    }
})

commands.add({
    name: ["monthly"],
    command: ["monthly"],
    category: "rpg",
    register: true,
    desc: "Mengambil hadiah bulanan rpg.",
    run: async({ sius, m, args, Func }) => {
        const user = db.users[m.sender]
        const _timers = (2592000000 - (new Date - user.lastmonthly))
        const timers = Func.clockString(_timers) 
        if (new Date - user.lastmonthly > 2592000000) {
            const bufer = fs.readFileSync('./lib/database/monthly.jpg')
            const cpp = `+ $ 100.000 Money 💵
+ 50 Wood 🪵
+ 10 Potion 🥤
+ 15 Rock 🪨
+ 7 Emerald ♨️
+ 20 String 🕸️
+ 1 Legendary Crate 🎁
+ 5 Diamond 💎
+ 3 Pet Crate 🪤
`.trim() 
            m.reply(cpp, {
                contextInfo: {
                externalAdReply: {
                    title: "Hadiah Mingguan! 🎉",
                    thumbnail: bufer,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    mediaUrl: config.github,
                    sourceUrl: config.github
                }
                }
            })            
            user.money += 100000 * 1
            user.wood += 25 * 2
            user.potion += 5 * 2
            user.rock += 3 * 5
            user.emerald += 7 * 1
            user.string += 4 * 5
            user.diamond += 5 * 1
            user.legendary += 1 * 1
            user.diamond += 5 * 1
            user.pet += 3 * 1
            user.lastmonthly = new Date * 1
        } else {
            m.reply(`Kamu sudah melakukan monthly, silahkan menunggu satu bulan kemudian untuk melakukan claim lagi.\n\nTimeout : [ *${timers}* ]`)
        }
    }
})