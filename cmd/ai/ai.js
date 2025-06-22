commands.add({
    name: ["deepseek"],
    command: ["deepseek"],
    category: "ai",
    limit: true,
    desc: "akses Deepseek AI",
    query: true,
    example: "Halo",
    usage: "<prompt>",
    run: async({ sius, m, text, Func }) => {
        const p = "You are an assistant that always responds in Indonesian with a friendly and informal tone"
        const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/deepseek?prompt=${p}&message=${encodeURIComponent(text)}`)
        m.reply(res.data)
    }
})

commands.add({
    name: ["gemma"],
    command: ["gemma"],
    category: "ai",
    limit: true,
    desc: "akses Gemma AI",
    query: true,
    example: "Halo",
    usage: "<prompt>",
    run: async({ sius, m, text, Func }) => {
        const p = "You are an assistant that always responds in Indonesian with a friendly and informal tone"
        const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/gemma?prompt=${p}&message=${encodeURIComponent(text)}`)
        m.reply(res.data)
    }
})

commands.add({
    name: ["gpt3"],
    command: ["gpt3"],
    category: "ai",
    limit: true,
    desc: "akses GPT-3 AI",
    query: true,
    example: "Halo",
    usage: "<prompt>",
    run: async({ sius, m, text, Func }) => {
        const p = "Kamu adalah Asisten yang bersedia menjawab pertanyaan seserius dan seakurat yang kamu bisa"
        const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${p}&content=${encodeURIComponent(text)}`)
        m.reply(res.data)
    }
})