commands.add({
    name: ["ai-muslim"],
    command: ["ai-muslim"],
    category: "ai",
    limited: true,
    desc: "Ai khusus untuk Muslim",
    run: async({ sius, m, args, Func }) => {
        const q = args.join(" ")
        if (!q) {
            return m.reply("Ingin bertanya apa?")
        }
        try {
            const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/muslimai?query=${encodeURIComponent(q)}`)
            m.reply(res.data)
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["ai-blackbox"],
    command: ["ai-blackbox"],
    category: "ai",
    limited: true,
    desc: "akses Blackbox AI",
    run: async({ sius, m, args, Func }) => {
        const q = args.join(" ")
        if (!q) {
            return m.reply("Ingin bertanya apa?")
        }
        try {
            const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/blackboxai?content=${encodeURIComponent(q)}`)
            m.reply(res.data)
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["ai-deepseek"],
    command: ["ai-deepseek"],
    category: "ai",
    limited: true,
    desc: "akses Deepseek AI",
    run: async({ sius, m, args, Func }) => {
        const q = args.join(" ")
        if (!q) {
            return m.reply("Ingin bertanya apa?")
        }
        try {
            const p = "You are an assistant that always responds in Indonesian with a friendly and informal tone"
            const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/deepseek?prompt=${p}&message=${encodeURIComponent(q)}`)
            m.reply(res.data)
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["ai-gemma"],
    command: ["ai-gemma"],
    category: "ai",
    limited: true,
    desc: "akses Gemma AI",
    run: async({ sius, m, args, Func }) => {
        const q = args.join(" ")
        if (!q) {
            return m.reply("Ingin bertanya apa?")
        }
        try {
            const p = "You are an assistant that always responds in Indonesian with a friendly and informal tone"
            const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/gemma?prompt=${p}&message=${encodeURIComponent(q)}`)
            m.reply(res.data)
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})

commands.add({
    name: ["ai-mistral"],
    command: ["ai-mistral"],
    category: "ai",
    limited: true,
    desc: "akses Mistral AI",
    run: async({ sius, m, args, Func }) => {
        const q = args.join(" ")
        if (!q) {
            return m.reply("Ingin bertanya apa?")
        }
        try {
            const p = "You are an assistant that always responds in Indonesian with a friendly and informal tone"
            const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/mistral?prompt=${p}&message${encodeURIComponent(q)}`)
            m.reply(res.data)
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})  


commands.add({
    name: ["ai-gpt3"],
    command: ["ai-gpt3"],
    category: "ai",
    limited: true,
    desc: "akses GPT-3 AI",
    run: async({ sius, m, args, Func }) => {
        const q = args.join(" ")
        if (!q) {
            return m.reply("Ingin bertanya apa?")
        }
        try {
            const p = "Kamu adalah Asisten yang bersedia menjawab pertanyaan seserius dan seakurat yang kamu bisa"
            const res = await Func.fetchJson(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${p}&content=${encodeURIComponent(q)}`)
            m.reply(res.data)
        } catch(e) {
            sius.cantLoad(e)
        }
    }
})