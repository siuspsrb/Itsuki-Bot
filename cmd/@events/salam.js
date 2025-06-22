export default {
    name: "salam",
    exec: async ({ sius, m, Func }) => {
        if (m.key.fromMe || !m.text) return false;
        const text = typeof m.text === "string" ? m.text.toLowerCase() : ""
        const salamRegex = /^a(s|ss)alamu["']?alaikum(?: ?(wr)?(?: ?(wb)?)?)?$/
        if (salamRegex.test(text)) {
            const responses = [
                "wa'alaikumusalam",
                "wa'alaikumusalam wr wb",
                "wa'alaikumusalam warohmatullahi wabarokatuh"
            ]
            m.reply(Func.pickRandom(responses))
            return true;
        }
        return false;
    }
}