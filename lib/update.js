import fs from "fs"
import path from "path"
import https from "https"
import axios from "axios"
import chalk from "chalk"
import crypto from "crypto"
import FileType from "file-type"
import PhoneNumber from "awesome-phonenumber"
import config from "../settings.js"
import * as prem from "./premium.js"
import { imageToWebp, videoToWebp, writeExif } from "./exif.js"
import { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep, getTypeUrlMedia } from "./functions.js"
import { Serialize } from "./message.js"
import baileys from "baileys"

const { jidNormalizedUser, proto, getBinaryNodeChildren, getBinaryNodeChild, generateMessageIDV2, jidEncode, encodeSignedDeviceIdentity, generateWAMessageContent, generateForwardMessageContent, prepareWAMessageMedia, delay, areJidsSameUser, extractMessageContent, generateMessageID, downloadContentFromMessage, generateWAMessageFromContent, jidDecode, generateWAMessage, toBuffer, getContentType, WAMessageStubType, getDevice } = baileys;

const getGroupAdmins = (participants) => {
    let admins = [];
    for (let i of participants) {
        i.admin === "superadmin" ? admins.push(i.id) : i.admin === "admin" ? admins.push(i.id) : "";
    }
    return admins || [];
};

/*
 * Create By Sius
 * Follow https://github.com/siuspsrb
*/

async function GroupUpdate(sius, m, store) {
    if (!m.messageStubType || !m.isGroup) return;
    if (global.db?.groups[m.chat]?.setinfo && sius.public) {
        const admin = `@${m.sender.split`@`[0]}`;
        const messages = {
            1: "mereset link grup!",
            21: `mengubah Subject Grup menjadi :\n*${m.messageStubParameters[0]}*`,
            22: "telah mengubah icon grup.",
            23: "mereset link grup!",
            24: `mengubah deskripsi grup.\n\n${m.messageStubParameters[0]}`,
            25: `telah mengatur agar *${m.messageStubParameters[0] == "on" ? "hanya admin" : "semua peserta"}* yang dapat mengedit info grup.`,
            26: `telah *${m.messageStubParameters[0] == "on" ? "menutup" : "membuka"}* grup!\nSekarang ${m.messageStubParameters[0] == "on" ? "hanya admin yang" : "semua peserta"} dapat mengirim pesan.`,
            29: `telah menjadikan @${m.messageStubParameters[0].split`@`[0]} sebagai admin.`,
            30: `telah memberhentikan @${m.messageStubParameters[0].split`@`[0]} dari admin.`,
            72: `mengubah durasi pesan sementara menjadi *@${m.messageStubParameters[0]}*`,
            123: "menonaktifkan pesan sementara.",
            132: "mereset link grup!",
        };
        if (messages[m.messageStubType]) {
            await sius.sendMessage(m.chat, { text: `${admin} ${messages[m.messageStubType]}`, mentions: [m.sender, ...(m.messageStubParameters[0]?.includes("@") ? [`${m.messageStubParameters[0]}`] : [])] }, { ephemeralExpiration: m.expiration || store?.messages[m.chat]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 });
        } else {
            console.log({
                messageStubType: m.messageStubType,
                messageStubParameters: m.messageStubParameters,
                type: WAMessageStubType[m.messageStubType],
            });
        }
    }
}

async function GroupCacheUpdate(sius, update, store, groupCache) {
    try {
        for (let n of update) {
            if (store.groupMetadata[n.id]) {
                groupCache.set(n.id, n);
                store.groupMetadata[n.id] = {
                    ...(store.groupMetadata[n.id] || {}),
                    ...(n || {})
                };
            }
        }
    } catch (e) {
        throw e;
    }
}

