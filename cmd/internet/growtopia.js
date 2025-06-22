commands.add({
  name: ["growtopia"],
  command: ["growtopia"],
  limit: true,
  param: "<name>",
  desc: "Searching information of growtopia items",
  category: "search",
  run: async ({ sius, m, args, Func, dl }) => {
    const text = args.join(" ")
    if (!text) return m.reply("Masukin nama itemnya...\nContoh: .growtopia chand")
    const data = await dl.growtopiaItems(text)
    if (!data) return m.reply("Item ga ketemu bang, coba nama lain!")
    let teks = `🧱 *Growtopia Item Info*\n\n`
    teks += `*Nama:* ${data.Name}\n`
    teks += `*Type:* ${data.Type || "?"}\n`
    teks += `*Rarity:* ${data.Rarity ?? "Unknown"}\n`
    teks += `*Color:* ${data.Color?.join(" ") || "Ga ada info"}\n`
    teks += `*Splice:* ${data.Splice || "Tidak tersedia"}\n`
    teks += `\n*Deskripsi:* ${data.Description}\n`
    if (data.Recipe) {
      teks += `\n*Resep (${data.Recipe.type}):*\n- ${data.Recipe.recipe.join("\n- ")}\n`
    }
    if (data.Properties) {
      teks += `\n*Properties:*\n- ${data.Properties.join("\n- ")}\n`
    }
    if (data.Info) {
      teks += `\n*Info tambahan:* ${data.Info}\n`
    }
    if (data.matches) {
      teks += `\n🔎 *Kemungkinan lain:*\n- ${data.matches.join("\n- ")}`
    }
    m.reply(teks, {
      contextInfo: {
        externalAdReply: {
          title: data.Name,
          body: "Growtopia Item Info",
          thumbnailUrl: data.Sprite,
          sourceUrl: data.URL,
          previewType: "PHOTO",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    })
  }
})