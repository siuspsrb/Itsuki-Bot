### ITSUKI SIMPLE WHATSAPP BOT BASE
<img src="https://i.pinimg.com/originals/20/15/4a/20154a72a9b841345cb3f7ad8ba8683a.jpg" alt="ITSUKI NAKANO" width="450" />

[![JavaScript](https://img.shields.io/badge/JavaScript-d6cc0f?style=for-the-badge&logo=javascript&logoColor=white)](https://javascript.com) [![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

<p align="left">
  Base Whatsapp Bot simple, rapi terstruktur, yang dapat kamu gunakan sebagaimana mungkin dengan mudah, gampang tanpa banyak kendala.
</p>

---

## SETTINGS

Isi semua informasi bot di file [`settings.js`](https://github.com/siuspsrb/Itsuki-Bot-4.0/blob/master/settings.js)<br />

---

## ITSUKI BOT ROOM
[![WHATSAPP](https://img.shields.io/badge/WhatsApp%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/CS8hCYxwnj5CAuo7XeZNa3) 

---

### CONNECTION

```js
process.argv.includes('--qr')           // tampilkan QR di terminal
process.argv.includes('--pairing-code') // pakai kode pairing
```
CONTOH:
```bash
node index.js --qr
node index.js --pairing-code
```

---

### ⚠️ WAJIB! 

Isi Nomor Botnya, Buka file [`settings.js`](https://github.com/siuspsrb/Itsuki-Bot-4.0/blob/master/settings.js)

Edit:
```js
bot.number = "6280303838" // ganti dengan nomor botmu
```

Tanpa ini, bot gak bisa jalan.

---

## TERMUX USER
```bash
$ pkg upgrade && pkg update
$ pkg install nodejs
$ pkg install ffmpeg
$ pkg install libwebp
$ pkg install imagemagick
$ pkg install git
$ pkg install yarn
$ gitclone https://github.com/siuspsrb/Itsuki-Bot-4.0
$ cd Itsuki-Bot-4.0
$ yarn
$ node .
```
---

## HIGHLIGHTS

-   [x] Simple Penggunaan,
-   [x] Mudah digunakan,
-   [x] Stabil,
-   [x] Ringan
-   [x] Ga Pasaran
-   [x] Terstruktur Rapi
-   [x] Pairing Code
-   [x] Qr Code

---

## STRUKTUR COMMANDS 

Untuk menambahkan fitur, cukup tambahkan file .js dengan format dibawah didalam folder [`cmd`](https://github.com/siuspsrb/Itsuki-Bot-4.0/blob/master/lib/cmd/)

```js
commands.add({
    name: ['nama1','nama2', ...], // nama event
    command: ['nama1', 'nama2', ...], // trigger command
    alias: ['alias1', 'alias2'], // alias command (opsional)
    category: 'fun', // kategori menu
    desc: 'deskripsi fitur',
    admin: false,    // true jika hanya admin grup
    group: false,    // true jika hanya bisa dipakai di grup
    botAdmin: false, // true jika bot harus admin
    owner: false,    // true jika hanya owner bot
    premium: false,  // true jika hanya premium user
    limit: 5,  // memakai 5 limit
    cooldown: 10, // 10 detik cooldown fitur
    query: true, // true jika membutuhkan input text dari user
    usage: "<text>", // param tampilan menu
    example: "https://github..", // contoh input text yang akan diberikan
    register: true, // harus daftar fulu
    level: 2, // minimal level 2 biar dpt akses
    run: async ({ sius, m, text, args, Func, dl }) => {
    // Logic fitur disini
    }
})
```

## COMMANDS METHOD
```js
commands.add(event)               // tambah fitur ke sistem
commands.remove(name)            // hapus command by name[0]
commands.findCommand(query)      // cari command/alias
commands.setCommandState(name, bool) // enable/disable command
commands.getAllCommands(filters) // ambil semua command (bisa difilter)
commands.getByCategory(category) // ambil command per kategori
commands.getCategories()         // ambil semua kategori unik
commands.incrementUsage(name)    // tambahkan counter + update lastUsed
commands.getStats(name?)         // statistik (usage & waktu pakai)
commands.checkCooldown(name, userId) // cek apakah user dalam cooldown
commands.setCooldown(name, userId)   // set cooldown untuk user
commands.reset()                 // hapus semua command dari memory
```

### PROPERTI COMMANDS

```js
{
  name: ["cekcmd"],           // (required) nama internal command
  command: ["cekcmd"],        // (required) trigger command utama
  alias: ["infocmd"],         // (optional) alias tambahan
  category: "utility",        // (required) kategori fitur
  desc: "cek info command",   // (optional) deskripsi singkat
  usage: "<query>",           // (optional) format cara pakai
  example: "menu",            // (optional) contoh pemakaian, query nya aja g usah ikut commandny
  param: "<text>",            // (optional) fallback argumen kalau kosong
  cooldown: 10,               // (optional) jeda per user (detik)
  limit: 2,                   // (optional) pakai limit user?
  premium: false,             // (optional) hanya user premium?
  level: 5,                   // (optional) minimal level user
  owner: false,               // (optional) hanya owner?
  group: false,               // (optional) hanya di grup?
  admin: false,               // (optional) hanya admin grup?
  botAdmin: false,            // (optional) bot harus admin?
  private: false,             // (optional) hanya di private chat?
  register: false,            // (optional) butuh register user?
  enable: true,               // (optional) aktif/nonaktif
  hidden: false,              // (optional) disembunyikan dari menu
  privatechat: false,         // (optional) hanya di private chat?
  dependencies: [],           // (optional) list module yg wajib ada

  run: async ({ sius, m, args, text, Func, dl }) => {} // (required) fungsi eksekusi
}
```


### CONTOH COMMAND

```js
commands.add({
    name: ['say'],
    command: ['say'],
    alias: ['ucap'],
    category: 'fun',
    desc: 'Bot akan mengulang teks yang kamu kirim',
    admin: false,
    group: false,
    botAdmin: false,
    owner: false,
    premium: false,
    limited: false,
    run: async ({ m, args }) => {
        if (!args[0]) return m.reply('Contoh: .say halo dunia!')
        m.reply(args.join(' '))
    }
})
```

---

### CAROUSEL MESSAGE

```js
sius.sendCarousel('628xxxx@s.whatsapp.net', 'Cek promo terbaru kami!', [
    {
        header: {
            image: 'https://telegra.ph/file/0c06df94c1d8f5bd82d64.jpg'
        },
        body: {
            title: 'Promo Spesial',
            subtitle: 'Diskon 70%!',
            description: 'Berlaku sampai 10 Juni 2025'
        },
        nativeFlowMessage: {
        buttons: [
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'Lihat Sekarang',
                url: 'https://tokomu.com/promo'
            })
        }
        ]
        }
    },
    {
        header: {
            image: 'https://telegra.ph/file/d5e8a1fa7588e7e3dba1d.jpg'
        },
        body: {
            title: 'Voucher Gratis Ongkir',
            subtitle: 'Khusus pengguna baru',
            description: 'Claim sebelum kehabisan'
        },
        nativeFlowMessage: {
        buttons: [
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'Claim Sekarang',
                url: 'https://tokomu.com/voucher'
            })
        }
        ]
    }
    }
], null, {
  footer: 'Powered by ©siuspsrb'
})
```
---

### BUTTON MESSAGE

```js
sius.sendButton('628xxxx@s.whatsapp.net', [
    ['Tombol 1', '.command1'],
    ['Tombol 2', '.command2']
], {
    text: 'Pilih salah satu tombol di bawah ini:',
    footer: 'Powered by ©siuspsrb'
})
```

```js
sius.sendButton('628xxxx@s.whatsapp.net', [
    ['Lihat Promo', '.promo'],
    ['Menu Lain', '.menu']
], {
    image: { url: 'https://telegra.ph/file/abc123.jpg' },
    caption: 'Promo Hari Ini 🔥',
    footer: 'Klik tombol di bawah'
})
```

---

### CONTACT MESSAGE

```js
sius.sendContact('628xxxx@s.whatsapp.net', ['6281234567890', '6289876543210'], m)
```

---

### CHANNEL FORWARD PREVIEW

```js
sius.adChannel(
    'Update baru dari bot!',      // isi pesan utama
    {
        txt: 'sius.bot update',     // nama channel yg muncul
        title: 'Cek Channel Kami',  // title preview
        thumb: 'https://telegra.ph/file/abc123.jpg', thumbnail
        render: true                // true untuk thumbnail besar
    }
)
```

---

### REPLY WITH PREVIEW

```js
sius.reply(
    '628xxxx@s.whatsapp.net',     // JID tujuan
    'Halo! Cek fitur terbaru ya~', // isi pesan utama
    'sius.bot',                    //judul link preview
    true                           // true untuk thumbnail besar
)
``` 

---


## Installing the FFmpeg
* Unduh salah satu versi FFmpeg yang tersedia dengan mengklik [di sini](https://www.gyan.dev/ffmpeg/builds/).
* Extract file ke `C:\` path.
* Ganti nama folder yang telah di-extract menjadi `ffmpeg`.
* Run Command Prompt as Administrator.
* Jalankan perintah berikut::
```cmd
> setx /m PATH "C:\ffmpeg\bin;%PATH%"
```
Jika berhasil, akan memberikanmu pesan seperti: `SUCCESS: specified value was saved`.
* Sekarang setelah Anda menginstal FFmpeg, verifikasi bahwa itu berhasil dengan menjalankan perintah ini untuk melihat versi:
```cmd
> ffmpeg -version
```


## Installing the libwebp
* Unduh salah satu versi libwebp yang tersedia dengan mengklik [di sini](https://developers.google.com/speed/webp/download).
* Extract file ke `C:\` path.
* Ganti nama folder yang telah di-extract menjadi `libwebp`.
* Run Command Prompt as Administrator.
* Jalankan perintah berikut::
```cmd
> setx /m PATH "C:\libwebp\bin;%PATH%"
```
Jika berhasil, akan memberikanmu pesan seperti: `SUCCESS: specified value was saved`.
* Sekarang setelah Anda menginstal libwebp, verifikasi bahwa itu berhasil dengan menjalankan perintah ini untuk melihat versi:
```cmd
> webpmux -version
```
---

### 👑 DEVELOPER

<p align="center">
  <a href="https://github.com/siuspsrb">
    <img src="https://github.com/siuspsrb.png" width="250" style="border-radius:50%;" />
    <br />
    <b>@sius</b>
  </a>
  <br />
</p>

---

## 🙏 Thanks To

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/adiwajshing">
        <img src="https://github.com/adiwajshing.png" width="100"/><br/>
        <sub>@adiwajshing</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mhankbarbar">
        <img src="https://github.com/mhankbarbar.png" width="100"/><br/>
        <sub>@mhankbarbar</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/FatihArridho">
        <img src="https://github.com/FatihArridho.png" width="100"/><br/>
        <sub>@FatihArridho</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/DikaArdnt">
        <img src="https://github.com/DikaArdnt.png" width="100"/><br/>
        <sub>@DikaArdnt</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/dehanjing">
        <img src="https://github.com/dehanjing.png" width="100"/><br/>
        <sub>@dehanjing</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mamet8">
        <img src="https://github.com/mamet8.png" width="100"/><br/>
        <sub>@mamet8</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/zackmans">
        <img src="https://github.com/zackmans.png" width="100"/><br/>
        <sub>@zackmans</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/xdlyy404">
        <img src="https://github.com/xdlyy404.png" width="100"/><br/>
        <sub>@Xdlyy</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ilmanhdyt">
        <img src="https://github.com/ilmanhdyt.png" width="100"/><br/>
        <sub>@Ilman</sub>
      </a>
    </td>
  </tr>
</table>

---
