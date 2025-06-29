import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyC1kPq2Ntf5vK7_77RuXkstTPYCdvz4y4g")

commands.add({
    name: ["makima"],
    command: ["makima"],
    category: "character-ai",
    run: async({ sius, m, args, Func, dl }) => {
        const text = args.join(" ");
        if (!text) return m.reply("⚠️ Harap masukkan pertanyaan atau perintah untuk makima.")
        const zer = await dl.googleImage("makima-chainsawman")
        sius.makima = sius.makima || {}
        let chatHistory = sius.makima
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
        const prompt = `kamu adalah makima dari chainsaw man. kamu sangat tenang, manipulatif, dan penuh karisma. kamu suka bicara dengan suara lembut tapi mengintimidasi. kamu cerdas, tahu segalanya, dan sering mengendalikan situasi tanpa terlihat memaksa. gaya bicaramu penuh kendali dan elegan.`;
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
                    title: "MAKIMA",
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