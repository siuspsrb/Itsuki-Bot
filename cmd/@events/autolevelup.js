import canvafy from "canvafy"
import Jimp from "jimp"

const backgrounds = [
    "https://i.pinimg.com/originals/88/d5/69/88d56937557cfcb4aaf6514c5a15ed4d.jpg",
    "https://i.pinimg.com/originals/65/d1/fb/65d1fb5135b6fd155edb28276410cae8.jpg",
    "https://i.pinimg.com/originals/58/d0/a3/58d0a3b4f186fbac56a1e384611163e7.jpg",
    "https://i.pinimg.com/originals/f2/56/2a/f2562a700916b66a602dd52448835a3d.jpg",
    "https://i.pinimg.com/originals/9e/53/f9/9e53f9b716ef81ba022518f25b03994b.jpg"
]

async function generateRankCard(m, user, sius) {
    const avatar = await sius.profilePictureUrl(m.sender, "image")
        .catch(() => "https://files.catbox.moe/39hmb8.jpg")

    const allUsers = Object.entries(db.users)
    const ranked = allUsers.sort(([, a], [, b]) => (b.level || 0) - (a.level || 0))
    const rank = ranked.findIndex(([jid]) => jid === m.sender) + 1
    const currentXp = user.exp
    const neededXp = Math.floor(1000 * Math.pow(1.2, user.level - 1))

    const rawBuffer = await new canvafy.Rank()
        .setAvatar(avatar)
        .setBackground("image", backgrounds[Math.floor(Math.random() * backgrounds.length)])
        .setUsername(user.name || m.pushName || "-")
        .setBorder("#272918")
        .setBarColor("#9a9b9c")
        .setStatus("online")
        .setLevel(user.level)
        .setRank(rank)
        .setCurrentXp(currentXp)
        .setRequiredXp(neededXp)
        .build()

    // resize
    const resized = await Jimp.read(rawBuffer)
        .then(img => img.resize(800, 418).getBufferAsync(Jimp.MIME_JPEG))

    return resized
}

function checkUserLevelUp(user) {
    const baseExp = 1000
    const neededExp = Math.floor(baseExp * Math.pow(1.2, user.level - 1))
    if (user.exp >= neededExp) {
        const roles = [
            { minLevel: 0, name: "🦗 Beginner" },
            { minLevel: 5, name: "⚔️ Warrior" },
            { minLevel: 10, name: "🛡️ Knight" },
            { minLevel: 15, name: "⚜️ Lord" },
            { minLevel: 20, name: "💎 Elite" },
            { minLevel: 30, name: "👑 Legend" }
        ]
        const oldLevel = user.level
        user.level += 1
        user.exp -= neededExp
        user.money = (Number(user.money) + 5000).toString()
        const newRole = roles.reverse().find(r => user.level >= r.minLevel)?.name || roles[0].name
        let roleMsg = ""
        if (user.role !== newRole) {
            user.role = newRole
            roleMsg = `\n🎖️ *NEW ROLE*: ${newRole}`
        }
        return `(Lv.${oldLevel} → Lv.${user.level}) | +5.000 💵${roleMsg}`
    }
    return null
}

function checkPetLevelUp(user, petName) {
    const pets = {
        dog: { expKey: "dogexp", levelKey: "dogLevel", emoji: "🐶" },
        cat: { expKey: "catngexp", levelKey: "catngLevel", emoji: "🐱" },
        fox: { expKey: "foxexp", levelKey: "foxLevel", emoji: "🦊" },
        horse: { expKey: "horseexp", levelKey: "horseLevel", emoji: "🐎" }
    }
    const pet = pets[petName]
    if (!pet || !user[pet.expKey]) return null
    const expNeeded = 500 * Math.pow(1.1, user[pet.levelKey] || 1)
    if (user[pet.expKey] >= expNeeded) {
        const oldLevel = user[pet.levelKey] || 0
        user[pet.levelKey] = oldLevel + 1
        user[pet.expKey] -= expNeeded
        return `✨ ${pet.emoji} *PET LEVEL UP* (Lv.${oldLevel} → Lv.${user[pet.levelKey]})`
    }
    return null
}

export default {
    name: "autolevelup",
    exec: async ({ sius, m }) => {
        const user = db.users[m.sender]
        const levelUpMessages = []
        const userLevelMsg = checkUserLevelUp(user)
        if (userLevelMsg) levelUpMessages.push(userLevelMsg)
        for (const pet of ["dog", "cat", "fox", "horse"]) {
            if (user[pet] > 0) {
                const petMsg = checkPetLevelUp(user, pet)
                if (petMsg) levelUpMessages.push(petMsg)
            }
        }
        if (levelUpMessages.length > 0) {
            try {
                const rankImage = await generateRankCard(m, user, sius)
                await m.reply({ 
                    text: levelUpMessages.join("\n"),
                    contextInfo: {
                    externalAdReply: {
                        title: "🎉 L E V E L - U P !",
                        mediaType: 1,
                        previewType: "PHOTO",
                        sourceUrl: config,
                        thumbnail: rankImage,
                        renderLargerThumbnail: true
                    }
                    }
                })
            } catch (err) {
                console.error("[rankcard error]", err)
                await m.reply(`🎉 *LEVEL UP!*\n\n${levelUpMessages.join("\n")}`)
            }
            return true
        }
        return false
    }
}