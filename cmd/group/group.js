import fs from "fs"
import chalk from "chalk"

const groupInviteCache = new Map()

const formatNumber = (input) => {
    const num = input?.replace(/\D/g, "")
    return num ? `${num}@s.whatsapp.net` : null
}

commands.add({
    name: ["group", "add", "kick", "promote", "demote", "resetlink", "linkgroup", "tagall", "hidetag", "totag", "delete"],
    command: ["group", "+member", "add", "-member", "kick", "+admin", "promote", "-admin", "demote", "resetlink", "linkgroup", "tagall", "hidetag", "totag", "delete"],
    alias: ["linkgc","linkgrup","h","del","d"],
    category: "group",
    desc: "Mengelola aksi grup seperti menambah/menghapus member, promosi/demosi admin, dan lainnya.",
    admin: true,
    group: true,
    botAdmin: true,
    run: async ({ sius, m, args }) => {
        const target = formatNumber(args.join(" ")) || m.quoted?.sender

        try {
            switch (m.command.toLowerCase()) {
                case "add":
                case "+member": {
                    if (!target) return m.reply(`*Contoh :* ${m.prefix + m.command} 627384747758`)
                    const results = await sius.groupParticipantsUpdate(m.chat, [target], "add")
                    const statusMessages = {
                        200: `Berhasil menambahkan @${target.split("@")[0]} ke grup!`,
                        401: "Dia Memblokir Bot!",
                        409: "Dia Sudah Join!",
                        500: "Grup Penuh!"
                    }

                    for (const result of results) {
                        if (statusMessages[result.status]) {
                            await m.reply(statusMessages[result.status])
                            continue
                        }
                        if (result.status === 408) {
                            const inviteCode = await getCachedInvite(sius, m.chat)
                            await m.reply(`@${target.split("@")[0]} Baru-Baru Saja Keluar Dari Grup Ini!\n\n + Karena Target Private\n\nUndangan Akan Dikirimkan Ke\n-> wa.me/${target.replace(/\D/g, "")}\n + Melalui Jalur Pribadi`)
                            await sendPrivateInvite(sius, target, inviteCode, m)
                        } else if (result.status === 403) {
                            const { code, expiration } = result.content.content[0].attrs
                            await sius.sendGroupInvite(
                                m.chat,
                                target,
                                code,
                                expiration,
                                m.metadata.subject,
                                `Admin: @${m.sender.split("@")[0]}\nMengundang anda ke group ini\nSilahkan masuk jika berkehendak🙇`,
                                null,
                                { mentions: [m.sender] }
                            )
                            await m.reply(`@${target.split("@")[0]} Tidak Dapat Ditambahkan\n\n + Karena Target Private\n\nUndangan Akan Dikirimkan Ke\n-> wa.me/${target.replace(/\D/g, "")}\n + Melalui Jalur Pribadi`)
                        } else {
                            await m.reply(`[×] Gagal Add User\nStatus : ${result.status}`)
                        }
                    }
                    break
                }

                case "kick":
                case "-member": {
                    if (!target) return m.reply(`Contoh: ${m.prefix + m.command} 623873621136`)
                    await sius.groupParticipantsUpdate(m.chat, [target], "remove")
                    break
                }

                case "promote":
                case "+admin": {
                    if (!target) return m.reply(`Contoh: ${m.prefix + m.command} 623873621136`)
                    await sius.groupParticipantsUpdate(m.chat, [target], "promote")
                    await m.reply("[√] Berhasil")
                    break
                }

                case "demote":
                case "-admin": {
                    if (!target) return m.reply(`Contoh: ${m.prefix + m.command} 623873621136`)
                    await sius.groupParticipantsUpdate(m.chat, [target], "demote")
                    await m.reply("[√] Berhasil")
                    break
                }

                case "group":
                case "grup": {
                    const setting = args[0]?.toLowerCase()
                    if (!["open", "close"].includes(setting)) {
                        return m.reply(`Contoh penggunaan:\n${m.prefix}group open\n${m.prefix}group close`)
                    }
                    await sius.groupSettingUpdate(m.chat, setting === "open" ? "not_announcement" : "announcement")
                    await m.reply(`Berhasil mengubah pengaturan grup menjadi *${setting === "open" ? "terbuka" : "tertutup"}*!`)
                    break
                }

                case "resetlink": {
                    await sius.groupRevokeInvite(m.chat)
                    groupInviteCache.delete(m.chat)
                    await m.reply("[√] Berhasil mereset link undangan grup.")
                    break
                }

                case "linkgroup":
                case "linkgrup":
                case "linkgc": {
                    const code = await getCachedInvite(sius, m.chat)
                    await m.reply(`https://chat.whatsapp.com/${code}`)
                    break
                }

                case "tagall": {
                    const message = args.join(" ") || "-"
                    let text = `*––––––『 TAG ALL 』––––––*\n\n`
                    text += m.metadata.participants
                        .map(p => `• @${p.id.split("@")[0]}`)
                        .join("\n")
                    text += `\n\n○ Pesan: ${message}`
                    await m.reply(text, {
                        mentions: m.metadata.participants.map(p => p.id)
                    })
                    break
                }

                case "hidetag":
                case "h": {
                    const message = args.join(" ") || ""
                    await m.reply(message, {
                        mentions: m.metadata.participants.map(p => p.id)
                    })
                    break
                }

                case "totag": {
                    if (!m.quoted) return m.reply(`[×] Reply pesan dengan caption *${m.prefix + m.command}*`)
                    delete m.quoted.chat
                    await sius.sendMessage(m.chat, {
                        forward: m.quoted.fakeObj,
                        mentions: m.metadata.participants.map(a => a.id)
                    })
                    break
                }

                case "delete":
                case "del":
                case "d": {
                    if (!m.quoted) return m.reply(`[×] Reply pesan dengan caption *${m.prefix + m.command}*`)
                    await sius.sendMessage(m.chat, {
                        delete: {
                            remoteJid: m.chat,
                            fromMe: m.isBotAdmin ? false : true,
                            id: m.quoted.id,
                            participant: m.quoted.sender
                        }
                    })
                    await m.reply({ react: { text: "✔️", key: m.key } })
                    break
                }

                default:
                await m.reply("Perintah tidak dikenali!")
            }
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})

async function getCachedInvite(sius, groupId) {
    if (groupInviteCache.has(groupId)) {
        return groupInviteCache.get(groupId)
    }
    const code = await sius.groupInviteCode(groupId)
    groupInviteCache.set(groupId, code)
    return code
}

async function sendPrivateInvite(sius, target, inviteCode, originalMsg) {
    try {
        await sius.sendMessage(target, {
            text: `https://chat.whatsapp.com/${inviteCode}\n + ------------------------------------------------------\n\n + Admin: @${originalMsg.sender.split("@")[0]}\n + Mengundang anda ke group ini\nSilahkan masuk jika berkehendak🙇`,
            detectLink: true
        })
    } catch (err) {
        await originalMsg.reply("Gagal Mengirim Undangan!")
    }
}