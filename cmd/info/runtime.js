commands.add({
    name: ["runtime", "uptime"],
    command: ["runtime", "uptime"],
    category: "info",
    desc: "Menampilkan waktu aktif bot",
    run: async ({ sius, m }) => {
    function clockString(ms) {
    let d = isNaN(ms) ? "--": Math.floor(ms / 86400000)
    let h = isNaN(ms) ? "--": Math.floor(ms / 3600000) % 24
    let m = isNaN(ms) ? "--": Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? "--": Math.floor(ms / 1000) % 60
    return [d, " Hari, ", h, " Jam, ", m, " Menit, ", s, " Detik"].map(v => v.toString().padStart(2, 0)).join("")
    }    
    let _muptime
    if (process.send) {
        process.send("uptime")
        _muptime = await new Promise(resolve => {
            process.once("message", resolve)
            setTimeout(resolve, 1000)
        }) * 1000
    }
    let muptime = clockString(_muptime)
    let result = `Bot telah aktif selama:\n*${muptime}*`;
    sius.reply(m.chat, result, "R U N T I M E - B O T", false).catch(() => m.reply("[×] Error"))
    }
})