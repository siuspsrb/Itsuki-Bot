import axios from "axios"

const api_dev_key = "4iXqa681ImN0ykqHeUInKGGAvET6A4u6"

const formatsList = [
    "4cs", "6502acme", "6502kickass", "6502tasm", "abap", "actionscript", "actionscript3", "ada",
    "aimms", "algol68", "apache", "applescript", "apt_sources", "arm", "asm", "asp", "asymptote",
    "autoconf", "autohotkey", "autoit", "avisynth", "awk", "bash", "batch", "bibtex", "blitzbasic",
    "brainfuck", "c", "csharp", "cpp", "css", "d", "delphi", "diff", "dos", "eiffel", "erlang",
    "fortran", "go", "groovy", "haskell", "html5", "java", "javascript", "json", "julia", "kotlin",
    "latex", "lisp", "lua", "markdown", "matlab", "mysql", "nim", "pascal", "perl", "php",
    "powershell", "prolog", "python", "r", "ruby", "rust", "scala", "scheme", "shell", "sql",
    "swift", "typescript", "vb", "verilog", "vhdl", "xml", "yaml", "z80"
]

commands.add({
    name: ["uppastebin"],
    command: ["uppastebin"],
    category: "tools",
    desc: "upload kode ke pastebin",
    usage: "<format>|<judul>|<kode>",
    example: "python|script uji coba|print('hai')",
    query: true,
    register: true,
    limit: true,
    run: async ({ sius, m, args }) => {
        const text = args.join(" ")

        if (text.toLowerCase() === "formats") {
            return m.reply(
                "*List Format Pastebin:*\n\n" + formatsList.map(f => `▢ ${f}`).join("\n")
            )
        }

        let [format, title, ...isi] = text.split("|")

        if (!isi.length) {
            isi = [title || format]
            title = `PasteBy-${m.sender.split("@")[0]}`
            format = "text"
        }

        const params = new URLSearchParams()
        params.append("api_dev_key", api_dev_key)
        params.append("api_option", "paste")
        params.append("api_paste_code", isi.join("|"))
        params.append("api_paste_name", title)
        params.append("api_paste_format", format)
        params.append("api_paste_private", "0")
        params.append("api_paste_expire_date", "N")

        try {
            const { data } = await axios.post("https://pastebin.com/api/api_post.php", params)
            m.reply(`*Berhasil diupload ke Pastebin!*\n\n▢ *Judul:* ${title}\n▢ *Format:* ${format}\n▢ *Status:* Public\n▢ *Link:* ${data}`)
        } catch (e) {
            console.error(e)
            m.reply("⚠️ gagal upload ke Pastebin. cek format input atau api key kamu ya!")
        }
    }
})