import jimp from "jimp"
const delay = time => new Promise(res => setTimeout(res, time))

const resize = async (image, width, height) => {
    const read = await jimp.read(image)
    const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return data
}

import {
    emoji_role,
    sesi,
    playerOnGame,
    playerOnRoom,
    playerExit,
    dataPlayer,
    dataPlayerById,
    getPlayerById,
    getPlayerById2,
    killWerewolf,
    killww,
    dreamySeer,
    sorcerer,
    protectGuardian,
    roleShuffle,
    roleChanger,
    roleAmount,
    roleGenerator,
    addTimer,
    startGame,
    playerHidup,
    playerMati,
    vote,
    voteResult,
    clearAllVote,
    getWinner,
    win,
    pagi,
    malam,
    skill,
    voteStart,
    voteDone,
    voting,
    run,
    run_vote,
    run_malam,
    run_pagi
} from "../../lib/werewolf.js"

const thumb = "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg"

commands.add({
    name: ["werewolf"],
    command: ["werewolf", "ww"],
    category: "games",
    desc: "permainan sosial werewolf multiplayer",
    group: true,
    run: async ({ sius, m, args }) => {
        let { sender, chat } = m
        sius.werewolf = sius.werewolf || {}
        let ww = sius.werewolf
        let data = ww[chat]
        let value = args[0]
        let target = args[1]

        if (value === "create") {
            if (chat in ww) return m.reply("⚠️ Group masih dalam sesi permainan")
            if (playerOnGame(sender, ww)) return m.reply("⚠️ Kamu masih dalam sesi game")
            ww[chat] = {
                room: chat,
                owner: sender,
                status: false,
                iswin: null,
                cooldown: null,
                day: 0,
                time: "malem",
                player: [],
                dead: [],
                voting: false,
                seer: false,
                guardian: [],
            }
            return m.reply("[√] Room berhasil dibuat, ketik *.ww join* untuk bergabung")

        } else if (value === "join") {
            if (!ww[chat]) return m.reply("⚠️ Belum ada sesi permainan")
            if (ww[chat].status) return m.reply("⚠️ Sesi permainan sudah dimulai")
            if (ww[chat].player.length > 16) return m.reply("⚠️ Maaf jumlah player telah penuh")
            if (playerOnRoom(sender, chat, ww)) return m.reply("⚠️ Kamu sudah join dalam room ini")
            if (playerOnGame(sender, ww)) return m.reply("⚠️ Kamu masih dalam sesi game")

            let data = {
                id: sender,
                number: ww[chat].player.length + 1,
                sesi: chat,
                status: false,
                role: false,
                effect: [],
                vote: 0,
                isdead: false,
                isvote: false,
            }
            ww[chat].player.push(data)

            let text = `\n*⌂ W E R E W O L F - P L A Y E R*\n\n`
            for (let i = 0; i < ww[chat].player.length; i++) {
                text += `${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace("@s.whatsapp.net", "")}\n`
            }
            text += "\nJumlah player minimal adalah 5 dan maksimal 15"
            return m.reply(text.trim())

        } else if (value === "start") {
            if (!ww[chat]) return m.reply("⚠️ Belum ada sesi permainan")
            if (!ww[chat].player.length) return m.reply("⚠️ Room belum memiliki player")
            if (ww[chat].player.length < 5) return m.reply("⚠️ Jumlah player belum cukup")
            if (!playerOnRoom(sender, chat, ww)) return m.reply("⚠️ Kamu belum join dalam room ini")
            if (ww[chat].status) return m.reply("⚠️ Sesi permainan telah dimulai")
            if (ww[chat].owner !== sender) return m.reply(`⚠️ Hanya @${ww[chat].owner.split("@")[0]} yang dapat memulai permainan`, false, { mentions: [ww[chat].owner] })

            if (ww[chat].cooldown > 0) {
                clearAllVote(chat, ww)
                addTimer(chat, ww)
                if (ww[chat].time === "voting") return await run_vote(sius, chat, ww)
                if (ww[chat].time === "malem") return await run_malam(sius, chat, ww)
                if (ww[chat].time === "pagi") return await run_pagi(sius, chat, ww)
            }

            roleGenerator(chat, ww)
            addTimer(chat, ww)
            startGame(chat, ww)

            let list1 = ""
            let list2 = ""
            let player = []
            for (let i = 0; i < ww[chat].player.length; i++) {
                list1 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace("@s.whatsapp.net", "")}\n`
                list2 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace("@s.whatsapp.net", "")} ${["werewolf", "sorcerer"].includes(ww[chat].player[i].role) ? `[${ww[chat].player[i].role}]` : ""}\n`
                player.push(ww[chat].player[i].id)
            }
                
            await sius.sendMessage(m.chat, {
                text: "*⌂ W E R E W O L F - G A M E*\n\nGame telah dimulai, silakan cek chat pribadi untuk melihat role kalian.",
                contextInfo: {
                externalAdReply: {
                    title: 'W E R E - W O L F',
                    sourceUrl: '',
                    thumbnail: await resize(thumb, 300, 175),
                    renderLargerThumbnail: false,
                    mediaType: 1,
                    previewType: "PHOTO"
                }
                }
            }, { quoted: m })

            for (let p of ww[chat].player) {
                if (p.isdead) continue
                let teks = ""
                if (p.role === "werewolf") {
                    teks = `Hai ${sius.getName(p.id)}, Kamu adalah *Werewolf* ${emoji_role("werewolf")}\n*LIST PLAYER:*\n${list2}\n\nKetik *.wwpc kill nomor* untuk membunuh`
                } else if (p.role === "warga") {
                    teks = `Hai ${sius.getName(p.id)}, Peran kamu *Warga Desa* ${emoji_role("warga")}\n*LIST PLAYER:*\n${list1}`
                } else if (p.role === "seer") {
                    teks = `Hai ${sius.getName(p.id)}, Kamu adalah *Penerawang* ${emoji_role("seer")}\n*LIST PLAYER:*\n${list1}\n\nKetik *.wwpc dreamy nomor* untuk menerawang`
                } else if (p.role === "guardian") {
                    teks = `Hai ${sius.getName(p.id)}, Kamu *Malaikat Pelindung* ${emoji_role("guardian")}\n*LIST PLAYER:*\n${list1}\n\nKetik *.wwpc deff nomor* untuk melindungi`
                } else if (p.role === "sorcerer") {
                    teks = `Hai ${sius.getName(p.id)}, Kamu adalah *Penyihir* ${emoji_role("sorcerer")}\n*LIST PLAYER:*\n${list2}\n\nKetik *.wwpc sorcerer nomor* untuk lihat role`
                }

                await sius.sendMessage(p.id, {
                    text: teks,
                    mentions: player,
                })
                await delay(1500)
            }

            return await run(sius, chat, ww)

        } else if (value === "vote") {
            if (!ww[chat]) return m.reply("⚠️ Belum ada sesi permainan")
            if (!ww[chat].status) return m.reply("⚠️ Sesi permainan belum dimulai")
            if (ww[chat].time !== "voting") return m.reply("⚠️ Sesi voting belum dimulai")
            if (!playerOnRoom(sender, chat, ww)) return m.reply("⚠️ Kamu bukan player")
            if (dataPlayer(sender, ww).isdead) return m.reply("⚠️ Kamu sudah mati")
            if (!target || target.length < 1 || target.length > 2) return m.reply("⚠️ Masukkan nomor player")
            if (isNaN(target)) return m.reply("⚠️ Gunakan hanya angka")
            if (dataPlayer(sender, ww).isvote) return m.reply("⚠️ Kamu sudah voting")
            let byId = getPlayerById2(sender, parseInt(target), ww)
            if (byId.db.isdead) return m.reply("⚠️ Player sudah mati")
            if (ww[chat].player.length < parseInt(target)) return m.reply("⚠️ Nomor player invalid")
            if (!getPlayerById(chat, sender, parseInt(target), ww)) return m.reply("⚠️ Player tidak ditemukan")
            vote(chat, parseInt(target), sender, ww)
            return m.reply("✅ Vote berhasil")

        } else if (value === "exit") {
            if (!ww[chat]) return m.reply("⚠️ Tidak ada sesi permainan")
            if (!playerOnRoom(sender, chat, ww)) return m.reply("⚠️ Kamu tidak join sesi")
            if (ww[chat].status) return m.reply("⚠️ Game sudah dimulai")
            m.reply(`@${sender.split("@")[0]} keluar dari permainan`, false, { mentions: [sender] })
            playerExit(chat, sender, ww)

        } else if (value === "delete") {
            if (!ww[chat]) return m.reply("⚠️ Tidak ada sesi permainan")
            if (ww[chat].owner !== sender)
                return m.reply(`⚠️ Hanya @${ww[chat].owner.split("@")[0]} yg bisa hapus sesi`, false, { mentions: [ww[chat].owner] })
            delete ww[chat]
            return m.reply("[√] Sesi berhasil dihapus")

        } else if (value === "player") {
            if (!ww[chat]) return m.reply("⚠️ Tidak ada sesi permainan")
            if (!playerOnRoom(sender, chat, ww)) return m.reply("⚠️ Kamu tidak join")
            if (!ww[chat].player.length) return m.reply("⚠️ Belum ada player")
            let text = "\n*⌂ W E R E W O L F - G A M E*\n\nLIST PLAYER:\n"
            let player = []
            for (let p of ww[chat].player) {
                text += `(${p.number}) @${p.id.replace("@s.whatsapp.net", "")} ${p.isdead ? `☠️ ${p.role}` : ""}\n`
                player.push(p.id)
            }
            return await sius.sendMessage(m.chat, {
                text: text.trim(),
                contextInfo: {
                externalAdReply: {
                    title: 'W E R E - W O L F',
                    sourceUrl: '',
                    thumbnail: await resize(thumb, 300, 175),
                    renderLargerThumbnail: false,
                    mediaType: 1,
                    previewType: "PHOTO"
                }
                }
            }, { quoted: m })

        } else {
            let text = `\n*⌂ W E R E W O L F - G A M E*\n\nPermainan sosial berbasis role. Cari penjahat, main bareng!\n\n*⌂ C O M M A N D*\n`
            text += `▢ ${m.prefix + m.command} create\n`
            text += `▢ ${m.prefix + m.command} join\n`
            text += `▢ ${m.prefix + m.command} start\n`
            text += `▢ ${m.prefix + m.command} vote <nomor>\n`
            text += `▢ ${m.prefix + m.command} exit\n`
            text += `▢ ${m.prefix + m.command} delete\n`
            text += `▢ ${m.prefix + m.command} player\n`
            text += `\nBisa dimainkan oleh 5-15 orang.`.trim()
            return await sius.sendMessage(m.chat, {
                text: text.trim(),
                contextInfo: {
                externalAdReply: {
                    title: 'W E R E - W O L F',
                    sourceUrl: '',
                    thumbnail: await resize(thumb, 300, 175),
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    previewType: "PHOTO"
                }
                }
            }, { quoted: m })
        }
    }
})