import fs from "fs";
import chalk from "chalk";

commands.add({
    name: ["menu"],
    command: ["menu"],
    category: "info",
    cooldown: 30,
    desc: "Menampilkan menu bot berdasarkan kategori",
    run: async ({ sius, m, args }) => {
        try {
            const pushName = m.pushName || "-";
            const prefix = ".";
            const x = await sius.decodeJid(sius.user.id);
            const set = db.set[x];
            const ment = set.template;
            const uptime = process.uptime();
            const runtime = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;
            const modeBot = set.privateonly ? "Only private chat" : set.grouponly ? "Only group chat" : set.public ? "Public" : "Self";

            // ambil semua kategori command
            const commandCategories = [...new Set(
                commands.getAllCommands()
                    .map(cmd => cmd.category?.toLowerCase())
                    .filter(Boolean) // biar paham aj sih
            )].sort();

            // fungsi helper untuk ambil daftar command per kategori
            const getCommandsByCategory = (category) => {
                const rows = [];
                const seenEvents = new Set();
                for (const event of commands.getAllCommands()) {
                    if (event.category?.toLowerCase() !== category || event.category === "hidden") continue;
                    const eventKey = event.name[0];
                    if (seenEvents.has(eventKey)) continue;
                    seenEvents.add(eventKey);
                    event.command.forEach((cmd) => {
                        rows.push({
                            title: cmd.toUpperCase(),
                            description: event.desc?.slice(0, 72) || "-",
                            id: `${prefix}${cmd}`
                        });
                    });
                }
                return rows.sort((a, b) => a.title.localeCompare(b.title));
            };

            // main menu (tanpa argumen)
            if (!args[0]) {
                let welcomeMsg = `Hai! Aku adalah *${config.bot.name || "Itsuki"}*, sistem otomatis (WhatsApp Bot) yang siap bantu kamu cari data, hiburan, dan tools seru langsung dari WA!\n\n`;
                welcomeMsg += `    *▢ Runtime:* ${runtime}\n`;
                welcomeMsg += `    *▢ Mode:* ${modeBot}\n`;
                welcomeMsg += `    *▢ Group:* ${config.bot.group}\n\n`;
                welcomeMsg += `Ketik *.auto-ai* untuk dapat berbicara dengan ${config.bot.name}!`;
                const menuSections = [{
                    title: 'LIST MENU',
                    rows: [
                        { title: 'ALL MENU', id: `.allmenu` },
                        ...commandCategories.map(cat => ({
                            title: cat.toUpperCase(),
                            description: `Fitur kategori ${cat} (Total: ${getCommandsByCategory(cat).length} fitur)`,
                            id: `.menu ${cat}`
                        }))
                    ]
                }];

                // pilih template sesuai tipe menu
                if (ment === "buttonList") {
                    const menuThumb = fs.readFileSync("./lib/database/allmenu.jpg");
                    return await sius.sendMessage(m.chat, {
                        image: menuThumb,
                        caption: welcomeMsg,
                        footer: config.bot.footer,
                        contextInfo: { 
                            forwardingScore: 10, 
                            isForwarded: true 
                        },
                        buttons: [
                        {
                            buttonId: `${prefix}allmenu`,
                            buttonText: { displayText: 'All Menu' },
                            type: 1
                        },
                        {
                            buttonId: 'list_menu',
                            buttonText: { displayText: 'List' },
                            type: 4,
                            nativeFlowInfo: {
                            name: 'single_select',
                            paramsJson: JSON.stringify({
                            title: 'List Menu',
                            sections: menuSections 
                            })
                        }
                        }
                        ],
                        headerType: 1,
                        viewOnce: true
                    }, { quoted: m });
                } else if (ment === "documentButtonList" || ment === "gifButtonList" || ment == "documentButtonWithAdReply") {
                    const media = (ment === "documentButtonList" || ment == "documentButtonWithAdReply") ? {
                        document: fs.readFileSync("./index.js"),
                        mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName: config.bot.name
                    } : {
                        video: { url: "https://files.catbox.moe/oc3duo.mp4" }                       
                    };
                    return await sius.sendMessage(m.chat, {
                        ...media,
                        caption: welcomeMsg,
                        footer: config.bot.footer,
                        contextInfo: {
                            forwardingScore: 10,
                            isForwarded: true,
                            externalAdReply: {
                                thumbnailUrl: config.thumb.menu,
                                mediaUrl: config.thumb.menu,
                                mediaType: 1,
                                previewType: "PHOTO",
                                sourceUrl: config.instagram,
                                renderLargerThumbnail: true
                            }
                        },
                        buttons: [
                        {
                            buttonId: `${prefix}allmenu`,
                            buttonText: { displayText: 'All Menu' },
                            type: 1
                        },
                        {
                        buttonId: 'interactive_menu',
                        buttonText: { displayText: 'List' },
                        type: 4,
                        nativeFlowInfo: {
                            name: 'single_select',
                            paramsJson: JSON.stringify({
                                title: 'List Menu',
                                sections: menuSections
                            })
                        }
                        }
                        ],
                        headerType: 1,
                        viewOnce: true
                    }, {
                       quoted: m 
                    });
                } else if (ment === "replyAd") {
                    let categoryList = `Hai! Aku adalah *${config.bot.name || "Itsuki"}*, sistem otomatis (WhatsApp Bot) yang siap bantu kamu cari data, hiburan, dan tools seru langsung dari WA!\n\n`;
                    categoryList += `    *▢ Runtime:* ${runtime}\n`;
                    categoryList += `    *▢ Mode:* ${modeBot}\n`;
                    categoryList += `    *▢ Group:* ${config.bot.group}\n\n`;
                    categoryList += `*DAFTAR KATEGORI MENU*\n`;
                    for (let cat of commandCategories) {
                        categoryList += `- .menu ${cat} (${getCommandsByCategory(cat).length})\n`;
                    }
                    categoryList += `\n> Gunakan .menu <kategori> untuk melihat command, atau .allmenu untuk semua fitur, Ketik .auto-ai untuk dapat berbicara dengan ${config.bot.name}`;

                    const menuThumb = fs.readFileSync("./lib/database/allmenu.jpg");
                    return m.reply(categoryList, {
                        contextInfo: {
                            forwardingScore: 100,
                            isForwarded: true,
                            externalAdReply: {
                                thumbnail: menuThumb,
                                sourceUrl: config.instagram,
                                mediaType: 1,
                                previewType: "PHOTO",
                                renderLargerThumbnail: true
                            }
                        }
                    });
                } else if (ment === "simple") {
                    let categoryList = `*DAFTAR KATEGORI*\n\n`;
                    categoryList += "┌─\n"
                    for (let cat of commandCategories) {
                        categoryList += `├ ${m.prefix}menu ${cat}\n`;
                    }
                    categoryList += "└─\n"
                    return m.reply(categoryList)
                }
            }

            // category-specific menu
            const requestedCategory = args[0].toLowerCase();
            if (!commandCategories.includes(requestedCategory)) {
                return
            }
            
            const rows = getCommandsByCategory(requestedCategory);
            if (ment === "buttonList" || ment === "documentButtonList") {
                const listThumb = fs.readFileSync("./lib/database/list.jpg");
                const media = ment === "buttonList" ? {
                    image: listThumb
                } : {
                    document: fs.readFileSync("./index.js"),
                    mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileName: config.bot.name
                };
                
                return sius.sendMessage(m.chat, {
                    ...media,
                    caption: `Berikut daftar perintah yang tersedia untuk *${requestedCategory.toUpperCase()}*, silakan pilih sesuai kebutuhan!`,
                    footer: config.bot.footer,
                    contextInfo: {
                        forwardingScore: 10,
                        isForwarded: true,
                        externalAdReply: {
                            thumbnail: listThumb,
                            mediaType: 1,
                            previewType: "PHOTO",
                            sourceUrl: config.instagram,
                            renderLargerThumbnail: true
                        }
                    },
                    buttons: [{
                        buttonId: 'category_menu',
                        buttonText: { displayText: 'List Commands' },
                        type: 4,
                        nativeFlowInfo: {
                            name: 'single_select',
                            paramsJson: JSON.stringify({
                                title: `MENU ${requestedCategory.toUpperCase()}`,
                                sections: [{
                                    title: `MENU ${requestedCategory.toUpperCase()}`,
                                    highlight_label: '📁 Commands',
                                    rows: rows
                                }]
                            })
                        }
                    }],
                    headerType: 1,
                    viewOnce: true
                }, { 
                    quoted: m 
                });
            } else if (ment === "replyAd" || ment === "documentButtonWithAdReply") {
                const listThumb = fs.readFileSync("./lib/database/list.jpg");
                const filteredCmd = [];
                const seenEvents = new Set();
                for (const event of commands.getAllCommands()) {
                    if (event.category?.toLowerCase() !== requestedCategory || event.category === "hidden") continue;
                    const eventKey = event.name[0];
                    if (seenEvents.has(eventKey)) continue;
                    seenEvents.add(eventKey);
                    event.command.forEach((cmd) => {
                        filteredCmd.push({
                            name: cmd + (event.param ? ` ${event.param}` : ""),
                            tag: event.category
                        });
                    });
                }
                const sortedCmds = filteredCmd.map(d => d.name).sort();
                let menuList = `╭────「 *${requestedCategory.toUpperCase()}* 」\n`;
                for (let cmd of sortedCmds) {
                    menuList += `│▢ .${cmd}\n`;
                }
                menuList += "╰────────"
                return m.reply(menuList.trim(), {
                    contextInfo: {
                        forwardingScore: 100,
                        isForwarded: true,
                        externalAdReply: {
                            thumbnail: listThumb,
                            sourceUrl: config.instagram,
                            mediaType: 1,
                            previewType: "PHOTO",
                            renderLargerThumbnail: true
                        }
                    }
                });
            } else if (ment === "simple") {
                let filteredCmd = [];
                let seenEvents = new Set();
                for (const event of commands.getAllCommands()) {
                    if (event.category?.toLowerCase() !== requestedCategory || event.category === "hidden") continue;
                    const eventKey = event.name[0];
                    if (seenEvents.has(eventKey)) continue;
                    seenEvents.add(eventKey);
                    event.command.forEach((cmd) => {
                        filteredCmd.push({
                            name: cmd + (event.param ? ` ${event.param}` : ""),
                            tag: event.category
                        });
                    });
                }
                const sortedCmds = filteredCmd.map(d => d.name).sort();
                let menuList = `┌─ 「 *${requestedCategory.toUpperCase()}* 」\n`;
                for (let cmd of sortedCmds) {
                    menuList += `├ ${m.prefix}${cmd}\n`;
                }
                menuList += "└─"
                return m.reply(menuList.trim()) 
            }
        } catch (e) {            
            sius.cantLoad(e);            
        }
    }
});

