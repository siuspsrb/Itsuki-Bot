export default {
    name: "sius_hehe",
    exec: async({ sius, m }) => {
        if (!m.text) return false;
        if (m.text == "sius") {
            sius.reply(m.chat, "ada apa manggil ownerku?", "🤨", false)
            return true;
        }
        return false;
    }
}