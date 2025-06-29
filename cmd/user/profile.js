import fs from "fs"
import { getPremiumExpired, checkPremiumUser } from "../../lib/premium.js"

commands.add({
    name: ["profile"],
    command: ["profile"],
    category: "user",
    register: true,
    desc: "Melihat atau mengatur profil di Kitab Legenda Bintang Lembah Arvandor",
    run: async ({ sius, m, args, Func }) => {
        const userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
        let user = db.users[userId]
        if (!user) return m.reply("[×] User tidak terdaftar di database bot")
        const now = Date.now()
        if (args[0] && args[0].toLowerCase() === "setname") {
            if (!args[1]) {
            return m.reply("Masukkan nama baru!\n\n> Contoh: *!profile setname Arvandor*")
            }
            const newName = args.slice(1).join(" ").slice(0, 20)
            if (newName.length < 3) {
            return m.reply("Nama min. 3 karakter!")
            }
            if (user.lastProfile && now < user.lastProfile + 3600) {
                const timeLeft = Func.clockString(user.lastProfile + 3600 - now)
                return m.reply(`🌟 Kitab Legenda Bintang masih menulis! Ubah nama lagi dalam beberapa saat!\n\nTimeout: [ *${timeLeft}* ]`)
            }
            user.name = newName
            const expGain = 50
            Func.addExp(user, expGain)
            user.lastProfile = now
            db.users[userId] = user            
            let replyText = `🌟 *Nama Diubah!*\n\n`
            replyText += `Kamu menulis ulang namamu di *Kitab Legenda Bintang*. Kini, dunia Arvandor mengenalmu sebagai *${newName}*!\n\n`
            replyText += `> 🎁 Kamu mendapatkan: ${expGain} EXP`
            return m.reply(replyText)
        }
        if (args[0] && args[0].toLowerCase() === "settitle") {
            if (!args[1]) {
            return m.reply("Masukkan gelar baru!\n\n> Contoh: *!profile settitle Pahlawan Bintang*")
            }
            const newTitle = args.slice(1).join(" ").slice(0, 30)
            if (newTitle.length < 3) {
            return m.reply("Gelar minimal 3 karakter!")
            }
            const lockedTitles = [
                { title: "Raja Koin", req: { field: "money", value: 10000, leaderboard: 1 } },
                { title: "Pahlawan Arena", req: { field: "battleWins", value: 50 } },
                { title: "Penguasa Ladang", req: { field: "totalProducts", value: 100 } },
                { title: "Legenda Arvandor", req: { field: "level", value: 10 } }
            ]
            const isLocked = lockedTitles.find(t => t.title.toLowerCase() === newTitle.toLowerCase())
            if (isLocked) {
                if (isLocked.req.leaderboard) {
                    const allUsers = Object.entries(db.users)
                        .map(([id, data]) => ({ id, value: data[isLocked.req.field] || 0 }))
                        .sort((a, b) => b.value - a.value)
                    if (allUsers[0]?.id !== userId) {
                        return m.reply(`Gelar *${isLocked.title}* hanya untuk peringkat 1 di leaderboard ${isLocked.req.field}!`) //nona ambon
                    }
                } else if (user[isLocked.req.field] < isLocked.req.value) {
                    return m.reply(`Gelar *${isLocked.title}* membutuhkan ${isLocked.req.field} minimal ${isLocked.req.value}! Kamu punya: ${user[isLocked.req.field]}`)
                }
            }            
            user.title = newTitle
            const expGain = 50
            Func.addExp(user, expGain)
            user.lastProfile = now
            db.users[userId] = user            
            let replyText = `🌟 *Gelar Diubah!*\n\n`
            replyText += `Kamu mengukir gelar baru di *Kitab Legenda Bintang*. Kini, Arvandor memujimu sebagai *${newTitle}*!\n\n`
            replyText += `> 🎁 Kamu mendapatkan: ${expGain} EXP`
            return m.reply(replyText)
        }        
        if (user.lastProfile && now < user.lastProfile + 120000) {
            const timeLeft = Func.clockString(user.lastProfile + 120000 - now)
            return m.reply(`🌟 Kitab Legenda Bintang masih terbuka! Lihat lagi dalam *${timeLeft}*`)
        }        
        const profile = await sius.profilePictureUrl(userId, "image").catch(() => "./lib/database/default.jpg")
        const thumbnail = profile.startsWith("http") ? await (await Func.getBuffer(profile)) : fs.readFileSync(profile)
        const profileStories = [
            `Kamu membuka *Kitab Legenda Bintang*, dan halaman bersinar menampilkan kisahmu sebagai petualang Arvandor! ${user.activePet ? `*${user.activePet.toUpperCase()}* menatap halaman dengan bangga!` : ""}`,
            `Cahaya bintang menerangi *Kitab Legenda Bintang*. Kisahmu sebagai petualang terukir abadi, siap menginspirasi! ${user.activePet ? `*${user.activePet.toUpperCase()}* melompat di samping kitab!` : ""}`,
            `Di bawah langit Arvandor, *Kitab Legenda Bintang* terbuka, mengungkap legenda petualang bernama *${user.name}*! ${user.activePet ? `*${user.activePet.toUpperCase()}* menggonggong penuh semangat!` : ""}`
        ]        
        const expGain = 5
        Func.addExp(user, expGain)
        user.lastProfile = now
        db.users[userId] = user
        let prem = checkPremiumUser(userId, db.premium)
        let profileText = `${profileStories[Math.floor(Math.random() * profileStories.length)].trim()}\n\n`
        const formatDate = (n, locale = 'id') => {
            let d = new Date(n);
            return d.toLocaleDateString(locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });
        };
        profileText += `*IDENTITAS PENGGUNA*\n`
        profileText += `▢ Nama: ${user.name}\n`
        profileText += `▢ Gelar: ${user.title}\n`
        profileText += `▢ Limit: ${user.limit || "-"}\n`
        profileText += `▢ Money:  ${Func.formatUang(user.money)}\n`
        profileText += `▢ Point: ${user.point}\n`
        profileText += `▢ Premium: ${prem ? "√" : "×"}\n`
        if (prem) {
            profileText += `▢ Expired:\n    ${formatDate(getPremiumExpired(userId, db.premium))}\n`
        }
        profileText += `▢ Banned: ${user.ban ? "√" : "×"}\n`
        profileText += `▢ Warn: ${user.warn && user.warn > 0 ? `${user.warn}/5` : "×"}\n`
        profileText += `\n*STATISTIK RPG*\n`
        profileText += `▢ Level: ${user.level} (EXP: ${user.exp}/${user.level * 100})\n`
        profileText += `▢ Role: ${user.role}\n`
        profileText += `▢ Health: ${user.health}/100${user.health < 30 ? " ⚠️ Pulihkan dengan *.heal!*" : ""}\n`
        profileText += `▢ Battle Wins: ${user.battleWins}\n`
        profileText += `▢ Total Produk Kandang: ${user.totalProducts}\n`
        
        profileText += `\n*PET AKTIF*\n`
        if (!user.activePet) {
            profileText += "Tidak ada pet aktif. Aktifkan dengan !pet activate\n"
        } else {
            const pet = {
                dog: { emoji: "🐶", level: user.dogLevel, exp: user.dogexp },
                cat: { emoji: "🐱", level: user.catLevel, exp: user.catexp },
                fox: { emoji: "🦊", level: user.foxLevel, exp: user.foxexp },
                horse: { emoji: "🐎", level: user.horseLevel, exp: user.horseexp }
            }[user.activePet]
            profileText += `▢ ${pet.emoji} ${user.activePet.toUpperCase()}: Level ${pet.level} (EXP: ${pet.exp}/${pet.level * 100})\n`
        }        
        profileText += `\n*KANDANG STATS*\n`
        profileText += `▢ Level Kandang: ${user.kandangLevel}\n`
        profileText += `▢ Hewan: ${user.kandang.length}/${user.kandangCapacity}\n`
        profileText += `\n> Gunakan !profile setname <nama> atau !profile settitle <gelar> untuk kustomisasi!`
        profileText += `\n> *+ ${expGain} EXP*`
        await m.reply(profileText, {
            contextInfo: {
                externalAdReply: {
                    title: "P R O F I L E - U S E R",
                    thumbnail: thumbnail,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO",
                    mediaUrl: thumbnail,
                    sourceUrl: null
                }
            }
        })
    }
})