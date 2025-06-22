import axios from "axios";

commands.add({
    name: ["gpt4","ai"],
    command: ["gpt4","ai"],
    category: "ai",
    limit: 5,
    usage: "<prompt>",
    cooldown: 15,
    query: true,
    run: async({ sius, m, text, Func }) => {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || "";
        let input, imageBuffer;
        if (/image/.test(mime)) {
            input = text
            imageBuffer = await q.download();
        } else {
            input = text
        }
        const response = await pollai(input, {
            model: "gpt-4.1-mini",
            imageBuffer
        });
        await m.reply(response)
    }
})

// Pollinations AI handler
async function pollai(question, { systemMessage = null, model = "gpt-4.1-mini", imageBuffer = null } = {}) {
    const modelList = {
        "gpt-4.1": "openai-large",
        "gpt-4.1-mini": "openai",
        "gpt-4.1-nano": "openai-fast"
    };
    if (!question) throw new Error("Pertanyaan tidak boleh kosong");
    if (!modelList[model]) throw new Error(`Model tersedia: ${Object.keys(modelList).join(", ")}`);
    const messages = [
        ...(systemMessage ? [{ role: "system", content: systemMessage }] : []),
        {
            role: "user",
            content: [
                { type: "text", text: question },
                ...(imageBuffer
                    ? [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBuffer.toString("base64")}`
                            }
                        }
                    ]
                    : [])
            ]
        }
    ];
    const { data } = await axios.post(
        "https://text.pollinations.ai/openai",
        {
            messages,
            model: modelList[model],
            temperature: 0.5,
            presence_penalty: 0,
            top_p: 1,
            frequency_penalty: 0
        },
        {
            headers: {
                accept: "*/*",
                authorization: "Bearer dummy",
                "content-type": "application/json",
                origin: "https://sur.pollinations.ai",
                referer: "https://sur.pollinations.ai/",
                "user-agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
            }
        }
    );
    return data.choices[0].message.content;
}