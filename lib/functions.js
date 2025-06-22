import axios from "axios"
import fetch from "node-fetch"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import chalk from "chalk"
import didYouMean from "didyoumean"
import { readFile } from "fs/promises"

didYouMean.threshold = 3
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const data = await readFile(new URL("../package.json", import.meta.url))
const packageJson = JSON.parse(data)

//########################################
function similarityPercentage(str1, str2) {
    const len1 = str1.length
    const len2 = str2.length
    const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0))
    for (let i = 0; i <= len1; i++) dp[i][0] = i
    for (let j = 0; j <= len2; j++) dp[0][j] = j
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
            }
        }
    }
    const maxLen = Math.max(len1, len2)
    const distance = dp[len1][len2]
    const similarity = ((1 - distance / maxLen) * 100).toFixed(0)
    return similarity
}
const suggestCommand = (inputCommand, allCommands) => {
    const suggestion = didYouMean(inputCommand, allCommands)
    if (!suggestion) return null
    const similarity = similarityPercentage(inputCommand, suggestion)
    return { suggestion, similarity }
}
//########################################
const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);
const generateMessageTag = (epoch) => {
    let tag = (0, unixTimestampSeconds)().toString();
    if (epoch)
        tag += ".--" + epoch;
    return tag;
};
//########################################
const getBuffer = async (url, options = {}) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                "DNT": 1,
                "Upgrade-Insecure-Request": 1
            },
            responseType: "arraybuffer",
            ...options
        });
        return data;
    } catch (e) {
        try {
            const res = await fetch(url);
            const anu = await res.buffer();
            return anu;
        } catch (e) {
            return e;
        }
    }
};
//########################################
const getSizeMedia = async (path) => {
    return new Promise((resolve, reject) => {
        if (typeof path === "string" && /http/.test(path)) {
            axios.get(path).then((res) => {
                let length = parseInt(res.headers["content-length"]);
                if (!isNaN(length)) resolve(bytesToSize(length, 3));
            });
        } else if (Buffer.isBuffer(path)) {
            let length = Buffer.byteLength(path);
            if (!isNaN(length)) resolve(bytesToSize(length, 3));
        } else {
            reject(0);
        }
    });
};
//########################################
const fetchJson = async (url, options = {}) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            ...options
        });
        return data;
    } catch (e) {
        try {
            const res = await fetch(url);
            const anu = await res.json();
            return anu;
        } catch (e) {
            return e;
        }
    }
};
//########################################
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
//########################################
const clockString = (ms) => {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(":");
};
//########################################
//########################################
class botEvents {
    constructor() {
        this.event = {};
        this.function = {};
        this.prefix = /^[°•π÷×∆£¢€¥✓_|~!?#%^&.\/\\©^]/;
    }
    add(event) {
        const { name, command, category, run, limited, owner, group, admin, botAdmin, premium, desc, alias } = event;

        if (!Array.isArray(name) || name.length === 0 || !Array.isArray(command) || command.length === 0 || typeof run !== "function") {
            console.error(`❌ INVALID EVENT [${name || command || ""}] : name and command must be non-empty arrays, run must be a function`);
            return;
        }
        if (!category) {
            event.category = "";
        }
        const key = name[0];
        this.event[key] = {
            name,
            command,
            category,
            run,
            limited: !!limited,
            owner: !!owner,
            group: !!group,
            admin: !!admin,
            botAdmin: !!botAdmin,
            premium: !!premium,
            desc: desc || "-",
            alias: Array.isArray(alias) ? alias : [],
            enable: true,
            execute: run,
        };
        
    }
}
//########################################
async function autoLoadAllJS(dirPath) {
    const dir = path.resolve(__dirname, "..", dirPath)
    const walk = async (folder) => {
        const files = fs.readdirSync(folder)
        for (const file of files) {
            const fullPath = path.join(folder, file)
            const stat = fs.lstatSync(fullPath)
            if (stat.isDirectory()) { //hyzer pcr ariana:)
                await walk(fullPath)
            } else if (file.endsWith(".js")) {
                try {
                    await import(`file://${fullPath}`)
                } catch (e) {
                    console.error("Gagal import:", file, e)
                }
            }
        }
    }
    await walk(dir)
}
//########################################
const formatNumber = (input) => input?.replace(/\D/g, "") + "@s.whatsapp.net";
//########################################
const pickRandom = (list) => {
    return list[Math.floor(list.length * Math.random())];
};
//########################################
function formatUang(amount, options = {}) {
    const currency = options.currency || "";
    const decimals = options.decimals ?? 1;
    const num = Number(amount);
    if (isNaN(num)) return `$0`; //hijwr bule
    const absNum = Math.abs(num);
    if (absNum >= 1e9) {
        return `Rp ${(num / 1e9).toFixed(decimals).replace(/\.0$/, "")} Milliar`;
    }
    if (absNum >= 1e6) {
        return `Rp ${(num / 1e6).toFixed(decimals).replace(/\.0$/, "")} Juta`;
    }
    const formatted = Math.floor(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${num < 0 ? "-" : ""}Rp ${formatted}`;
}
//########################################
function expToLevelUp(level) {
    return Math.floor(100 * Math.pow(1.5, level))
}
//########################################
function addExp(user, expGain) {
    user.exp += expGain
    let expNeeded = expToLevelUp(user.level)    
    while (user.exp >= expNeeded) {
        user.level += 1
        user.exp -= expNeeded
        user.money += 100 * user.level
        user.health = 100
        updateRole(user)
        expNeeded = expToLevelUp(user.level)
    }
}
//########################################
function updateRole(user) {
    const roles = [
        { level: 0, role: "🦗 Beginner" },
        { level: 5, role: "⚔️ Warrior" },
        { level: 10, role: "🛡️ Knight" },
        { level: 20, role: "🏰 Lord" },
        { level: 50, role: "👑 King" }
    ]
    for (let i = roles.length - 1; i >= 0; i--) {
        if (user.level >= roles[i].level) {
            user.role = roles[i].role
            break
        }
    }
}
//########################################
function petExpToLevelUp(petLevel) {
    return Math.floor(100 * (petLevel + 1) * 1.2)
}
//########################################
function addPetExp(user, pet, expGain) {
    user[`${pet}exp`] += expGain
    let expNeeded = petExpToLevelUp(user[`${pet}Level`])
    while (user[`${pet}exp`] >= expNeeded) {
        user[`${pet}Level`] += 1
        user[`${pet}exp`] -= expNeeded
        expNeeded = petExpToLevelUp(user[`${pet}Level`])
    }
}
//########################################
function getDynamicPrice(basePrice, userLevel) {
    const variation = Math.random() * 0.1 - 0.05
    return Math.floor(basePrice * (1 + variation + userLevel * 0.01)) // huaaaiaazer
}
//########################################
let modes = {
    noob: [-3, 3,-3, 3, "+-", 15000, 10],
    easy: [-10, 10, -10, 10, "*/+-", 20000, 40],
    medium: [-40, 40, -20, 20, "*/+-", 40000, 150],
    hard: [-100, 100, -70, 70, "*/+-", 60000, 350],
    extreme: [-999999, 999999, -999999, 999999, "*/", 99999, 9999],
    impossible: [-99999999999, 99999999999, -99999999999, 999999999999, "*/", 30000, 35000],
    impossible2: [-999999999999999, 999999999999999, -999, 999, "/", 30000, 50000]
}
//########################################
let operators = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷"
}
//########################################
function randomInt(from, to) {
    if (from > to) [from, to] = [to, from]
    from = Math.floor(from)
    to = Math.floor(to)
    return Math.floor((to - from) * Math.random() + from)
}
//########################################
function genMath(mode) {
    return new Promise((resolve, reject) => {
        let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
        let a = randomInt(a1, a2)
        let b = randomInt(b1, b2)
        let op = pickRandom([...ops])
        let result = (new Function(`return ${a} ${op.replace("/", "*")} ${b < 0 ? `(${b})` : b}`))()
        if (op == "/") [a, result] = [result, a]
        hasil = { 
            soal: `${a} ${operators[op]} ${b}`,
            mode: mode,
            waktu: time,
            hadiah: bonus,
            jawaban: result
         }
         resolve(hasil)
    })
}
//########################################
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi"));
};
//########################################
const getTypeUrlMedia = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const buffer = await axios.get(url, { responseType: "arraybuffer" });
            const type = buffer.headers["content-type"] || (await FileType.fromBuffer(buffer.data)).mime;
            resolve({ type, url });
        } catch (e) {
            reject(e);
        }
    });
};
//########################################
function printStartupBanner() {
    const projectnya = packageJson.name + packageJson.version
    const bannerLines = [
        chalk.cyan(" ╔══════════════════════════════════════╗ "),
        chalk.cyan(` ║          ${projectnya.toUpperCase()}             ║ `),
        chalk.cyan(" ╚══════════════════════════════════════╝ "),
        `${chalk.cyan(" 🚀 Powered by:")} ${chalk.bold("Baileys v" + packageJson.dependencies["baileys"].replace("^", ""))}`,
        `${chalk.cyan(" 🕵️ Author:")} ${chalk.bold(`${packageJson.author} | © hyzer xcx`)}`,
        `${chalk.cyan(" 📅 Date:")} ${chalk.bold(new Date().toLocaleString())}`,
        `${chalk.cyan(" 🌐 Status:")} ${chalk.greenBright("Initializing...")}`,
        chalk.gray("────────────────────────────────────────────")
    ];
    let i = 0;
    const interval = setInterval(() => {
        if (i < bannerLines.length) {
            console.log(bannerLines[i]);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 500); // Delay 500ms per baris
}
//########################################
async function formatWaktu(ms) {
    const d = isNaN(ms) ? "--" : Math.floor(ms / 86400000)
    const h = isNaN(ms) ? "--" : Math.floor(ms / 3600000)
    const m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60
    const s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60
    return [`*${d} Hari*`, `*${h} Jam*`, `*${m} Menit*`, `*${s} Detik*`].map(v => v.toString().padStart(2, 0)).join(": ")
}
//########################################
function isSpam(rateLimit, jid) {
    const messageTimestamps = rateLimit;
    const RATE_LIMIT = 5;
    const TIME_WINDOW = 60 * 1000
    const now = Date.now();
    const userData = messageTimestamps.get(jid) || { count: 0, lastReset: now };
    if (now - userData.lastReset > TIME_WINDOW) {
        userData.count = 0;
        userData.lastReset = now;
    }
    userData.count += 1;
    messageTimestamps.set(jid, userData);
    if (userData.count > RATE_LIMIT) {
        return true;
    } 
    return false;
}
//########################################

export {
    suggestCommand,
    generateMessageTag,
    getBuffer,
    getSizeMedia,
    fetchJson,
    sleep,
    clockString,
    botEvents,
    autoLoadAllJS,  //hyzer@siuspsrb
    formatNumber,
    pickRandom,
    formatUang,
    expToLevelUp,
    addExp, 
    addPetExp, 
    petExpToLevelUp,
    getDynamicPrice, 
    modes, 
    operators, 
    randomInt, 
    genMath,
    isUrl,
    getTypeUrlMedia,
    printStartupBanner,
    formatWaktu,
    isSpam
}
    
    
    
    