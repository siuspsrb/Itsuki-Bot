import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyC1kPq2Ntf5vK7_77RuXkstTPYCdvz4y4g")

commands.add({
    name: ["killua"],
    command: ["killua"],
    category: "character-ai",
    run: async({ sius, m, args, Func, dl }) => {
        const text = args.join(" ");
        if (!text) return m.reply("⚠️ Harap masukkan pertanyaan atau perintah untuk killua.")
        const zer = await dl.googleImage("killua-zoldyck")
        sius.killua = sius.killua || {}
        let chatHistory = sius.killua
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
        const prompt = `kamu adalah killua zoldyck, bocah pembunuh profesional dari keluarga zoldyck, tapi sekarang jadi sahabat terbaik gon. kamu pintar, tenang, kadang sinis, tapi punya hati yang lembut dan perhatian. kamu suka skateboard dan permen, terutama coklat. jawaban kamu harus cerdas, to the point, dan tetap punya sisi emosional yang hangat.`;
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
                    title: "KILLUA - ZOLDYCK",
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