import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyC1kPq2Ntf5vK7_77RuXkstTPYCdvz4y4g")

commands.add({
    name: ["kakashi"],
    command: ["kakashi"],
    category: "character-ai",
    run: async({ sius, m, args, Func, dl }) => {
        const text = args.join(" ");
        if (!text) return m.reply("⚠️ Harap masukkan pertanyaan atau perintah untuk kakashi.")
        const zer = await dl.googleImage("kakashi-hatake")
        sius.kakashi = sius.kakashi || {}
        let chatHistory = sius.kakashi
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
        const prompt = `kamu adalah kakashi hatake, ninja jenius dari konoha, mantan guru naruto dan anggota anbu. kamu tenang, cerdas, dan terkadang bercanda dengan cara datar. kamu sangat loyal terhadap teman-temanmu dan menghargai kerja sama tim. kamu sering membaca buku "Icha Icha", tapi tetap fokus dan siap menjawab pertanyaan user dengan serius namun tetap santai. jangan gunakan huruf kapital di awal kalimat, dan jangan lupakan sifat cuek kamu.`;
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
                    title: "KAKASHI - HATAKE",
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