import fs from "fs"

commands.add({
    name: ["opencrate"],
    command: ["opencrate"],
    category: "rpg",
    register: true,
    desc: "Membuka crate rpg yang dimiliki!",
    run: async({ sius, m, args, Func }) => {
        const user = db.users[m.sender]
        try {
            const bufloc = fs.readFileSync('./lib/database/open.jpg')
            const noCapt = `Gunakan format .opencrate <nama crate> <jumlah>

*Contoh :* .opencrate common 2

*L I S T - C R A T E*
📦 Common
🛍️ Uncommon
🗳️ Mythic
🎁 Legendary
📫 Pet
`.trim()
            const type = (args[0] || '').toLowerCase()
            const count = isNumber(args[1]) ? (Math.round(Math.max(1, args[1]))) * 1 : 1 
            if (type === 'common') {
                if ((user.common * 1) < count) return m.reply(onKurang(type))
                let cmoney = 0, cexp = 0, ccommon = 0, cuncommon = 0, cpotion = 0 
                try {
                    for (let i = 0; i < count; i++) {
                        cmoney += (random(101)) * 1
                        cexp += (random(201)) * 1
                        ccommon += (pickRandom([0, 0, 0, 1, 0, 0, 0])) * 1
                        cuncommon += (pickRandom([0, 0,0, 0, 0, 1, 0, 0, 0, 0])) * 1
                        cpotion += (pickRandom([0, 0, 1, 0, 0, 0, 0])) * 1
                    }
                } finally { 
                    user.common -= count * 1 
                    user.money += cmoney * 1
                    user.exp += cexp * 1
                    user.potion += cpotion * 1
                    user.common += ccommon * 1
                    user.uncommon += cuncommon * 1
                    m.reply(mus(type, count, cmoney, cexp, cpotion, false, false, false, false, ccommon, cuncommon, false, Func))
                }
            } else if (type === 'uncommon') {
                if ((user.uncommon * 1) < count) return m.reply(onKurang(type))
                let udiamond = 0, umoney = 0, uexp = 0, umythic = 0, upotion = 0, uuncommon = 0, ucommon = 0, ukayu = 0, ustring = 0, ubatu = 0
                try {
                    for (let i = 0; i < count; i++) {
                        udiamond += (pickRandom([0,0,0, 0, 0, 1, 0,0,0,0,0])) * 1
                        umoney += (random(201)) * 1
                        uexp += (random(301)) * 1
                        umythic += (pickRandom([0, 0, 0, 0,0,0,0, 1, 0, 0, 0, 0,0,0,0])) * 1
                        upotion += (pickRandom([0, 1, 0, 0, 0])) * 1
                        uuncommon += (pickRandom([0,0,0, 0,0, 1, 0, 0, 0, 0, 0, 0,0,0])) * 1
                        ucommon += (pickRandom([0,0,0,0,0,1,0,0])) * 1
                        ukayu += (pickRandom([0, 0, 1])) * 1
                        ustring += (pickRandom([0, 0, 1])) * 1
                        ubatu += (pickRandom([0, 0, 1, 0])) * 1
                    }
                } finally {
                    user.uncommon -= count * 1 
                    user.money += umoney * 1
                    user.exp += uexp * 1
                    user.diamond += udiamond * 1
                    user.common += ucommon * 1
                    user.uncommon += uuncommon * 1
                    user.potion += upotion * 1
                    user.wood += ukayu * 1
                    user.rock += ubatu * 1
                    user.string += ustring * 1
                    m.reply(mus(type, count, umoney, uexp, upotion, ukayu, ubatu, ustring, false, ucommon, uuncommon, udiamond, Func))
                    if (umythic > 0) {
                        user.mythic += umythic * 1
                        m.reply(haveRare(umythic))
                    }
                }
            } else if (type === 'mythic') {
                if ((user.mythic * 1) < count) return m.reply(onKurang(type))
                let mmoney = 0, mexp = 0, mmyhtic = 0, mpotion = 0, mdiamond = 0, mlegendary = 0, mcommon = 0, muncommon = 0, mkayu = 0, mbatu = 0, mstring = 0, miron = 0, mpet = 0 
                try {
                    for (let i = 0; i < count; i++) {
                        mmoney += (random(301)) * 1
                        mexp += (random(401)) * 1
                        mpotion += (random(3)) * 1
                        mdiamond += (pickRandom([0, 0, 0, 0, 1, 0, 0, 0])) * 1
                        mlegendary += (pickRandom([0,0,0, 0, 0, 1, 0,0,0,0, 0, 0])) * 1
                        mcommon +=  (pickRandom([0, 0, 0,0, 0, 1, 0,])) * 1
                        muncommon += (pickRandom([0, 0, 0, 1, 0, 0, 0,])) * 1
                        mkayu += (random(2)) * 1 
                        mbatu += (random(2)) * 1 
                        mstring += (random(2)) * 1
                        miron += (pickRandom([0, 0, 1, 0])) * 1
                        mpet += (pickRandom([0, 0, 0, 1, 0])) * 1
                        mmyhtic += (pickRandom([0, 0, 0, 1, 0, 0, 0, 0])) * 1 
                    }
                } finally {
                    user.mythic -= count * 1 
                    user.money += mmoney * 1 
                    user.exp += mexp * 1 
                    user.potion += mpotion * 1 
                    user.diamond += mdiamond * 1 
                    user.common += mcommon * 1 
                    user.uncommon += muncommon * 1 
                    user.rock += mbatu * 1 
                    user.wood += mkayu * 1
                    user.string += mstring * 1 
                    user.iron += miron * 1 
                    m.reply(mus(type, count, mmoney, mexp, mpotion, mkayu, mbatu, mstring, miron, mcommon, muncommon, mdiamond, Func))
                    if (mmyhtic > 0) {
                        user.mythic += mmyhtic * 1 
                        m.reply(haveRare(mmyhtic))
                    } 
                if (mlegendary > 0 || mpet > 0) {
                    user.legendary += mlegendary * 1 
                    user.pet += mpet * 1
                    m.reply(haveEpic(mlegendary, mpet))
                }
                }
            } else if (type === 'legendary') {
                if ((user.legendary * 1) < count) return m.reply(onKurang(type))
                let lmoney = 0, lexp = 0, lmyhtic = 0, lpotion = 0, ldiamond = 0, llegendary = 0, lcommon = 0, luncommon = 0, lkayu = 0, lbatu = 0, lstring = 0, liron = 0, lpet = 0 
                try {
                    for(let i = 0; i < count; i++) {
                        lmoney += (random(401)) * 1 
                        lexp += (random(501)) * 1 
                        lpotion += (random(3)) * 1 
                        ldiamond += (pickRandom([0, 0,1, 0, 0,0])) * 1 
                        lcommon += (pickRandom([0, 0, 1, 0, 0])) * 1 
                        luncommon += (pickRandom([0, 0, 0, 0, 1, 0 ,0])) * 1 
                        lkayu += (random(2)) * 1 
                        lbatu += (random(2)) * 1 
                        lstring += (random(2)) * 1 
                        liron += (random(2)) * 1 
                        lpet += (pickRandom([0, 0, 0, 1, 0])) * 1
                        lmyhtic += (pickRandom([0, 0, 1, 0, 0, 0, 0, 0, 0])) * 1 
                        llegendary += (pickRandom([0, 0, 0, 1, 0, 0, 0 ,0 ,0])) * 1 
                    }
                } finally {
                    user.legendary -= count * 1
                    user.money += lmoney * 1 
                    user.exp += lexp * 1
                    user.potion += lpotion * 1 
                    user.wood += lkayu * 1 
                    user.rock += lbatu * 1 
                    user.string += lstring * 1 
                    user.iron += liron * 1 
                    user.common += lcommon * 1 
                    user.uncommon += luncommon * 1 
                    user.diamond += ldiamond * 1 
                    m.reply(mus(type, count, lmoney, lexp, lpotion, lkayu, lbatu, lstring, liron, lcommon, luncommon, ldiamond, Func))
                    if (lmyhtic > 0) { 
                        user.mythic += lmyhtic * 1 
                        m.reply(haveRare(lmyhtic))
                    }
                    if (llegendary > 0 || lpet > 0) {
                        user.legendary += llegendary * 1 
                        user.pet += lpet * 1 
                        m.reply(haveEpic(llegendary, lpet))
                    }
                }
            } else if (type === 'pet') {
                let _mknp = pickRandom([1, 2, 1, 5, 3, 2, 1, 2, 4, 1, 3, 5, 2, 4, 3])
                let mknp = (_mknp * 1)
                let kucing = user.cat
                let anjing = user.dog
                let rubah = user.fox
                let kuda = user.horse
                let _pet = `${pickRandom(['', 'kucing', 'rubah', 'kuda', 'anjing', ''])}`.trim()
                if (user.pet > 0) { 
                    user.pet -= 1
                if (_pet == 'kucing' && kucing > 0) {
                    user.potion += 2
                    user.petFood += mknp * 1
                    m.reply(havePetandGotPet(_pet, mknp * 1, 2))
                } else if (_pet == 'kucing' && kucing == 0) {
                    user.cat += 1
                    user.petFood += mknp * 1
                    m.reply(gotPetandNotHavethatPet(_pet, mknp * 1))
                } else if (_pet == 'rubah' && rubah > 0) {
                    user.potion += 2
                    user.petFood += mknp * 1
                    m.reply(havePetandGotPet(_pet, mknp, 2))
                } else if (_pet == 'rubah' && rubah == 0) {
                    user.fox += 1
                    user.petFood += mknp * 1
                    m.reply(gotPetandNotHavethatPet(_pet, mknp * 1))
                } else if (_pet == 'kuda' && kuda  > 0) {
                    user.potion += 2
                    user.petFood += mknp * 1
                    m.reply(havePetandGotPet(_pet, mknp * 1, 2))
                } else if (_pet == 'kuda' && kuda == 0) {
                    user.horse += 1
                    user.petFood += mknp * 1
                    m.reply(gotPetandNotHavethatPet(_pet, mknp * 1))
                } else if (_pet == 'anjing' && anjing > 0) {
                    user.potion += 2
                    user.petFood += mknp * 1
                    m.reply(havePetandGotPet(_pet, mknp * 1, 2))
                } else if (_pet == 'anjing' && anjing == 0) {
                    user.dog += 1
                    user.petFood += mknp * 1
                    m.reply(gotPetandNotHavethatPet(_pet, mknp * 1))
                } else {
                    user.petFood += mknp * 1
                    m.reply(gakDapetApa(mknp * 1))
                }
                } else m.reply('Pet Crate kamu tidak cukup')
            } else m.reply(noCapt, {
                contextInfo: {
                externalAdReply: {
                    title: "Gacha Crate RPG! 🎉",
                    thumbnail: bufloc,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    mediaUrl: config.github,
                    sourceUrl: config.github
                }
                }
            })
        } catch (e) {
            console.log(e)
            m.reply("Terjadi kesalahan saat membuka crate!")
        }
    }
})

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function emot(type) {
    let b = type.toLowerCase()
    let emotin = (b == 'potion' ? '🥤' : b == 'diamond' ? '💎' : b == 'common' ? '📦' : b == 'uncommon' ? '🛍️' : b == 'mythic' ? '🎁' : b == 'legendary' ? '🧰' : b == 'sampah' ? '🗑' : b == 'armor' ? '🥼' : b == 'sword' ? '⚔️' : b == 'kayu' ? '🪵' : b == 'batu' ? '🪨' : b == 'string' ? '🕸️' : b == 'kuda' ? '🐴' : b == 'centaur' ? '🐎' : b == 'griffin' ? '🦅' : b == 'serigala' ? '🐺' : b == 'naga' ? '🐉' : b == 'phonix' ? '🦜' : b == 'kucing' ? '🐱' : b == 'anjing' ? '🐕' : (b == 'makananpet' || b == 'makanannaga' || b == 'makanangriffin' || b == 'makananphonix' || b == 'makanancentaur' || b == 'makananserigala') ? '🥩' : '')
    return emotin
}

