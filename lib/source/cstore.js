import fs from "fs"
import pino from "pino"

export default (function makeCustomStore(config = {}) {
    const logger = config.logger || pino({ level: "silent" })

    const chats = new Map()
    const messages = new Map()
    const contacts = new Map()
    const groupMetadata = new Map()

    function bind(ev) {
        ev.on("messages.upsert", ({ messages: newMessages }) => {
            for (const msg of newMessages) {
                const jid = msg.key.remoteJid
                if (!messages.has(jid)) messages.set(jid, new Map())
                messages.get(jid).set(msg.key.id, msg)
            }
        })

        ev.on("chats.set", ({ chats: newChats }) => {
            for (const chat of newChats) chats.set(chat.id, chat)
        })

        ev.on("contacts.set", (newContacts) => {
            for (const contact of newContacts) contacts.set(contact.id, contact)
        })

        ev.on("groups.update", (updates) => {
            for (const group of updates) groupMetadata.set(group.id, group)
        })
    }

    async function loadMessage(jid, id) {
        const msg = messages.get(jid)?.get(id)
        return msg ? { ...msg } : undefined
    }

    function writeToFile(path = "./store.json") {
        const data = {
            chats: Object.fromEntries(chats),
            contacts: Object.fromEntries(contacts),
            groupMetadata: Object.fromEntries(groupMetadata),
            messages: Object.fromEntries([...messages].map(([jid, msgs]) => [jid, Object.fromEntries(msgs)])),
        }
        fs.writeFileSync(path, JSON.stringify(data, null, 2))
    }

    function readFromFile(path = "./store.json") {
        if (!fs.existsSync(path)) return
        const data = JSON.parse(fs.readFileSync(path))
        if (data.chats) for (const [id, chat] of Object.entries(data.chats)) chats.set(id, chat)
        if (data.contacts) for (const [id, contact] of Object.entries(data.contacts)) contacts.set(id, contact)
        if (data.groupMetadata) for (const [id, meta] of Object.entries(data.groupMetadata)) groupMetadata.set(id, meta)
        if (data.messages) {
            for (const [jid, msgs] of Object.entries(data.messages)) {
                messages.set(jid, new Map(Object.entries(msgs)))
            }
        }
    }

    return {
        chats,
        messages,
        contacts,
        groupMetadata,
        bind,
        writeToFile,
        readFromFile,
        loadMessage,
        logger,
    }
})()