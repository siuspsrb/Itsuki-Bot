import moment from "moment-timezone"

commands.add({
    name: ["soulmatch"],
    command: ["soulmatch"],
    category: "fun",
    desc: "penganalisis kecocokan jiwa",
    usage: "<nama1|nama2>",
    example: "sius|ariana",
    group: true,
    query: true,
    run: async ({ sius, m, text, Func }) => {
        const [n1, n2] = text.split("|").map(v => v.trim())
        if (!n2) return m.reply("⚠️ format salah! pisahkan nama pakai tanda `|`")

        const elements = ["Api 🔥", "Air 💧", "Tanah 🌍", "Angin 🌪️", "Petir ⚡", "Es ❄️", "Cahaya ✨", "Bayangan 🌑"]
        const signs = [
            "♈ Aries", "♉ Taurus", "♊ Gemini", "♋ Cancer", "♌ Leo", "♍ Virgo", 
            "♎ Libra", "♏ Scorpio", "♓ Pisces", "♐ Sagittarius", "♑ Capricorn", "♒ Aquarius"
        ]
        const soulTypes = [
            "Pemimpin Berani", "Penjaga Harmoni", "Kreator Penuh Imajinasi", 
            "Pendengar Setia", "Pencari Makna", "Penyendiri Bijaksana", 
            "Pemberontak Halus", "Penyatu Energi", "Penjelajah Batin"
        ]

        const generateSoul = (avoidElem) => {
            let el
            do el = Func.pickRandom(elements)
            while (el === avoidElem)
            return {
                type: Func.pickRandom(soulTypes),
                element: el,
                zodiac: Func.pickRandom(signs)
            }
        }

        const soul1 = generateSoul(null)
        const soul2 = generateSoul(soul1.element)
        const score = Math.floor(Math.random() * 100) + 1

        const status = score >= 90 ? "💫 takdir sejati"
            : score >= 80 ? "✨ harmoni sempurna"
            : score >= 70 ? "🌟 koneksi kuat"
            : score >= 60 ? "⭐ butuh waktu"
            : score >= 50 ? "🌙 perjuangan terasa"
            : "🌑 energi saling menantang"

        const reading = {
            90: [
                "jiwa kalian terpaut kuat.",
                "pertemuan ini seperti ditulis oleh semesta.",
                "tanpa banyak kata, kalian bisa merasa."
            ],
            80: [
                "ada aliran lembut yang menyatukan.",
                "kalian saling melengkapi dalam diam.",
                "setiap pertemuan terasa bermakna."
            ],
            70: [
                "terasa nyaman, meski berbeda.",
                "dari perbedaan itu tumbuh kedekatan.",
                "bisa jadi perjalanan yang indah."
            ],
            60: [
                "dibutuhkan pemahaman dan kesabaran.",
                "masih ada celah untuk saling belajar.",
                "energinya belum sepenuhnya sinkron."
            ],
            50: [
                "jalan ini tak mudah, tapi bukan mustahil.",
                "komunikasi akan jadi kunci utama.",
                "perlu lebih banyak ruang untuk memahami."
            ],
            0: [
                "jiwa kalian mungkin berjalan arah berbeda.",
                "tapi di sana pun ada pelajaran penting.",
                "tidak semua yang sulit berarti salah."
            ]
        }

        const pickReading = () => {
            if (score >= 90) return reading[90]
            if (score >= 80) return reading[80]
            if (score >= 70) return reading[70]
            if (score >= 60) return reading[60]
            if (score >= 50) return reading[50]
            return reading[0]
        }

        const date = moment().tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm")

        const caption = `
⟡ *SOUL MATCH ANALYSIS* ⟡

👤 *${n1}*
 ├ 🔮 Type: ${soul1.type}
 ├ 🌟 Element: ${soul1.element}
 ├ 🫧 Zodiac: ${soul1.zodiac}
 └ 

👤 *${n2}*
 ├ 🔮 Type: ${soul2.type}
 ├ 🌟 Element: ${soul2.element}
 ├ 🫧 Zodiac: ${soul2.zodiac}
 └ 

⟡ *Compatibility: ${score}%*
⟡ *Status:* ${status}

*🜂 Reading:*
- ${pickReading().join("\n- ")}

_📅 ${date} WIB_
        `.trim()
        m.reply(caption)
    }
})