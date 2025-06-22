commands.add({
    name: ["creategroup"],
    command: ["creategroup"],
    category: "owner",
    owner: true,
    run: async ({ sius, m, args, Func }) => {
        try {
            const groupName = args.join(" ");
            if (!groupName) return m.reply('Sertakan nama grupnya');            
            const group = await sius.groupCreate(groupName, [m.sender]);
            const inviteCode = await sius.groupInviteCode(group.id);            
            await m.reply(
                `*Link Group:* https://chat.whatsapp.com/${inviteCode}\n` +
                `*Nama Group:* ${group.subject}\n` +
                `Segera masuk dalam 30 detik untuk menjadi Admin`,
                { detectLink: true }
            );           
            await Func.sleep(30000);
            await sius.groupParticipantsUpdate(group.id, [m.sender], 'promote').catch(() => {});
            await sius.sendMessage(group.id, { text: 'Done' });
        } catch (e) {
            sius.cantLoad(e)
        }
    }
});