commands.add({
    name: ["allmenu"],
    command: ["allmenu"],
    category: "info",
    desc: "menampilkan semua fitur bot",
    cooldown: 30,
    run: async ({ sius, m }) => {
        const bot = sius.user.id
        const botJid = await sius.decodeJid(bot)
        const set = db.set[botJid]
        const uptime = process.uptime()
        const runtime = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
        const modeBot = set.privateonly ? "Only private chat" : set.grouponly ? "Only group chat" : set.public ? "Public" : "Self"

        const allCmds = commands.getAllCommands().filter(e => e.category !== "hidden")
        const grouped = {}

        for (const ev of allCmds) {
            const cat = ev.category.toUpperCase()
            if (!grouped[cat]) grouped[cat] = []
            grouped[cat].push(ev)
        }

        let teks = `📖 *MENU LENGKAP ${config.bot.name.toUpperCase()}*\n\n`
        teks += `▢ Runtime: ${runtime}\n`
        teks += `▢ Mode: ${modeBot}\n\n`

        for (const [cat, list] of Object.entries(grouped).sort()) {
            teks += `┌────「 *${cat}* 」\n`
            for (const ev of list) {
                for (const cmd of ev.command) {
                    teks += `├ .${cmd}${ev.param ? ` ${ev.param}` : ""}\n`
                }
            }
            teks += `└─────────────\n`
        }

        await sius.adChannel(teks.trim(), {
            title: `All Commands - ${config.bot.name}`,
            thumb: config.thumb.menu,
            render: true,
            txt: config.bot.name
        })
    }
})