import { cekExpired, delSewa } from '../../lib/sewa.js'


export default {
    name: 'sewa-autoleave',
    exec: async ({ sius, m }) => {
        const now = Date.now()
        if (!m.isGroup) return false
        const groups = Object.entries(db.groups)
        for (const [jid, group] of groups) {
            if (group.expired && group.expired < now) {
                try {
                    await sius.sendMessage(jid, {
                        text: "[√] Waktu sewa *Expired*" +
                             "\n\n> Bot akan keluar:)",
                    })
                    await sius.groupLeave(jid)
                    await delSewa(jid)
                    await delay(2000)
                } catch {}
                return true
            }
        }
        return false
    }
}