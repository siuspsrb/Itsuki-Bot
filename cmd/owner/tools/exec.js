import syntaxerror from "syntax-error"
import util from "util"

commands.add({
    name: ["async","exec"],
    command: ["async","exec"],
    category: "owner-tools",
    desc: "jalankan kode javascript",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        const code = args.join(" ")
        if (!code) return m.reply("[×] Masukkan kode javascript yang mau dijalankan")
        let _return
        let _syntax = ""
        const exec = new (async () => {}).constructor(
            "sius",
            "m",
            "Func",
            code
        )
        try {
            _return = await exec.call(null, sius, m, Func)
        } catch (e) {
            const err = await syntaxerror(code, "Execution Function", {
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            })
            if (err) _syntax = "```" + err + "```\n\n"
            _return = e
        }
        await m.reply(_syntax + util.format(_return))
    }
})