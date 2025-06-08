commands.add({
    name: ["level"],
    command: ["level"],
    category: "user",
    desc: "Melihat level dan EXP kamu",
    run: async({ sius, m, args, Func }) => {
        const userId = m.sender
        let user = db.users[userId]
        const expGain = Math.floor(Math.random() * 50) + 10
        Func.addExp(user, expGain)
        db.users[userId] = user
        m.reply(`Kamu mendapatkan *${expGain} EXP!*\n\n> ⚜️ Level: *${user.level}*\n> 🫅🏼 Role: *${user.role}* \n> 📊 EXP: *${user.exp}/${Func.expToLevelUp(user.level)}*`)
    }
})