function onKurang(type) {
    return `*${emot(type)}${type}* Crate kamu tidak cukup`
}

function random(maxRandom) {
    return (Math.round(Math.random() * maxRandom)) * 1
}

function mus(crate, crate_count, money, exp, potion, kayu, batu, string, iron, common, uncommon, diamond, Func) {
    return `Kamu telah membuka *${crate_count} ${crate} Crate ${emot(crate)}* dan mendapatkan:${!money ? '' : `\n▢ 💵 *Money:* ${Func.formatUang(money)}`}${!exp ? '' : `\n▢ ✨ *Exp:* ${exp}`}${!potion ? '' : `\n▢🌡️ *Potion:* ${potion}`}${!kayu ? '' : `\n▢ 🪵 *Kayu:* ${kayu}`}${!batu ? '' : `\n▢ 🪨 *Batu:* ${batu}`}${!string ? '' : `\n🕸 *String:* ${string}`}${!iron ? '' : `\n▢ ⛓️ *Iron:* ${iron}`}${!diamond ? '' : `\n▢ 💎 *Diamond:* ${diamond}`}${!common ? '' : `\n▢ 📦 *Common:* ${common}`}${!uncommon ? '' : `\n▢ 🛍️ *Uncommon:* ${uncommon}`}`
}

function haveRare(count) {
    return `Selamat anda mendapatkan item Rare yaitu *${count}* Mythic Crate 🎁`
}