async function GroupParticipantsUpdate(sius, { id, participants, author, action }, store, groupCache) {
    try {
        function updateAdminStatus(participants, metadataParticipants, status) {
            for (const participant of metadataParticipants) {
                let id = jidNormalizedUser(participant.id);
                if (participants.includes(id)) {
                    participant.admin = status;
                }
            }
        }
        if (global.db?.groups[id] && store?.groupMetadata[id]) {
            const metadata = store.groupMetadata[id];
            for (let n of participants) {
                let profile;
                try {
                    profile = await sius.profilePictureUrl(n, "image");
                } catch {
                    profile = "https://telegra.ph/file/95670d63378f7f4210f03.png";
                }
                let messageText = "";
                if (action === "add") {
                    messageText = db.groups[id]?.setwelcome || `Hi @user, selamat datang di @subject`;
                    metadata.participants.push({ id: jidNormalizedUser(n), admin: null });
                } else if (action === "remove") {
                    messageText = db.groups[id]?.setleave || `@user meninggalkan group @subject`;
                    metadata.participants = metadata.participants.filter(p => !participants.includes(jidNormalizedUser(p.id)));
                } else if (action === "promote") {
                    messageText = db.groups[id]?.setpromote || `@user dipromote jadi admin oleh @admin di @subject`;
                    updateAdminStatus(participants, metadata.participants, "admin");
                } else if (action === "demote") {
                    messageText = db.groups[id]?.setdemote || `@user didemote dari admin oleh @admin di @subject`;
                    updateAdminStatus(participants, metadata.participants, null);
                }
                groupCache.set(id, metadata);
                if (messageText && sius.public) {
                    messageText = messageText
                        .replace(/@user/g, `@${n.split("@")[0]}`)
                        .replace(/@subject/g, metadata.subject)
                        .replace(/@admin/g, author ? `@${author.split("@")[0]}` : "@admin")
                        .replace(/@desc/g, db.groups[id]?.desc || "Tidak ada deskripsi");
                    await sius.sendMessage(
                        id,
                        {
                            text: messageText,
                            contextInfo: {
                                mentionedJid: [n, author].filter(Boolean),
                                externalAdReply: {
                                    title:
                                        action == "add"
                                            ? "Welcome"
                                            : action == "remove"
                                            ? "Leaving"
                                            : action.charAt(0).toUpperCase() + action.slice(1),
                                    mediaType: 1,
                                    previewType: 0,
                                    thumbnailUrl: profile,
                                    renderLargerThumbnail: true,
                                    sourceUrl: config.github
                                }
                            }
                        },
                        { ephemeralExpiration: store?.messages[id]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 }
                    );
                }
            }
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function LoadDataBase(sius, m) {
    try {
        const botNumber = await sius.decodeJid(sius.user.id);
        let game = global.db.game || {};
        let premium = global.db.premium || [];
        let event = global.db.events || {};
        let user = global.db.users[m.sender] || {};
        let setBot = global.db.set[botNumber] || {};
        let guilds = global.db.guilds || {};        
        global.db.game = game;
        global.db.users[m.sender] = user;
        global.db.set[botNumber] = setBot;
        global.db.events = event;
        global.db.guilds = guilds;
        const defaultGuilds = {
            template: {
                name: "",
                leader: "",
                members: [],
                level: 1,
                bank: {
                    money: 0,
                    wood: 0,
                    iron: 0,
                    string: 0,
                    milk: 0,
                    wool: 0,
                    egg: 0,
                    goldenEgg: 0
                }, 
                eventContribution: 0,
                lastUpgrade: 0
            }
        }
        if (Object.keys(guilds).length === 0) {
            guilds.template = defaultGuilds.template
        } else {
            for (let key in defaultGuilds.template) {
                if (!(key in guilds.template)) {
                    guilds.template[key] = defaultGuilds.template[key]
                }
            }
            for (let key in defaultGuilds.template.bank) {
                if (!(key in guilds.template.bank)) {
                    guilds.template.bank[key] = defaultGuilds.template.bank[key]
                }
            }
        }                
        const defaultSetBot = {
            lang: "id",
            limit: 0,
            uang: 0,
            status: 0,
            join: false,
            public: true,
            anticall: true,
            original: true,
            readsw: false,
            autobio: false,
            autoread: true,
            antispam: true,
            autotyping: true,
            grouponly: false,
            multiprefix: false,
            privateonly: false,
            autobackup: false,
            template: "documentButtonList",
        };
        for (let key in defaultSetBot) {
            if (!(key in setBot)) setBot[key] = defaultSetBot[key];
        }
        const limitUser = user.vip ? config.limit.vip : prem.checkPremiumUser(m.sender, premium) ? config.limit.premium : config.limit.free;
        const uangUser = user.vip ? config.money.vip : prem.checkPremiumUser(m.sender, premium) ? config.money.premium : config.money.free;
        const defaultUser = {
            vip: false,
            ban: false,
            name: "",
            afkTime: -1,
            afkReason: "",
            sessions: [],
            limit: limitUser,
            autodl: false,
            lastclaim: Date.now(),
            lastbegal: Date.now(),
            lastrampok: Date.now(),
            exp: 0,
            point: 0,
            registered: false,
            name: null,
            age: -1,
            regTime: -1,
            warn: 0,
            level: 1,
            role: "🦗 Beginner",
            title: "Petualang",
            lastProfile: 0,
            autolevelup: true,
            battleWins: 0,
            lastTopGuild: 0,
            guild: null,
            guildLastContribute: 0,
            totalProducts: 0,
            money: uangUser,
            health: 100,
            limit: 100,            
            eventContribution: 0,
            lastEventAction: 0,
            eventRewards: [],
            potion: 10,
            megaPotion: 0,
            petFood: 0,
            reviveStone: 0,
            wood: 0,
            rock: 0,
            string: 0,
            trash: 0,
            iron: 0,
            gold: 0,
            diamond: 0,
            emerald: 0,
            common: 0,
            uncommon: 0,
            mythic: 0,
            legendary: 0,
            pet: 0,
            activePet: null,
            pets: {},
            dog: 0,
            fox: 0,
            cat: 0,
            horse: 0,
            lastFed: 0,
            dogexp: 0,
            foxexp: 0,
            catexp: 0,
            horseexp: 0,            
            dogLevel: 0,
            foxLevel: 0,
            catngLevel: 0,
            horseLevel: 0,
            catLevel: 1,
            catExp: 0,
            doglastfeed: 0,
            foxlastfeed: 0,
            catlastfeed: 0,
            horselastfeed: 0,
            kandang: [],
            kandangCapacity: 10,
            kandangLevel: 1,
            kandangEfficiency: 1.0,
            kandangProduceCooldown: 86400000,
            lastKandangUpgrade: 0,
            lastCare: 0,
            products: {
                milk: 0,
                wool: 0,
                egg: 0,
                goldenEgg: 0
            },
            sapi: 0,
            banteng: 0,
            harimau: 0,
            gajah: 0,
            kambing: 0,
            panda: 0,
            buaya: 0,
            kerbau: 0,
            monyet: 0,
            ayam: 0,
            domba: 0,
            sword: 0,
            bow: 0,
            magicWand: 0,
            pickaxe: 0,
            fishingrod: 0,
            fishingrodlevel: 1,
            armor: 0,
            sworddurability: 0,
            swordmaxdurability: 100,
            bowdurability: 0,
            bowmaxdurability: 100,
            magicWanddurability: 0,
            magicmaxWanddurability: 0,
            pickaxedurability: 0,
            pickaxemaxdurability: 100,
            fishingroddurability: 0,
            fishingrodmaxdurability: 100,            
            armordurability: 0,
            armormaxdurability: 100,
            lastclaim: 0,
            lasthourly: 0,
            lastweekly: 0,
            lastmonthly: 0,
            lastadventure: 0,
            lastfishing: 0,
            lastdungeon: 0,
            lastduel: 0,
            lastmining: 0,
            lasthunt: 0,
            lastbuy: 0,
            lastbattle: 0,
            lastrepair: 0,
            lastInventory: 0,
            lastCare: 0,
            lastSlotSpin: 0,
            slotWins: 0,
            slotSpins: 0,
            autodl: false,
            others: {} // prepare for others thing
        }
        for (let key in defaultUser) {
            if (!(key in user)) user[key] = defaultUser[key];
        }        
        if (m.isGroup) {
            let group = global.db.groups[m.chat] || {};
            global.db.groups[m.chat] = group;
            const defaultGroup = {
                url: "",
                text: {},
                warn: {},
                tagsw: {},
                nsfw: false,
                mute: false,
                leave: false,
                setinfo: false,
                antilink: false,
                demote: false,
                antitoxic: false,
                promote: false,
                welcome: false,
                antivirtex: false,
                antitagsw: false,
                antidelete: false,
                antihidetag: false,
                waktusholat: false,
                setleave: "",
                setpromote: "",
                setdemote: "",
                setwelcome: "",
                adminonly: false
            };
            for (let key in defaultGroup) {
                if (!(key in group)) group[key] = defaultGroup[key];
            }
        }
        const defaultGame = {
            suit: {},
            chat_ai: {},
            menfes: {},
            tekateki: {},
            akinator: {},
            tictactoe: {},
            tebaklirik: {},
            kuismath: {},
            tebaklagu: {},
            tebakkata: {},
            family100: {},
            susunkata: {},
            tebakbom: {},
            tebakkimia: {},
            caklontong: {},
            tebakangka: {},
            tebaknegara: {},
            tebakgambar: {},
            tebakbendera: {},
            asahotak: {},
            tebakanime: {},
            siapakahaku: {}
        };
        for (let key in defaultGame) {
            if (!(key in game)) game[key] = defaultGame[key];
        }        
        const defaultEvents = {
            defaultActiveEvent: {
                type: "",
                name: "",
                startTime: 0,
                endTime: 0,
                goal: {},
                progress: {},
                participants: [],
                completed: false
            },
            activeEvent: null,
            lastEvent: 0
        }
        for (let key in defaultEvents) {
            if (!(key in event)) event[key] = defaultEvents[key];
        }                        
    } catch (e) {
        throw e;
    }
}

async function MessagesUpsert(sius, message, store, groupCache) {
    try {
        let botNumber = await sius.decodeJid(sius.user.id);
        const msg = message.messages[0];
        if (!store.groupMetadata || Object.keys(store.groupMetadata).length === 0) {
            store.groupMetadata ??= await sius.groupFetchAllParticipating().catch(e => ({}));
        }
        if (!store.messages[msg.key.remoteJid]?.array?.some(a => a.key.id === msg.key.id)) return;
        const type = msg.message ? (getContentType(msg.message) || Object.keys(msg.message)[0]) : "";
        //if (!msg.key.fromMe && !msg.message && message.type === "notify") return
        const m = await Serialize(sius, msg, store, groupCache);
        const feat = await import("./handler.js");
        feat.handler(sius, m, msg, store, groupCache);
        if (type === "interactiveResponseMessage" && m.quoted && m.quoted.fromMe) {
            await sius.appendResponseMessage(m, JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id);
        }
        if (global.db?.set[botNumber] && global.db?.set[botNumber]?.readsw) {
            if (msg.key.remoteJid === "status@broadcast") {
                await sius.readMessages([msg.key]);
                if (/protocolMessage/i.test(type)) sius.sendFromOwner(config.owner, "Status dari @" + msg.key.participant.split("@")[0] + " Telah dihapus", msg, { mentions: [msg.key.participant] });
                if (/(audioMessage|imageMessage|videoMessage|extendedTextMessage)/i.test(type)) {
                    let keke = (type == "extendedTextMessage") ? `Story Teks Berisi : ${msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : ""}` : (type == "imageMessage") ? `Story Gambar ${msg.message.imageMessage.caption ? "dengan Caption : " + msg.message.imageMessage.caption : ""}` : (type == "videoMessage") ? `Story Video ${msg.message.videoMessage.caption ? "dengan Caption : " + msg.message.videoMessage.caption : ""}` : (type == "audioMessage") ? "Story Audio" : "\nTidak diketahui cek saja langsung";
                    await sius.sendFromOwner(config.owner, `Melihat story dari @${msg.key.participant.split("@")[0]}\n${keke}`, msg, { mentions: [msg.key.participant] });
                }
            }
        }
    } catch (e) {
        throw e;
    }
}

export { GroupUpdate, GroupCacheUpdate, GroupParticipantsUpdate, LoadDataBase, MessagesUpsert };