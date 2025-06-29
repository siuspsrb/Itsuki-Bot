import axios from "axios"
import * as cheerio from "cheerio"

commands.add({
    name: ["capcutstalk"],
    command: ["capcutstalk"],
    category: "stalk",
    alias: ["stalkcapcut"],
    desc: "melihat info profil capcut dari link yang dimasukkan",
    run: async({ sius, m, args, Func }) => {
        let text = args.join(" ")
        if (!text) return m.reply('Mana Url Profile Nya\n\n*Example :* .capcutstalk https://www.capcut.com/discover/creator/ljVrE3pkAhfVxcIF56Gbshz9PaGpb31tMfdbBIyUkfOe4Ug=')
        try {
            const result = await scrapeCapcutStalk(text)
            let teks = `*▢ Username:* ${result.username}\n`;
            teks += `*▢ Followers:* ${result.followers}\n`;
            teks += `*▢ Likes:* ${result.likes}\n`;
            teks += `*▢ Description:* ${result.description || '-'}\n\n`;
    
            teks += `*▢ Total Template ${result.templates.length}:*\n`;
    
            for (let i = 0; i < result.templates.length; i++) {
                const template = result.templates[i];
                teks += `\n${i+1}. Title : ${template.title}\n`;
                teks += `     Views : ${template.views}\n`;
                teks += `     Upload Date : ${template.date}\n`;
                teks += `     Link : ${template.link}\n`;
            }
    
            if (result.templates.length > 0 && result.templates[0].thumb) {
                await m.reply({ image: { url: result.templates[0].thumb }, caption: teks })
            } else {
                m.reply(teks);
            }
        } catch (e) {
            sius.cantLoad(e)
        }
    }
})
 
async function scrapeCapcutStalk(url) {
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
        },
    });
    const $ = cheerio.load(data);
    const username = $('h1.title-pYC_U9').text().trim();
    const stats = $('div.achieveItem-wjNBbI span.count-qWlNP9').map((i, el) => $(el).text()).get();
    const description = $('div.desc-wvyE3k').text().trim();
    const templates = [];
    $('.verticalLayout-sDNbmV').each((i, el) => {
        const title = $(el).find('.titleBox-BXSEc3').text().trim();
        const views = $(el).find('.cut-label .text').text().trim();
        const date = $(el).find('.tips-TuKRyG').text().trim();
        const thumb = $(el).find('.pictureImg-kT3IMQ').attr('src');
        const link = 'https://www.capcut.com' + $(el).find('a').first().attr('href');
 
        templates.push({ title, views, date, thumb, link });
    })
    return {
        username,
        followers: stats[1],
        likes: stats[2],
        description,
        templates
    };
}