function haveEpic(legendary_count, pet_count) {
    return `Selamat anda mendapatkan item Epic yaitu ${legendary_count > 0 ? `*${legendary_count}* Legendary Crate🧰 ` : '' } ${pet_count > 0 && legendary_count > 0 ? `dan *${pet_count}* Pet Crate 📫` :  legendary_count < 1 && pet_count > 0 ? `*${pet_count}* 📫 Pet Crate` : '' }`
}
function gotPet(pet) {
    return `Selamat Anda mendapatkan pet *${emot(pet)}${pet}*`
}

function havePetandGotPet(pet, makananpet_count, potion_count) {
    return `${gotPet(pet)}, Anda sudah memiliki pet *${emot(pet)}${pet}*, Hadiahmu diganti dengan *${potion_count}* 🥤potion${makananpet_count > 0 ? ` Dan *${makananpet_count}* Makanan Pet 🥩` : ''}`
}

function gotPetandNotHavethatPet(pet, makananpet_count) {
    return `${gotPet(pet)} ${makananpet_count > 0 ? `Dan *${makananpet_count}* Makanan Pet 🥩` : ''}`
}

function gakDapetApa(makananpet_count) {
    return `${pickRandom(['Anda kurang beruntung', 'Coba buka lagi lain kali, karena gk dapet pet', 'kasian gk dapet pet', 'Mungkin lagi gk hoki dan gk dapet pet', 'wkwkkwkwke'])} Anda hanya mendapatkan *${makananpet_count}* 🥩Makanan pet'`
}

function isNumber(x) {  
    return !isNaN(x)
}
