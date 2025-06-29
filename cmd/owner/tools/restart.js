commands.add({
    name: ["restart","reboot"],
    command: ["restart", "reboot"],
    category: "owner-tools",
    desc: "restart bot",
    owner: true,
    run: async ({ sius, m }) => {
        await m.reply("[√] restarting bot...")
        if (process.send) {
            process.send("reset") // support pm2
        } else {
            process.exit() // fallback
        }
    }
})