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

commands.add({
    name: ["werewolfpc"],
    command: ["werewolfpc", "wwpc"],
    category: "hidden",
    privatechat: true,
    run: async ({ sius, m, args }) => {
        let { sender, chat } = m
        sius.werewolf = sius.werewolf || {}
        let ww = sius.werewolf
        let value = (args[0] || "").toLowerCase()
        let target = args[1]

        if (!playerOnGame(sender, ww)) return m.reply("⚠️ Kamu tidak dalam sesi game")
        if (dataPlayer(sender, ww).status === true) return m.reply("⚠️ Skill sudah digunakan malam ini")
        if (dataPlayer(sender, ww).isdead === true) return m.reply("⚠️ Kamu sudah mati")
        if (!target || target.length < 1 || target.length > 2) return m.reply(`⚠️ Masukkan nomor player\nContoh:\n.wwpc kill 1`)
        if (isNaN(target)) return m.reply("⚠️ Gunakan hanya angka")

        let byId = getPlayerById2(sender, parseInt(target), ww)
        if (!byId || !byId.db) return m.reply("⚠️ Player tidak terdaftar")
        if (byId.db.isdead === true) return m.reply("⚠️ Player sudah mati")
        if (byId.db.id === sender) return m.reply("⚠️ Tidak bisa menggunakan skill untuk diri sendiri")

        let playerRole = dataPlayer(sender, ww).role

        if (/kill/i.test(value)) {
            if (!/werewolf|sorcerer/i.test(playerRole)) return m.reply("⚠️ Peran ini bukan untuk kamu")
            dataPlayer(sender, ww).status = true
            killWerewolf(sender, parseInt(target), ww)
            return m.reply("⚠️ Berhasil membunuh player " + parseInt(target))

        } else if (/dreamy/i.test(value)) {
            if (!/seer/i.test(playerRole)) return m.reply("⚠️ Peran ini bukan untuk kamu")
            let result = dreamySeer(sender, parseInt(target), ww)
            dataPlayer(sender, ww).status = true
            return m.reply(`⚠️ Berhasil membuka identitas player ${target} adalah ${result}`)

        } else if (/deff/i.test(value)) {
            if (!/guardian/i.test(playerRole)) return m.reply("⚠️ Peran ini bukan untuk kamu")
            protectGuardian(sender, parseInt(target), ww)
            dataPlayer(sender, ww).status = true
            return m.reply(`⚠️ Berhasil melindungi player ${target}`)

        } else if (/sorcerer/i.test(value)) {
            if (!/sorcerer/i.test(playerRole)) return m.reply("⚠️ Peran ini bukan untuk kamu")
            let result = sorcerer(sender, parseInt(target), ww)
            dataPlayer(sender, ww).status = true
            return m.reply(`⚠️ Berhasil membuka identitas player ${target} adalah ${result}`)
        }
    }
})