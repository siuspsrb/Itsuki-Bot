commands.add({
    name: ["soccer"],
    command: ["soccer"],
    category: "game",
    desc: "Main sepak bola di grup dengan tim internasional dan hadiah money",
    run: async ({ sius, m, args, Func }) => {
        const groupId = m.key.remoteJid
        if (!m.isGroup) return m.reply("Fitur soccer hanya untuk grup!") // selain group: true, gini jg bsa 
        // daftar 20+ tim internasional
        let user = db.users
        const teamsList = [
            "Manchester United", "Chelsea", "Liverpool", "Arsenal", "Manchester City",
            "Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla", "Valencia",
            "Bayern Munich", "Borussia Dortmund", "RB Leipzig", "Juventus", "Inter Milan",
            "AC Milan", "Napoli", "Paris Saint-Germain", "Lyon", "Ajax",
            "Benfica", "Porto", "Tottenham Hotspur"
        ]
        const stadion = [
            "https://i.pinimg.com/originals/2e/57/a8/2e57a8904eca15dfa7eb3619b4009b45.jpg",
            "https://i.pinimg.com/originals/cd/53/21/cd5321ea52b018718c7cdf8862952fb2.png",
            "https://i.pinimg.com/originals/82/eb/c3/82ebc3c0d6aa4b47c5ca794b171d6355.jpg",
            "https://i.pinimg.com/originals/65/ba/09/65ba09265ef288efafa290c64f422df6.jpg",
            "https://i.pinimg.com/originals/d2/f8/46/d2f8464a29134162f9655dbc24ea74f0.jpg",
            "https://i.pinimg.com/originals/d4/33/a1/d433a1d316a1753e356358245f1dcf8d.jpg",
            "https://i.pinimg.com/originals/ea/9d/bc/ea9dbcea02b6c42ed0c89ed791d99a14.jpg",
            "https://i.pinimg.com/originals/ad/08/ce/ad08ce01fedcd388bc1bba5bcbcfbfc3.jpg",
            "https://i.pinimg.com/originals/02/56/44/0256443cf406ba2f28b9f4d812b70c5f.jpg",
            "https://i.pinimg.com/originals/12/7b/c2/127bc2bbcfabf83e071bd29fa7e6d96b.jpg"
        ]
        // inisialisasi sesi soccer
        sius.soccer = sius.soccer || {}
        const session = sius.soccer[groupId] || { 
            state: "idle", 
            teams: { A: { name: null, players: [] }, B: { name: null, players: [] } }, 
            match: null 
        }
        sius.soccer[groupId] = session
        // sub-command: start, join, kickoff, tutorial
        if (args[0]?.toLowerCase() === "start") {
            if (session.state !== "idle") return m.reply("▢ Pertandingan sudah dimulai atau sedang berlangsung!")
            session.state = "picking"
            session.teams = { A: { name: null, players: [] }, B: { name: null, players: [] } }
            session.match = null
            sius.soccer[groupId] = session
            let teamOptions = teamsList.map((team, i) => `${i + 1}. ${team}`).join("\n")
            return m.reply(`▢ *Soccer Match Dimulai!*\n\nPilih tim dengan: *!soccer join <nomor tim>*\nMinimal 1 pemain per tim. Ketik *!soccer kickoff* untuk mulai!\n\n*Daftar Tim:*\n${teamOptions}`)
            
        } else if (args[0]?.toLowerCase() === "join") {
            if (session.state !== "picking") return m.reply("▢ Tidak bisa gabung sekarang! Tunggu pertandingan baru dengan *!soccer start*")
            const teamIndex = parseInt(args[1]) - 1
            if (isNaN(teamIndex) || teamIndex < 0 || teamIndex >= teamsList.length) return m.reply(`▢ Pilih nomor tim yang valid (1-${teamsList.length})! Contoh: *!soccer join 1*`)
            const selectedTeam = teamsList[teamIndex]
            // cek apakah tim sudah dipilih
            if (session.teams.A.name === selectedTeam || session.teams.B.name === selectedTeam) return m.reply(`▢ Tim *${selectedTeam}* sudah dipilih! Pilih tim lain.`)
            if (session.teams.A.players.includes(m.sender) || session.teams.B.players.includes(m.sender)) return m.reply("▢ Kamu sudah di tim!")
            // tentukan slot tim (A atau B)
            let targetTeam = session.teams.A.name ? "B" : "A"
            if (!session.teams[targetTeam].name) session.teams[targetTeam].name = selectedTeam
            session.teams[targetTeam].players.push(m.sender)
            sius.soccer[groupId] = session
            const teamA = session.teams.A.name ? `${session.teams.A.name}: ${session.teams.A.players.map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}` : "Kosong"
            const teamB = session.teams.B.name ? `${session.teams.B.name}: ${session.teams.B.players.map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}` : "Kosong"
            return m.reply(`▢ *${m.pushName} bergabung ke ${session.teams[targetTeam].name}!*\n\nTim A: ${teamA}\nTim B: ${teamB}\n\nKetik *!soccer kickoff* kalau siap mulai!`)
            
} else if (args[0]?.toLowerCase() === "kickoff") {
    if (session.state !== "picking") return m.reply("▢ Tidak bisa mulai sekarang! Mulai pertandingan baru dengan *!soccer start*");
    if (session.teams.A.players.length < 1 || session.teams.B.players.length < 1) return m.reply("▢ Minimal 1 pemain per tim! Ajak teman dengan *!soccer join <nomor tim>*");
    
    session.state = "playing";
    session.match = {
        score: { A: 0, B: 0 },
        minute: 0,
        half: 1, // Penanda babak
        messageKey: null,
        events: []
    };
    sius.soccer[groupId] = session;

    // Kirim pesan awal pertandingan
    let matchText = `⚽ *Soccer Match: ${session.teams.A.name} vs ${session.teams.B.name}* ⚽\n\n`;
    matchText += `🏟️ Babak ${session.match.half} | Menit: ${session.match.minute}'\n`;
    matchText += `Skor: ${session.teams.A.name} ${session.match.score.A} - ${session.match.score.B} ${session.teams.B.name}\n\n`;
    matchText += `📋 *Pemain:*\n`;
    matchText += `▢ ${session.teams.A.name}: ${session.teams.A.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.A.players.length > 5 ? " dan lainnya" : ""}\n`;
    matchText += `▢ ${session.teams.B.name}: ${session.teams.B.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.B.players.length > 5 ? " dan lainnya" : ""}\n\n`;
    matchText += `🏟️ Stadion penuh sesak! ${session.teams.A.name} dan ${session.teams.B.name} siap bertarung! Wasit meniup peluit...`;
    const sentMsg = await m.reply(matchText);
    session.match.messageKey = sentMsg.key;
    sius.soccer[groupId] = session;

    // Daftar event pertandingan
    const events = [
        `${session.teams.A.name} melancarkan serangan dari sayap kiri!`,
        `${session.teams.B.name} mencoba umpan panjang ke striker!`,
        "Wasit memberikan kartu kuning setelah pelanggaran keras!",
        "Tendangan sudut untuk tim yang sedang menekan!",
        "Penjaga gawang 🥅 melakukan penyelamatan spektakuler!",
        "Counter-attack cepat, peluang besar tercipta!"
    ];
    const narrators = [
        "🔥 Suporter menggila di tribun!",
        "⚡ Momen krusial di lapangan!",
        "🏃 Kecepatan pemain bikin lawan kewalahan!",
        "🎯 Tembakan melesat ke arah gawang 🥅!"
    ];

    // Simulasi pertandingan (3 detik per update, lompat 5 menit)
    let minute = 0;
    const interval = setInterval(async () => {
        minute += 5; // Tambah 5 menit per update
        session.match.minute = minute;

        // Jeda babak pertama di menit 45
        if (minute === 45) {
            session.match.events.push("⏰ *Babak Pertama Selesai!* Tim masuk ruang ganti untuk istirahat.");
            let halfTimeText = `⚽ *Soccer Match: Babak Pertama Selesai* ⚽\n\n`;
            halfTimeText += `🏟️ Babak ${session.match.half} | Menit: ${session.match.minute}'\n`;
            halfTimeText += `Skor: ${session.teams.A.name} ${session.match.score.A} - ${session.match.score.B} ${session.teams.B.name}\n\n`;
            halfTimeText += `📋 *Pemain:*\n`;
            halfTimeText += `▢ ${session.teams.A.name}: ${session.teams.A.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.A.players.length > 5 ? " dan lainnya" : ""}\n`;
            halfTimeText += `▢ ${session.teams.B.name}: ${session.teams.B.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.B.players.length > 5 ? " dan lainnya" : ""}\n\n`;
            halfTimeText += `> ${session.match.events.slice(-3).join("\n> ")}`;
            try {
                await m.reply(halfTimeText, { edit: session.match.messageKey });
            } catch (e) {
                const sentMsg = await m.reply(halfTimeText);
                session.match.messageKey = sentMsg.key;
            }
            session.match.half = 2; // Lanjut ke babak kedua
            sius.soccer[groupId] = session;
            clearInterval(interval); // Stop interval untuk jeda
            await new Promise(resolve => setTimeout(resolve, 10000)); // Jeda 10 detik

            // Mulai babak kedua
            minute = 50; // Lanjut dari menit 50
            session.match.minute = minute;
            session.match.events.push("⚽ *Babak Kedua Dimulai!* Pertandingan kembali memanas!");
            let secondHalfText = `⚽ *Soccer Match: ${session.teams.A.name} vs ${session.teams.B.name}* ⚽\n\n`;
            secondHalfText += `🏟️ Babak ${session.match.half} | Menit: ${session.match.minute}'\n`;
            secondHalfText += `Skor: ${session.teams.A.name} ${session.match.score.A} - ${session.match.score.B} ${session.teams.B.name}\n\n`;
            secondHalfText += `📋 *Pemain:*\n`;
            secondHalfText += `▢ ${session.teams.A.name}: ${session.teams.A.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.A.players.length > 5 ? " dan lainnya" : ""}\n`;
            secondHalfText += `▢ ${session.teams.B.name}: ${session.teams.B.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.B.players.length > 5 ? " dan lainnya" : ""}\n\n`;
            secondHalfText += `> ${session.match.events.slice(-3).join("\n> ")}`;
            try {
                await m.reply(secondHalfText, { edit: session.match.messageKey });
            } catch (e) {
                const sentMsg = await m.reply(secondHalfText);
                session.match.messageKey = sentMsg.key;
            }
            sius.soccer[groupId] = session;

            // Lanjutkan interval untuk babak kedua
            const secondHalfInterval = setInterval(async () => {
                minute += 5; // Tambah 5 menit per update
                session.match.minute = minute;

                // Akhiri pertandingan di menit 90
                if (minute > 90) {
                    clearInterval(secondHalfInterval);
                    session.state = "idle";
                    session.match.events.push("🏁 *Peluit Panjang!* Pertandingan selesai!");
                    const moneyReward = 5000;
                    let resultText = `⚽ *Soccer Match: Hasil Akhir* ⚽\n\n`;
                    resultText += `Skor: ${session.teams.A.name} ${session.match.score.A} - ${session.match.score.B} ${session.teams.B.name}\n`;
                    resultText += `Menit: ${session.match.minute}'\n\n`;
                    resultText += `📋 *Pemain:*\n`;
                    resultText += `▢ ${session.teams.A.name}: ${session.teams.A.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.A.players.length > 5 ? " dan lainnya" : ""}\n`;
                    resultText += `▢ ${session.teams.B.name}: ${session.teams.B.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.B.players.length > 5 ? " dan lainnya" : ""}\n\n`;
                    resultText += session.match.events.slice(-5).join("\n");
                    resultText += "\n\n";
                    if (session.match.score.A > session.match.score.B) {
                        resultText += `🏆 *${session.teams.A.name} juara!* 🎉\n`;
                        resultText += `Setiap pemain mendapat *${Func.formatUang(moneyReward)}* Money 💰!`;
                        session.teams.A.players.forEach(player => {
                            user[player] = db.users[player] || { money: 0 };
                            user[player].money += moneyReward;
                            db.users = user;
                        });
                    } else if (session.match.score.B > session.match.score.A) {
                        resultText += `🏆 *${session.teams.B.name} juara!* 🎉\n`;
                        resultText += `Setiap pemain mendapat *${Func.formatUang(moneyReward)}* Money 💰!`;
                        session.teams.A.players.forEach(player => {
                            user[player] = db.users[player] || { money: 0 };
                            user[player].money += moneyReward;
                            db.users = user;
                        });
                    } else {
                        resultText += `🤝 *Pertandingan imbang!* Tidak ada money dibagikan.`;
                    }
                    try {
                        await m.reply(resultText, { edit: session.match.messageKey });
                    } catch (e) {
                        await m.reply(resultText);
                    }
                    delete sius.soccer[groupId];
                    return;
                }

                // Acak peluang gol (3% per 5 menit untuk ~2-3 gol per match)
                if (Math.random() < 0.03) {
                    const scoringTeam = Math.random() < 0.5 ? "A" : "B";
                    session.match.score[scoringTeam]++;
                    const scorer = Func.pickRandom(session.teams[scoringTeam].players);
                    session.match.events.push(`⚽ *GOOOAL!* @${scorer.split("@")[0]} dari ${session.teams[scoringTeam].name} mencetak gol di menit ${minute}'! 🎉`);
                } else {
                    session.match.events.push(`${narrators[Math.floor(Math.random() * narrators.length)]} ${events[Math.floor(Math.random() * events.length)]}`);
                }

                // Update pesan pertandingan
                let matchText = `⚽ *SOCCER MATCH: ${session.teams.A.name} vs ${session.teams.B.name}*\n\n`;
                matchText += `🏟️ Babak ${session.match.half} | Menit: ${session.match.minute}'\n`;
                matchText += `Skor: ${session.teams.A.name} ${session.match.score.A} - ${session.match.score.B} ${session.teams.B.name}\n\n`;
                matchText += `📋 *Pemain:*\n`;
                matchText += `▢ ${session.teams.A.name}: ${session.teams.A.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.A.players.length > 5 ? " dan lainnya" : ""}\n`;
                matchText += `▢ ${session.teams.B.name}: ${session.teams.B.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.B.players.length > 5 ? " dan lainnya" : ""}\n\n`;
                matchText += `> ${session.match.events.slice(-3).join("\n> ")}`;
                try {
                    await m.reply(matchText, { edit: session.match.messageKey });
                } catch (e) {
                    const sentMsg = await m.reply(matchText);
                    session.match.messageKey = sentMsg.key;
                }
                sius.soccer[groupId] = session;
            }, 3000); // Update tiap 3 detik untuk babak kedua
            return;
        }

        // Acak peluang gol (3% per 5 menit untuk ~2-3 gol per match)
        if (Math.random() < 0.03) {
            const scoringTeam = Math.random() < 0.5 ? "A" : "B";
            session.match.score[scoringTeam]++;
            const scorer = Func.pickRandom(session.teams[scoringTeam].players);
            session.match.events.push(`⚽ *GOOOAL!* @${scorer.split("@")[0]} dari ${session.teams[scoringTeam].name} mencetak gol di menit ${minute}'! 🎉`);
        } else {
            session.match.events.push(`${narrators[Math.floor(Math.random() * narrators.length)]} ${events[Math.floor(Math.random() * events.length)]}`);
        }

        // Update pesan pertandingan
        let matchText = `⚽ *Soccer Match: ${session.teams.A.name} vs ${session.teams.B.name}* ⚽\n\n`;
        matchText += `🏟️ Babak ${session.match.half} | Menit: ${session.match.minute}'\n`;
        matchText += `Skor: ${session.teams.A.name} ${session.match.score.A} - ${session.match.score.B} ${session.teams.B.name}\n\n`;
        matchText += `📋 *Pemain:*\n`;
        matchText += `▢ ${session.teams.A.name}: ${session.teams.A.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.A.players.length > 5 ? " dan lainnya" : ""}\n`;
        matchText += `▢ ${session.teams.B.name}: ${session.teams.B.players.slice(0, 5).map(id => `@${id.split("@")[0]}`).join(", ") || "Kosong"}${session.teams.B.players.length > 5 ? " dan lainnya" : ""}\n\n`;
        matchText += `> ${session.match.events.slice(-3).join("\n> ")}`;
        try {
            await m.reply(matchText, { edit: session.match.messageKey });
        } catch (e) {
            const sentMsg = await m.reply(matchText);
            session.match.messageKey = sentMsg.key;
        }
        sius.soccer[groupId] = session;
    }, 3000); // Update tiap 3 detik untuk babak pertama
            
        } else if (args[0]?.toLowerCase() === "tutorial") {
            let tutorialText = `🌟 *Panduan Soccer Match* 🌟\n\n`
            tutorialText += `Main sepak bola ala klub dunia di grup WhatsApp! Pilih tim ternama, bertanding, dan menangkan money besar! Pesan diedit live tiap detik. Minimal 1 pemain per tim! ⚽\n\n`
            tutorialText += `📖 *Cara Main*\n`
            tutorialText += `▢ *1. Mulai Pertandingan*\n`
            tutorialText += `   Ketik: *!soccer start*\n`
            tutorialText += `   Bot tampilkan daftar tim (MU, Chelsea, dll.).\n\n`
            tutorialText += `▢ *2. Pilih Tim*\n`
            tutorialText += `   Ketik: *!soccer join <nomor tim>*\n`
            tutorialText += `   Contoh: *!soccer join 1* untuk Manchester United.\n`
            tutorialText += `   Minimal 1 pemain per tim, tim beda setiap match!\n\n`
            tutorialText += `▢ *3. Mulai Match*\n`
            tutorialText += `   Ketik: *!soccer kickoff*\n`
            tutorialText += `   Pertandingan 90 menit (90 detik) dimulai! Pesan diedit dengan skor dan aksi seperti "⚽ GOOOAL!"\n\n`
            tutorialText += `▢ *4. Ikuti Aksi*\n`
            tutorialText += `   Skor, menit, dan event (gol, penyelamatan) muncul live. Contoh:\n`
            tutorialText += `   "Skor: Manchester United 1 - 0 Chelsea\nMenit: 10'\n⚽ GOOOAL!"\n\n`
            tutorialText += `▢ *5. Hasil & Hadiah*\n`
            tutorialText += `   Pemenang dapat 5000 money per pemain! Contoh:\n`
            tutorialText += `   "Hasil Akhir: Manchester United 2 - 1 Chelsea\nMU menang! 5000 money dibagikan!"\n\n`
            tutorialText += `⚡ *Tips*\n`
            tutorialText += `▢ Pilih tim favoritmu, tapi cepat biar gak keduluan!\n`
            tutorialText += `▢ Pantau pesan live biar gak ketinggalan momen!\n`
            tutorialText += `▢ Menang = money 🤑, jadi rebut kemenangan!\n\n`
            tutorialText += `🏟️ *Siap Juara?*\n`
            tutorialText += `Ketik *!soccer start* dan pimpin timmu ke kemenangan! ⚽`
            await m.reply(tutorialText)
            
        } else {
            let teamOptions = teamsList.map((team, i) => `${i + 1}. ${team}`).join("\n")
            return m.reply(`⚽🏆 *SOCCER MATCH*\n\nGunakan:\n    ▢ *!soccer start* untuk mulai\n    ▢ *!soccer join <tim>* untuk gabung\n    ▢ *!soccer kickoff* untuk main\n    ▢ *!soccer tutorial* untuk panduan`, {
                contextInfo: {
                    externalAdReply: {
                        thumbnailUrl: Func.pickRandom(stadion),
                        mediaUrl: Func.pickRandom(stadion),
                        previewType: "PHOTO",
                        sourceUrl: config.github,
                        renderLargerThumbnail: true,
                        mediaType: 1
                    }
                }
            })                        
        }
    }
})