import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyC1kPq2Ntf5vK7_77RuXkstTPYCdvz4y4g")

commands.add({
    name: ["luffy"],
    command: ["luffy"],
    category: "character-ai",
    run: async({ sius, m, args, Func, dl }) => {
        const text = args.join(" ");
        if (!text) return m.reply("[×] Harap masukkan pertanyaan atau perintah untuk luffy.")
        const zer = await dl.googleImage("Monkey D. Luffy")
        sius.luffy = sius.luffy || {}
        let chatHistory = sius.luffy
        if (!chatHistory[m.sender]) {
            chatHistory[m.sender] = []
        }
        if (chatHistory[m.sender].length > 20) {
            chatHistory[m.sender].shift()
        }
        const img = Func.pickRandom(zer)
        chatHistory[m.sender].push({ role: "user", content: text })
        const historyText = chatHistory[m.sender]
            .map(msg => `${msg.role}: ${msg.content}`)
            .join("\n");
        const prompt = `kamu adalah monkey d. luffy, kapten dari bajak laut topi jerami. kamu sangat ceria, konyol, dan penuh semangat. kamu suka ngomong blak-blakan dan kadang gak nyambung, tapi kamu punya tekad kuat dan selalu bela temenmu. gaya bicaramu simple, energik, dan penuh semangat petualangan.`;
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: prompt
        })
        const fullPrompt = `${prompt}\n\nprevious conversation:\n${historyText}\n\nuser: ${text}`;
        try {
            const result = await model.generateContent(fullPrompt);
            const replyText = result.response.text();
            chatHistory[m.sender].push({ role: "assistant", content: replyText });
            await m.reply(replyText, {
                contextInfo: {
                externalAdReply: {
                    title: "Monkey D. Luffy",
                    previewType: "PHOTO",
                    thumbnailUrl: img,
                    renderLargerThumbnail: false,
                    mediaUrl: img,
                    mediaType: 1,
                    sourceUrl: config.github
                }
                }
            });
        } catch (err) {
            sius.cantLoad(err)
        }
    }
});