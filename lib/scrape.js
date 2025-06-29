/**
* DannTeam
* ig: @neverdanzyy
* Hyzer official
* ig: @sius.psrb
*/

import axios from 'axios'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch'
import FormData from 'form-data'
import ytdl from 'ytdl-core'
import yts from 'yt-search'

// settings
global.creator = 'danzy | siuspsrb' // credits 🦾

const pinterest = async (query) => {
    try {
        let url = 'https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(query)
        let res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        })
        let text = await res.text()
        let matches = [...text.matchAll(/'url':'(https:\/\/i\.pinimg\.com[^']+)'/g)]
        let results = matches.map(m => m[1].replace(/\\u002F/g, '/'))
        return results
    } catch (err) {
        console.error(err)
        return []
    }
}

// Scraper (all)
async function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux Android 10 K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      })
      const videos = response.data.data.videos
      if (videos.length === 0) {
        reject('Tidak ada video ditemukan.')
      } else {
        const dann = Math.floor(Math.random() * videos.length)
        const videorndm = videos[dann]

        const result = {
          author: creator,
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        }
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  })
}

function styleText(text) {
  return new Promise((resolve,
    reject) => {
    axios.get('http://qaz.wtf/u/convert.cgi?text=' + text)
    .then(({
      data
    }) => {
      let $ = cheerio.load(data)
      let result = []
      $('table > tbody > tr').each(function (a, b) {
        result.push({
          author: creator,
          text: $(b).find('td:nth-child(2)').text().trim()
        })
      }),
      resolve(result)
    })
  })
}

async function remini2(buffer, method = 'recolor') {
	return new Promise(async (resolve, reject) => {
		try {
			const form = new FormData();
			const input = Buffer.from(buffer);
			form.append('model_version', 1);
			form.append('image', input, { filename: 'enhance_image_body.jpg', contentType: 'image/jpeg'  });
			const { data } = await axios.post('https://inferenceengine.vyro.ai/' + method, form, {
				headers: {
					...form.getHeaders(),
					'accept-encoding': 'gzip',
					'user-agent': 'Postify/1.0.0',
				},
				responseType: 'arraybuffer',
			});
			resolve(data)
		} catch (e) {
			reject(e)
		}
	});
}

async function search(query) {
  return new Promise((resolve, reject) => {
    try {
      const cari = yts(query)
      .then((data) => {
        res = data.all
        return res
      })
      resolve(cari)
    } catch (error) {
      reject(error)
    }
    console.log(error)
  })
}

const clean = e => (e = e.replace(/(<br?\s?\/>)/gi, ' \n')).replace(/(<([^>] )>)/gi, '')

async function shortener(e) {
  return e
}

async function tiktok2(url) {
  return new Promise(async (resolve, reject) => {
    try {
      let t = await axios('https://lovetik.com/api/ajax/search', {
        method: 'post', data: new URLSearchParams(Object.entries({
          query: url
        }))
      })

      const result = {}
      result.developer = creator
      result.title = clean(t.data.desc)
      result.author = clean(t.data.author)
      result.nowm = await shortener((t.data.links[0].a || '').replace('https',
        'http'))
      result.watermark = await shortener((t.data.links[1].a || '').replace('https',
        'http'))
      result.audio = await shortener((t.data.links[2].a || '').replace('https',
        'http'))
      result.thumbnail = await shortener(t.data.cover)

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

function tebakgambar() {
  return new Promise(async(resolve, reject) => {
    axios.get('https://jawabantebakgambar.net/all-answers/')
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = []
      let random = Math.floor(Math.random() * 2836) + 2
      let link2 = 'https://jawabantebakgambar.net'
      $(`#images > li:nth-child(${random}) > a`).each(function(a, b) {
        const img = link2 + $(b).find('img').attr('data-src')
        const jwb = $(b).find('img').attr('alt')
        result.push({
          author: creator,
          image: img,
          jawaban: jwb
        })

        resolve(result)
      })
    })
    .catch(reject)
  })
}

function linkwa(nama) {
  return new Promise((resolve,
    reject) => {
    axios.get('http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search='+ nama +'&searchby=name')
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = []
      const lnk = []
      const nm = []
      $('div.wa-chat-title-container').each(function(a, b) {
        const limk = $(b).find('a').attr('href')
        lnk.push(limk)
      })
      $('div.wa-chat-title-text').each(function(c, d) {
        const name = $(d).text()
        nm.push(name)
      })
      for (let i = 0; i < lnk.length; i++) {
        result.push({
          author: creator,
          nama: nm[i].split('. ')[1],
          link: lnk[i].split('?')[0]
        })
      }
      resolve(result)
    })
    .catch(reject)
  })
}

