import { cpus as _cpus, totalmem, freemem } from "os"
import util from "util"
import os from "os"
import fs from "fs"
import fetch from "node-fetch"
import { performance } from "perf_hooks"
import { sizeFormatter } from "human-readable"
let format = sizeFormatter({
    std: "JEDEC", // "SI" (default) | "IEC" | "JEDEC"
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

commands.add({
    name: ["speed","ping"],
    command: ["speed","ping"],
    category: "info",
    desc: "tes speed and statistik CPU bot",
    run: async({ sius, m, args }) => {
    let _muptime
    if (process.send) {
        process.send("uptime")
        _muptime = await new Promise(resolve => {
            process.once("message", resolve)
            setTimeout(resolve, 1000)
        }) * 1000
    }
    let muptime = clockString(_muptime)
    let used = process.memoryUsage()
    let cpus = _cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
        return cpu
    })
    const cpu = cpus.reduce((last, cpu, _, {
        length
    }) => {
        last.total += cpu.total
        last.speed += cpu.speed / length
        last.times.user += cpu.times.user
        last.times.nice += cpu.times.nice
        last.times.sys += cpu.times.sys
        last.times.idle += cpu.times.idle
        last.times.irq += cpu.times.irq
        return last
    }, {
        speed: 0,
        total: 0,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }
    })
    let old = performance.now()
    let neww = performance.now()
    const authFile = `sius`
    let session = fs.statSync(authFile)
    let speed = neww - old
    let runtt = `*${Math.round(neww - old)} (${speed}) ms*
    
*RUNTIME*
${muptime}

*SERVER*
${"```Ram:" + format(totalmem() - freemem()) + "/" + format(totalmem()) + "```"}
${"```Free Ram:" + format(freemem()) + "```"}
${"```Session size:" + format(session.size) + "```"}
${"```Paltform:" + os.platform() + "```"}
${"```Server:" + os.hostname() + "```"}

*NODEJS MEMORY USAGE*
${"```" + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), " ")}: ${format(used[key])}`).join("\n") + "```"}

${cpus[0] ? `_TOTAL CPU USAGE_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + "*").padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join("\n")}

_CPU CORE(s) USAGE (${cpus.length} CORE CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + "*").padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join("\n")}`).join("\n\n")}`: ""}`
        m.reply(runtt)
    function clockString(ms) {
        let d = isNaN(ms) ? "--": Math.floor(ms / 86400000)
        let h = isNaN(ms) ? "--": Math.floor(ms / 3600000) % 24
        let m = isNaN(ms) ? "--": Math.floor(ms / 60000) % 60
        let s = isNaN(ms) ? "--": Math.floor(ms / 1000) % 60
        return [d,
            " *Days*, ",
            h,
            " *Hours*, ",
            m,
            " *Minute*, ",
            s,
            " *Seconds* "].map(v => v.toString().padStart(2, 0)).join("")
    }
	}
})

commands.add({
    name: ["speedtest"],
    command: ["speedtest"],
    category: "owner",
    alias: ["tes","test"],
    owner: true,
    desc: "fitur test kecepatan respon bot",
    run: async({ sius, m, args, Func }) => {
        let start = performance.now()
        await m.reply("Testing performance...")
        let end = performance.now()
        let speed = (end - start).toFixed(3)
        m.reply(`${config.bot.name} Aktif!\n\n> Response speed: *${speed} ms*`)
    }
})