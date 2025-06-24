/*
fungsinya buat bikin fitur bot langsung dari chat, format field: value, dipisah pake koma. minimal butuh 3 hal: command, category, dan run. nah run ini isi logika perintahnya, bedanya sama .sf, fitur ini cocok buat testing command, prototyping logic, atau nambahin command sementara tanpa harus oprek-oprek file .js manual. dan kalau udah gak dipake, tinggal pake .delcmd buat hapus lagi. mirip kaya isi function biasa, bisa single line atau multi-line, kalau mau multi line tambahin ; 
CONTOH:
SINGLE LINE: .addfitur command: ping, category: tools, run: m.reply("pong!")
Output: balas pong
MULTI LINE: .addfitur command: greet, category: fun, run: m.react("👋"); await m.reply("halo!"); await sius.sendMessage(m.chat, { text: "apa kabar?" })
Output: 1. kirim react 👋
2. bales "halo!"
3. terus kirim pesan lagi "apa kabar?"

*udah yappingnya 😂😂
*/

commands.add({
    name: ["addfitur"],
    command: ["addfitur", "addfeature"],
    category: "command - handler",
    owner: true,
    query: true,
    usage: "<field: value, ...>",
    example: "addfitur command: ping, category: utility, run: m.reply('pong!'), cooldown: 5",
    desc: "buat command baru (runtime, non-file)",
    run: async ({ m, text }) => {
        const body = text.trim()
        if (!body.includes(":")) return m.reply("⚠️ Format salah. Contoh: .addfitur command: ping, category: tools, run: m.reply('hi')")
        const props = {}
        try {
            const pairs = body.split(",").map(p => p.trim().split(":").map(x => x.trim()))
            for (const [key, val] of pairs) {
                const lower = key.toLowerCase()
                if (["owner", "group", "admin", "botadmin", "premium", "private", "register", "hidden", "query"].includes(lower)) {
                    props[lower] = val === "true"
                } else if (["cooldown", "level", "limit"].includes(lower)) {
                    const num = Number(val)
                    props[lower] = isNaN(num) ? val : num
                } else if (["alias", "command", "name"].includes(lower)) {
                    props[lower] = val.split(",").map(v => v.trim().toLowerCase())
                } else {
                    props[lower] = val
                }
            }
            if (!props.run || !props.command || !props.category) {
                return m.reply("⚠️ Field wajib: *run*, *command*, dan *category*")
            }
            const runFunc = new Function("sius", "m", "args", `"use strict"; try { ${props.run} } catch(e) { m.reply('⚠️ Terjadi kesalahan saat menjalankan command'); console.log(e) }`)
            const name = props.name || props.command
            if (!Array.isArray(name) || name.length < 1) return m.reply("⚠️ Field *name* atau *command* harus array (gunakan koma jika banyak)")
            const eventData = {
                name: Array.isArray(name) ? name : [name],
                command: props.command,
                category: props.category.toLowerCase(),
                run: async ({ sius, m, args }) => runFunc(sius, m, args),
                desc: props.desc || "-",
                alias: props.alias || [],
                owner: props.owner || false,
                group: props.group || false,
                admin: props.admin || false,
                botAdmin: props.botadmin || false,
                premium: props.premium || false,
                private: props.private || false,
                register: props.register || false,
                hidden: props.hidden || false,
                query: props.query || false,
                cooldown: props.cooldown || 0,
                level: props.level || 1,
                limit: props.limit === true ? 1 : props.limit || false,
                example: props.example || "",
                param: props.param || ""
            }
            commands.add(eventData)
            m.reply(`[√] Command *${eventData.command.join(", ")}* berhasil ditambahkan!`)
        } catch (e) {
            m.reply("⚠️ Gagal parsing perintah, pastikan format valid.\n" + e.message)
        }
    }
})