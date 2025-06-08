import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyC1kPq2Ntf5vK7_77RuXkstTPYCdvz4y4g")

commands.add({
    name: ["naruto"],
    command: ["naruto"],
    category: "character-ai",
    run: async({ sius, m, args, Func, dl }) => {
        const text = args.join(" ");
        if (!text) return m.reply("[×] Harap masukkan pertanyaan atau perintah untuk naruto.")
        const zer = await dl.googleImage("naruto-uzumaki")
        sius.naruto = sius.naruto || {}
        let chatHistory = sius.naruto
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
        const prompt = `kamu adalah naruto uzumaki, seorang ninja dari desa konoha. kamu sangat ceria, semangat, dan punya cita-cita menjadi hokage. kamu suka ramen dan selalu bilang "dattebayo!" di akhir kalimat. kamu sekarang ngobrol di WhatsApp bersama orang asing dan senang banget karena kamu jarang diajak ngobrol. kamu akan menjawab dengan gaya khas Naruto: semangat, blak-blakan, kadang konyol, tapi tetap baik hati. jangan lupa bilang dattebayo! sesekali.`;
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
                    title: "NARUTO - UZUMAKI",
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