function SepakBola() {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        data
      } = await axios.get('https://www.jadwaltv.net/jadwal-sepakbola')
      const $ = cheerio.load(data)
      let tv = []
      $('table.table.table-bordered > tbody > tr.jklIv').each((u, i) => {
        let an = $(i).html().replace(/<td>/g, '').replace(/<\/td>/g, ' - ')
        tv.push(`${an.substring(0, an.length - 3)}`)
      })
      if (tv.every(x => x === undefined)) return resolve({
        message: 'Tidak ada result!'
      })
      resolve(tv)
    } catch (err) {
      console.error(err)
    }
  })
}

async function growtopiaItems(nameItem) {
  try {
    const itemListResponse = await axios.get('https://growtopia.fandom.com/api/v1/SearchSuggestions/List?query=' + nameItem)
    const itemList = itemListResponse.data.items

    if (itemList.length === 0) {
      return null
    }

    const itemName = itemList[0].title
    const link = `https://growtopia.wikia.com/wiki/${itemName}`

    const getDataResponse = await axios.get(link)
    const $ = cheerio.load(getDataResponse.data)

    const Description = $('.card-text').first().text()
    const Properties = $('#mw-content-text > div > div.gtw-card.item-card > div:nth-child(4)')
    .text()
    .trim()
    .split(/[\.+\!]/)
    .filter((d) => d !== '')

    const Sprite = $('div.card-header .growsprite > img').attr('src')
    const Color = $('.seedColor > div').text().trim().split(' ')
    const Rarity = $('.card-header b > small').text().match(/(\d+)/)
    const Recipe = $('.recipebox table.content')
    .last()
    .text()
    .trim()
    .split(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/)
    .map((el) => el.trim())
    const Splice = $('.bg-splice').text()
    const Info = $('#mw-content-text > div > p:nth-child(3)').text().trim()
    const Type = $('table.card-field tr:nth-child(1) > td')
    .text()
    .split(' ')
    .pop()

    const dataList = {
      Name: itemName,
      URL: link.replace(/ /g, '_'),
      Description,
      Properties: Properties.length > 0 ? Properties: undefined,
      Sprite,
      Color,
      Rarity: Rarity !== null ? parseInt(Rarity[0]): undefined,
      Recipe: Recipe.length > 0
      ? {
        type: Recipe.shift() || '',
        recipe: Recipe,
      }: undefined,
      Splice: Splice.length > 0 ? Splice: undefined,
      Info,
      Type,
    }

    if (itemList.length > 1 && nameItem.toLowerCase() !== itemName.toLowerCase()) {
      const matches = itemList.map((i) => i.title)
      dataList.matches = matches
    }

    return dataList
  } catch (e) {
    console.error(e)
    return null
  }
}

async function chord(query) {
  const search = await axios.get(
    `https://www.gitagram.com/?s=${encodeURIComponent(query).replace(
      /%20/g,
      '+'
    )}`
  )
  const $ = await cheerio.load(search.data)
  const $url = $('table.table > tbody > tr')
  .eq(0)
  .find('td')
  .eq(0)
  .find('a')
  .eq(0)
  const url = $url.attr('href')
  const song = await axios.get(url)
  const $song = await cheerio.load(song.data)
  const $hcontent = $song('div.hcontent')
  const artist = $hcontent.find('div > a > span.subtitle').text().trim()
  const artistUrl = $hcontent.find('div > a').attr('href')
  const title = $hcontent.find('h1.title').text().trim()
  const chord = $song('div.content > pre').text().trim()
  const res = {
    url: url,
    artist,
    artistUrl,
    title,
    chord,
  }
  return res
}

