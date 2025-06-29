import { transfer } from "../../lib/game.js"

commands.add({
    name: ["transfer"],
    command: ["transfer"],
    category: "user",
    alias: ["tf", "kirim"],
    desc: "mentransfer limit atau uang ke user lain",
    run: async({ sius, m, args }) => {
        await transfer(m, args, db)
    }
})