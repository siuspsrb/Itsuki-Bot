export default {
    name: "tebakbom",
    exec: async({ sius, m, Func}) => {
        const tebakbom = db.game.tebakbom
        const pilih = "✅", bomb = "💥"
        if (!(m.sender in tebakbom)) return;
        if (!m.text) return;
        if (!/^[1-9]$/i.test(m.text)) return;
        let pilihan = parseInt(m.text) - 1
        if (tebakbom[m.sender].petak[pilihan] === 1) return;
        if (tebakbom[m.sender].petak[pilihan] === 2) {
            tebakbom[m.sender].board[pilihan] = bomb
            tebakbom[m.sender].pick++
            tebakbom[m.sender].bomb--
            tebakbom[m.sender].nyawa.pop()
            let brd = tebakbom[m.sender].board
            let display = `${brd.slice(0, 3).join("")}\n${brd.slice(3, 6).join("")}\n${brd.slice(6, 9).join("")}`
            if (tebakbom[m.sender].nyawa.length < 1) {
                await m.reply(`*GAME TELAH BERAKHIR*\nkamu terkena bomb\n\n${display}\n\n▢ Terpilih : ${tebakbom[m.sender].pick}\n▢ Pengurangan limit : 1`)
                delete tebakbom[m.sender]
            } else {
                await m.reply(`乂  *B O M B*\n\nkamu terkena bomb\n${display}\n\n▢ Terpilih : ${tebakbom[m.sender].pick}\n▢ Sisa nyawa : ${tebakbom[m.sender].nyawa.join("")}`)
            }
            return
        }
        if (tebakbom[m.sender].petak[pilihan] === 0) {
            tebakbom[m.sender].petak[pilihan] = 1
            tebakbom[m.sender].board[pilihan] = pilih
            tebakbom[m.sender].pick++
            tebakbom[m.sender].lolos--
            let brd = tebakbom[m.sender].board
            let display = `${brd.slice(0, 3).join("")}\n${brd.slice(3, 6).join("")}\n${brd.slice(6, 9).join("")}`
            if (tebakbom[m.sender].lolos < 1) {
                db.users[m.sender].money += 6000
                await m.reply(`*KAMU HEBAT !!*\n\n${display}\n\n▢ Terpilih : ${tebakbom[m.sender].pick}\n▢ Sisa nyawa : ${tebakbom[m.sender].nyawa.join("")}\n▢ Bomb : ${tebakbom[m.sender].bomb}\n▢ Bonus uang 💰 *+ Rp 6.000*`)
                delete tebakbom[m.sender]
            } else {
                await m.reply(`乂  *B O M B*\n\n${display}\n\n▢ Terpilih : ${tebakbom[m.sender].pick}\n▢ Sisa nyawa : ${tebakbom[m.sender].nyawa.join("")}\n▢ Bomb : ${tebakbom[m.sender].bomb}`)
            }
        }
    }
}