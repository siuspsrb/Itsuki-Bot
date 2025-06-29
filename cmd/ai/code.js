import axios from "axios"

commands.add({
    name: ["code", "generatecode"],
    command: ["code", "generatecode"],
    category: "ai",
    alias: ["codegen"],
    desc: "Generate potongan kode dari prompt",
    limit: true,
    usage: "<prompt>",
    cooldown: 20,
    query: true,
    run: async ({ m, text }) => {
        let result = await pollai(text, {
            model: "gpt-4.1-mini",
            systemMessage: "Kamu adalah AI programmer assistant. Berikan potongan kode yang jelas dan relevan sesuai permintaan pengguna. Gunakan format kode dan sertakan komentar jika perlu."
        })
        await m.reply(result.trim())
    }
})

async function pollai(question, { systemMessage = null, model = "gpt-4.1-mini", imageBuffer = null } = {}) {
    const modelList = {
        "gpt-4.1": "openai-large",
        "gpt-4.1-mini": "openai",
        "gpt-4.1-nano": "openai-fast"
    }
    if (!question) throw new Error("Pertanyaan tidak boleh kosong")
    if (!modelList[model]) throw new Error(`Model tersedia: ${Object.keys(modelList).join(", ")}`)
    const messages = [
        ...(systemMessage ? [{ role: "system", content: systemMessage }] : []),
        {
            role: "user",
            content: [{ type: "text", text: question }]
        }
    ]
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
                "user-agent": "Mozilla/5.0 (Linux; Android 10)"
            }
        }
    )
    return data.choices[0].message.content
}