import { 
    GoogleGenerativeAI 
} from "@google/generative-ai"

export default {
    name: "auto_ai",
    exec: async({ sius, m, msg, pesan }) => {
        const isQuoted = m.quoted && m.quoted.fromMe
        // back then, i thought that i was dreaming
        const isTagged = (msg.message.conversation?.toLowerCase().includes(`@${sius.user.id.split(":")[0]}`) || msg.message.extendedTextMessage?.text.toLowerCase().includes(`@${sius.user.id.split(":")[0]}`))
        // the start of nothin, ooo i could hate you now
        if (m.isCommand) return false
        //if (!db.users[m.sender]?.autodl) return false
        const x = pesan
        //if (m.isGroup && (!isQuoted || !isTagged)) return false
        //if (!m.isGroup && !x) return false
        if ((!m.isGroup && db.users[m.sender]?.autodl)  || (m.isGroup && (isQuoted || isTagged) && db.users[m.sender]?.autodl)) {
        const genAI = new GoogleGenerativeAI("AIzaSyC1kPq2Ntf5vK7_77RuXkstTPYCdvz4y4g");
        let rash = db.game.chat_ai
        if (!rash[m.sender]) {
            rash[m.sender] = [];
        } // i ain't a kid no more:(
        if (rash[m.sender].length > 20) {
            rash[m.sender].shift();
        } // we'll never be those kids again
        rash[m.sender].push({ role: "user", content: x });
        const historyText = rash[m.sender].map(mg => `${mg.role}: ${mg.content}`).join("\n");
        const prompt = config.prompt
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: prompt,
        }); //ivory's illegal 
        const fullPrompt = `${prompt}\n\nprevious conversation:\n${historyText}\n\nuser: ${x}`;
        const siuss = await model.generateContent(fullPrompt);
        const g = siuss.response.text();
        const aturbg = { role: "assistant", content: g }
        rash[m.sender].push(aturbg);
        await m.reply(g);
        return true // inhale, inhell there's heaven
        }
        return false
    }
}