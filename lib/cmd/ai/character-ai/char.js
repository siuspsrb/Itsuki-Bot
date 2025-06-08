commands.add({
    name: ["character-ai"],
    command: ["character-ai", "charlist"],
    category: "character-ai",
    desc: "list semua karakter AI",
    run: async ({ m }) => {
        let list = `
│ 
│ 1. ${m.prefix}gojo
│ 2. ${m.prefix}itachi
│ 3. ${m.prefix}luffy
│ 4. ${m.prefix}eren
│ 5. ${m.prefix}makima
│ 6. ${m.prefix}kaguya
│ 7. ${m.prefix}anya
│ 8. ${m.prefix}levi
│ 9. ${m.prefix}kakashi
│ 10. ${m.prefix}gintoki
│ 11. ${m.prefix}killua
│ 12. ${m.prefix}yagami
│ 13. ${m.prefix}rem
│ 14. ${m.prefix}todoroki
│ 15. ${m.prefix}rimuru
│ 16. ${m.prefix}sukuna
│ 17. ${m.prefix}nezuko
│ 18. ${m.prefix}anya
│ 19. ${m.prefix}naruto
╰───────`.trim()
        await m.reply(`╭─「 *CHARACTER AI LIST* 」\n${list}`)
    }
})