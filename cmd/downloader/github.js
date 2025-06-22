import fetch from "node-fetch"

commands.add({
    name: ["gitclone"],
    command:  ["gitclone"],
    alias: ["githubclone","git"],
    category: "downloader",
    usage: "<repository>",
    desc: "Laman pengunduh repository GitHub secara langsung!",
    limit: 10,
    query: true,
    example: "https://github.com/siuspsrb/Itsuki-Bot",
    run: async ({ sius, m, text, Func, dl }) => {
        let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
        let linknya = text
        if (!regex1.test(linknya)) return m.reply("Link salah!");
        let [, user, repo] = args[0].match(regex1) || []
        repo = repo.replace(/.git$/, "")
        let url = `https://api.github.com/repos/${user}/${repo}/zipball`
        let filename = (await fetch(url, {
            method: "HEAD"
        })).headers.get("content-disposition").match(/attachment; filename=(.*)/)[1]
        m.reply("[√] Cloning repository...").then(() => {
            m.reply({
                document: { url: url },
                fileName: filename, 
                mimetype: "application/zip"
            })
            .catch((e) => sius.cantLoad(e))
        })
    }
})