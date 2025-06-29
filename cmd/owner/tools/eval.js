commands.add({
    name: ["eval"],
    command: ["eval"],
    category: "owner-tools",
    owner: true,
    param: "<kode javascript>",
    desc: "evaluasi kode JavaScript secara langsung",
    run: async ({ sius, m, args }) => {
        try {
            if (!args.length) return m.reply("[×] Format: .eval <kode JavaScript>\ncontoh: .eval 1 + 1 atau .eval async () => await new Promise(r => setTimeout(() => r(5), 1000))")
            const code = args.join(" ")
            let wrappedCode = code
            if (code.includes("await") && !code.startsWith("async")) {
                wrappedCode = `(async () => { return ${code} })()`
            }
            let result
            try {
                result = eval(wrappedCode)
                if (result instanceof Promise) {
                    result = await result
                }
            } catch (err) {
                return m.reply(`*[×] Eror:* ${err.message}`)
            }
            // format output
            const output = typeof result === "object" ? JSON.stringify(result, null, 2) : result
            await m.reply(`*[√] Hasil eval:*\n\`\`\`\n${output}\n\`\`\``)
        } catch (err) {
            sius.cantLoad(err)
        }
    }
})