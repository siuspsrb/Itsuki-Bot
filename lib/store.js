import pino from "pino"
import baileys from "baileys"

const { makeInMemoryStore } = baileys

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) })

export default store