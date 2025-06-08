import axios from 'axios'
import * as cheerio from 'cheerio'
import { exec } from 'child_process'
import fs from 'fs/promises'
import { promisify } from 'util'
const execPromise = promisify(exec)

async function bilibilidl(url, quality = '480P') {
  let aid = /\/video\/(\d+)/.exec(url)?.[1]
  if (!aid) throw new Error('ID video tidak ditemukan')
  let { data: html } = await axios.get(url)
  let $ = cheerio.load(html)
  let title = $('meta[property="og:title"]').attr('content')?.split('|')[0]?.trim()
  let type = $('meta[property="og:video:type"]').attr('content')
  let cover = $('meta[property="og:image"]').attr('content')
  let like = $('.interactive__btn.interactive__like .interactive__text').text()
  let views = $('.bstar-meta__tips-left .bstar-meta-text').first().text().replace(' Ditonton', '')
  let { data } = await axios.get('https://api.bilibili.tv/intl/gateway/web/playurl', {
    params: {
      s_locale: 'id_ID',
      platform: 'web',
      aid,
      qn: '64',
      type: '0',
      device: 'wap',
      tf: '0',
      spm_id: 'bstar-web.ugc-video-detail.0.0',
      from_spm_id: 'bstar-web.homepage.trending.all',
      fnval: '16',
      fnver: '0'
    }
  })
  let video = data?.data?.playurl?.video?.find(v => v.stream_info?.desc_words === quality)
  let videoUrl = video?.video_resource?.url || video?.video_resource?.backup_url?.[0]
  let audioUrl = data?.data?.playurl?.audio_resource?.[0]?.url || data?.data?.playurl?.audio_resource?.[0]?.backup_url?.[0]
  if (!videoUrl || !audioUrl) throw new Error('Gagal mengambil URL video/audio')

  async function downloadBuffer(url) {
    let buffers = [], start = 0, end = 5 * 1024 * 1024, size = 0
    while (true) {
      let range = `bytes=${start}-${end}`
      let res = await axios.get(url, {
        headers: {
          DNT: '1',
          Origin: 'https://www.bilibili.tv',
          Referer: 'https://www.bilibili.tv/video/',
          'User-Agent': 'Mozilla/5.0',
          Range: range
        },
        responseType: 'arraybuffer'
      })
      if (!size) size = parseInt(res.headers['content-range']?.split('/')[1] || 0)
      buffers.push(Buffer.from(res.data))
      if (end >= size - 1) break
      start = end + 1
      end = Math.min(start + 5 * 1024 * 1024 - 1, size - 1)
    }
    return Buffer.concat(buffers)
  }
  let videoBuffer = await downloadBuffer(videoUrl)
  let audioBuffer = await downloadBuffer(audioUrl)
  await fs.writeFile('v.mp4', videoBuffer)
  await fs.writeFile('a.mp3', audioBuffer)
  await execPromise(`ffmpeg -i "v.mp4" -i "a.mp3" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -f mp4 "out.mp4"`)
  let final = await fs.readFile('out.mp4')
  await Promise.all(['v.mp4', 'a.mp3', 'out.mp4'].map(f => fs.unlink(f).catch(() => {})))
  return { title, type, cover, like, views, buffer: final }
}

commands.add({
    name: ["bilibili"],
    command: ["bilibili"],
    category: "anime",
    limited: true,
    desc: "mengunduh video bilibili",
    run: async({ sius,m, args, Func }) => {
        try {
            if (!args[0]) return m.reply('[×] Sertakan link bilibili yang ingin diunduh')
            m.reply({ react:{ text: "🕣", key: m.key }})
            let { buffer } = await bilibilidl(args[0])
            await m.reply({ video: buffer })
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})