async function tiktok(url) {
	return new Promise(async (resolve, reject) => {
		try {
			let data = []
			function formatNumber(integer) {
				let numb = parseInt(integer)
				return Number(numb).toLocaleString().replace(/,/g, '.')
			}
			
			function formatDate(n, locale = 'en') {
				let d = new Date(n)
				return d.toLocaleDateString(locale, {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric'
				})
			}
			
			let domain = 'https://www.tikwm.com/api/';
			let res = await (await axios.post(domain, {}, {
				headers: {
					'Accept': 'application/json, text/javascript, */*; q=0.01',
					'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Origin': 'https://www.tikwm.com',
					'Referer': 'https://www.tikwm.com/',
					'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
					'Sec-Ch-Ua-Mobile': '?1',
					'Sec-Ch-Ua-Platform': 'Android',
					'Sec-Fetch-Dest': 'empty',
					'Sec-Fetch-Mode': 'cors',
					'Sec-Fetch-Site': 'same-origin',
					'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
					'X-Requested-With': 'XMLHttpRequest'
				},
				params: {
					url: url,
					hd: 1
				}
			})).data.data
			if (res && !res.size && !res.wm_size && !res.hd_size) {
				res.images.map(v => {
					data.push({ type: 'photo', url: v })
				})
			} else {
				if (res && res.wmplay) {
					data.push({ type: 'watermark', url: res.wmplay })
				}
				if (res && res.play) {
					data.push({ type: 'nowatermark', url: res.play })
				}
				if (res && res.hdplay) {
					data.push({ type: 'nowatermark_hd', url: res.hdplay })
				}
			}
			let json = {
				status: true,
				title: res.title,
				taken_at: formatDate(res.create_time).replace('1970', ''),
				region: res.region,
				id: res.id,
				durations: res.duration,
				duration: res.duration + ' Seconds',
				cover: res.cover,
				size_wm: res.wm_size,
				size_nowm: res.size,
				size_nowm_hd: res.hd_size,
				data: data,
				music_info: {
					id: res.music_info.id,
					title: res.music_info.title,
					author: res.music_info.author,
					album: res.music_info.album ? res.music_info.album : null,
					url: res.music || res.music_info.play
				},
				stats: {
					views: formatNumber(res.play_count),
					likes: formatNumber(res.digg_count),
					comment: formatNumber(res.comment_count),
					share: formatNumber(res.share_count),
					download: formatNumber(res.download_count)
				},
				author: {
					id: res.author.id,
					fullname: res.author.unique_id,
					nickname: res.author.nickname,
					avatar: res.author.avatar
				}
			}
			resolve(json)
		} catch (e) {
			reject(e)
		}
	});
}

async function igdl(url) {
    const res = await fetch('https://igram.io/api/ajaxSearch', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({ q: url })
    })
    const json = await res.json()
    const hasil = []
    if (json && json.data && json.data.medias) {
        for (let media of json.data.medias) {
            hasil.push({
                type: media.type, // video / image
                url: media.url
            })
        }
    }
    return hasil
}

async function googleImage(query) {
   const data = await (await fetch(`https://www.google.com/search?q=${query}&tbm=isch`, {
      headers: {
         accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
         'accept-encoding': 'gzip, deflate, br',
         'accept-language': 'en-US,en;q=0.9,id;q=0.8',
         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
      }
   })).text();
   const $ = cheerio.load(data);
   const pattern = /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm;
   const matches = $.html().matchAll(pattern);
   const decodeUrl = (url) => decodeURIComponent(JSON.parse(`"${url}"`));
   return [...matches]
   .map(({
      groups
   }) => decodeUrl(groups === null || groups === void 0 ? void 0 : groups.url))
   .filter((v) => /.*\.jpe?g|png$/gi.test(v));
}

async function remini(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res
					.on("data", function (chunk, resp) {
						data.push(chunk);
					})
					.on("end", () => {
						resolve(Buffer.concat(data));
					});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}

