import { formatExpired } from '../../lib/sewa.js'

export default {
    name: 'sewa-notify',
    exec: async ({ sius,m }) => {
    const now = Date.now()
    if (!m.isGroup) return false
    const oneDay = 24 * 60 * 60 * 1000
    for (const [jid, group] of Object.entries(db.groups)) {
        if (group.expired && (group.expired - now) <= oneDay && (group.expired - now) > 0) {
            const sewaData = db.sewa[jid]
            if (sewaData?.owner) {
            const remaining = formatExpired(group.expired - now)
            await sius.sendMessage(sewaData.owner, {
                text: `⚠️ Pemberitahuan!\n▢ Grup: ${jid}\n▢ Akan expired dalam: ${remaining}\n▢ Tanggal expired: ${new Date(group.expired).toLocaleString()}`
            })
            }
        }
    }
    return false
    }
}