import fs from "fs"

commands.add({
    name: ["infogroup"],
    command: ["infogroup"],
    category: "group",
    alias: ["groupinfo"],
    desc: "Menampilkan informasi tentang grup",
    group: true,
    run: async ({ sius, m, Func }) => {
        try {
            const groupMetadata = await sius.groupMetadata(m.chat);
            const participants = groupMetadata.participants;
            const owner = groupMetadata.owner || "Tidak diketahui";
            const createdAt = new Date(groupMetadata.creation * 1000).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
            let profile;
            try {
                profile = await sius.profilePictureUrl(m.chat, "image");
            } catch {
                profile = "./lib/media/assets/default.jpg";
            }
            const thumbnail = profile.startsWith("http") ? await (await Func.getBuffer(profile)) : fs.readFileSync(profile);
            const set = db.groups[m.chat] || {}
            const infoMsg = `*▢ Nama Grup:* ${groupMetadata.subject}\n` +
                `*▢ ID Grup:* ${groupMetadata.id}\n` +
                `*▢ Dibuat Pada:* ${createdAt}\n` +
                `*▢ Owner:* @${owner.split("@")[0]}\n` +
                `*▢ Jumlah Member:* ${participants.length}\n` +
                `*▢ Edit Info:* ${groupMetadata.restrict ? "Hanya Admin" : "Semua Member"}\n` +
                `*▢ Kirim Pesan:* ${groupMetadata.announce ? "Hanya Admin" : "Semua Member"}\n` +
                `*▢ Anti tagsw :* ${set.antitagsw ? "√" : "×"}\n` +
                `*▢ Antilink :* ${set.antilink ? "√" : "×"}\n` +
                `*▢ Anti virtex :* ${set.antivirtex ? "√" : "×"}\n` +
                `*▢ Anti delete :* ${set.antidelete ? "√" : "×"}\n` +
                `*▢ Anti toxic :* ${set.antitoxic ? "√" : "×"}\n` +
                `*▢ Anti hidetag :* ${set.antihidetag ? "√" : "×"}\n` +
                `*▢ Welcome :* ${set.welcome ? "√" : "×"}\n` +
                `*▢ Nsfw :* ${set.nsfw ? "√" : "×"}\n` +
                `*▢ Deskripsi:* ${groupMetadata.desc || "Tidak ada deskripsi"}\n`;
            await m.reply(infoMsg, {
                contextInfo: {
                    externalAdReply: {
                        title: "G R O U P - I N F O",
                        thumbnail: thumbnail,
                        mediaType: 1,
                        previewType: "PHOTO",
                        renderLargerThumbnail: true,
                        sourceUrl: `https://chat.whatsapp.com/${await sius.groupInviteCode(m.chat)}`
                    },
                    mentionedJid: [owner]
                }
            })            
        } catch (err) {
            sius.cantLoad(err);
        }
    }
});