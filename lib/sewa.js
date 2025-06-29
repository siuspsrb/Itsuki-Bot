import { delay } from 'baileys'

export const addSewa = async (jid, ms, meta = {}) => {
    const expired = Date.now() + ms
    db.groups[jid] = db.groups[jid] || {}
    db.groups[jid].expired = expired
    db.sewa[jid] = {
        ...meta,
        jid,
        expired,
        created: Date.now()
    }
    return true
}

export const extendSewa = async (jid, ms) => {
    if (!db.groups[jid]?.expired) return false
    db.groups[jid].expired += ms
    db.sewa[jid].expired = db.groups[jid].expired
    return true
}

export const delSewa = async (jid) => {
    delete db.groups[jid]?.expired
    delete db.sewa[jid]
    return true
}

export const cekSewa = (jid) => {
    return db.sewa[jid] || false
}

export const cekExpired = (jid) => {
    if (!db.groups[jid]?.expired) return false
    return db.groups[jid].expired < Date.now()
}

export const listSewa = () => {
    return Object.values(db.sewa)
}

export const formatExpired = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / (3600 * 24))
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    let result = []
    if (days > 0) result.push(`${days} hari`)
    if (hours > 0) result.push(`${hours} jam`)
    if (minutes > 0) result.push(`${minutes} menit`)
    if (seconds > 0) result.push(`${seconds} detik`)

    return result.join(' ') || '0 detik'
}

export const parseTime = (text) => {
    const timeUnits = {
        detik: 1000,
        sekon: 1000,
        second: 1000,
        seconds: 1000,
        menit: 60000,
        minute: 60000,
        minutes: 60000,
        jam: 3600000,
        hour: 3600000,
        hours: 3600000,
        hari: 86400000,
        day: 86400000,
        days: 86400000,
        minggu: 604800000,
        week: 604800000,
        weeks: 604800000,
        bulan: 2592000000,
        month: 2592000000,
        months: 2592000000,
        tahun: 31536000000,
        year: 31536000000,
        years: 31536000000
    }

    const parts = text.toLowerCase().split(/\s+/)
    let totalMs = 0

    for (let i = 0; i < parts.length; i++) {
        const num = parseInt(parts[i])
        if (isNaN(num)) continue

        const unit = parts[i + 1]
        if (!unit || !timeUnits[unit]) continue

        totalMs += num * timeUnits[unit]
        i++
    }

    return totalMs
}

export const getGroupJidFromLink = async (link, sock) => {
    try {
        if (!link.includes('chat.whatsapp.com/')) return false
        const code = link.split('chat.whatsapp.com/')[1].split('/')[0].split('?')[0]
        const jid = await sock.groupGetInviteInfo(code)
        return jid
    } catch {
        return false
    }
}