async function pollai(question, { systemMessage = null, model = "gpt-4.1-mini", imageBuffer = null } = {}) {
    const modelList = {
        "gpt-4.1": "openai-large",
        "gpt-4.1-mini": "openai",
        "gpt-4.1-nano": "openai-fast"
    }
    if (!question) throw new Error("Pertanyaan tidak boleh kosong")
    if (!modelList[model]) throw new Error(`Model tersedia: ${Object.keys(modelList).join(", ")}`)
    const messages = [
        ...(systemMessage ? [{ role: "system", content: systemMessage }] : []),
        {
            role: "user",
            content: [{ type: "text", text: question }]
        }
    ]
    const { data } = await axios.post(
        "https://text.pollinations.ai/openai",
        {
            messages,
            model: modelList[model],
            temperature: 0.5,
            presence_penalty: 0,
            top_p: 1,
            frequency_penalty: 0
        },
        {
            headers: {
                accept: "*/*",
                authorization: "Bearer dummy",
                "content-type": "application/json",
                origin: "https://sur.pollinations.ai",
                referer: "https://sur.pollinations.ai/",
                "user-agent": "Mozilla/5.0 (Linux; Android 10)"
            }
        }
    )
    return data.choices[0].message.content
}

async function AI(question, { systemMessage = null, model = "gpt-4.1-mini", imageBuffer = null } = {}) {
    const modelList = {
        "gpt-4.1": "openai-large",
        "gpt-4.1-mini": "openai",
        "gpt-4.1-nano": "openai-fast"
    };
    if (!question) throw new Error("Pertanyaan tidak boleh kosong");
    if (!modelList[model]) throw new Error(`Model tersedia: ${Object.keys(modelList).join(", ")}`);
    const messages = [
        ...(systemMessage ? [{ role: "system", content: systemMessage }] : []),
        {
            role: "user",
            content: [
                { type: "text", text: question },
                ...(imageBuffer
                    ? [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBuffer.toString("base64")}`
                            }
                        }
                    ]
                    : [])
            ]
        }
    ];
    const { data } = await axios.post(
        "https://text.pollinations.ai/openai",
        {
            messages,
            model: modelList[model],
            temperature: 0.5,
            presence_penalty: 0,
            top_p: 1,
            frequency_penalty: 0
        },
        {
            headers: {
                accept: "*/*",
                authorization: "Bearer dummy",
                "content-type": "application/json",
                origin: "https://sur.pollinations.ai",
                referer: "https://sur.pollinations.ai/",
                "user-agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
            }
        }
    );
    return data.choices[0].message.content;
}

async function youtube(url) {
    const headers = {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://id.ytmp3.mobi/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };
    const initial = await fetch(`https://d8.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
    const init = await initial.json();
    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
    const getDownloadURL = async (format) => {
        let convertURL = init.convertURL + `&v=${id}&f=${format}&_=${Math.random()}`;
        const converts = await fetch(convertURL, { headers });
        const convert = await converts.json();
        if (convert.error !== 0) {
            throw new Error("⚠️ Gagal mendapatkan URL konversi");
        }
        let info = {};
        for (let i = 0; i < 5; i++) { 
            const j = await fetch(convert.progressURL, { headers });
            info = await j.json();
            if (info.progress === 3) break;
            await new Promise(res => setTimeout(res, 2000)); 
        }
        if (info.progress !== 3) {
            throw new Error("⚠️ Konversi gagal atau terlalu lama");
        }
        return { url: convert.downloadURL, title: info.title || "Unknown Title" };
    };
    const mp3Result = await getDownloadURL('mp3');
    const mp4Result = await getDownloadURL('mp4');
    return {
        urlmp3: mp3Result.url,
        urlmp4: mp4Result.url,
        title: mp4Result.title
    };
}
  
const listnya = {
  pinterest,
  tiktok,
  tiktok2,
  tiktoks,
  search,
  linkwa,
  remini,
  growtopiaItems,
  chord,
  tebakgambar,
  styleText,
  SepakBola,
  igdl,
  googleImage,
  remini,
  youtube,
  remini2,
  pollai,
  AI
}

export default listnya