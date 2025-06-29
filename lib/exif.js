import fs from "fs"
import path from "path"
import { tmpdir } from "os"
import Crypto from "crypto"
import ff from "fluent-ffmpeg"
import FileType from "file-type"
import webp from "node-webpmux"
import { spawn } from "child_process"
import { fileURLToPath } from "url"
import { dirname } from "path"
import config from "../settings.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function ffmpeg(buffer, args = [], ext = "", ext2 = "") {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join(__dirname, "database/sampah", + new Date + "." + ext)
      let out = tmp + "." + ext2
      await fs.promises.writeFile(tmp, buffer)
      spawn("ffmpeg", [
        "-y",
        "-i", tmp,
        ...args,
        out
      ])
        .on("error", reject)
        .on("close", async (code) => {
          try {
            await fs.promises.unlink(tmp)
            if (code !== 0) return reject(code)
            resolve(await fs.promises.readFile(out))
            await fs.promises.unlink(out)
          } catch (e) {
            reject(e)
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    "-vn",
    "-ac", "2",
    "-b:a", "128k",
    "-ar", "44100",
    "-f", "mp3"
  ], ext, "mp3")
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    "-vn",
    "-c:a", "libopus",
    "-b:a", "128k",
    "-vbr", "on",
    "-compression_level", "10"
  ], ext, "opus")
}

/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension 
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    "-c:v", "libx264",
    "-c:a", "aac",
    "-ab", "128k",
    "-ar", "44100",
    "-crf", "32",
    "-preset", "slow"
  ], ext, "mp4")
}

async function imageToWebp(media) {
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`);
    fs.writeFileSync(tmpFileIn, media);
    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec", "libwebp", "-vf",
                "scale=500:500:force_original_aspect_ratio=decrease,setsar=1,pad=500:500:-1:-1:color=white@0.0,split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop", "0", "-preset", "default"
            ])
            .toFormat("webp")
            .save(tmpFileOut);
    });

    const buff = fs.readFileSync(tmpFileOut);
    fs.unlinkSync(tmpFileOut);
    fs.unlinkSync(tmpFileIn);
    return buff;
}

async function videoToWebp(media) {
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`);
    fs.writeFileSync(tmpFileIn, media);
    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec", "libwebp", "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop", "0", "-ss", "00:00:00", "-t", "00:00:05", "-preset", "default", "-an", "-vsync", "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut);
    });

    const buff = fs.readFileSync(tmpFileOut);
    fs.unlinkSync(tmpFileOut);
    fs.unlinkSync(tmpFileIn);
    return buff;
}

async function writeExif(media, data) {
    const anu = await FileType.fromBuffer(media);
    const wMedia = /webp/.test(anu.mime) ? media : /jpeg|jpg|png/.test(anu.mime) ? await imageToWebp(media) : /video/.test(anu.mime) ? await videoToWebp(media) : "";
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    fs.writeFileSync(tmpFileIn, wMedia);
    if (data) {
        const img = new webp.Image();
        const author = config.sticker.author
        const packname = config.sticker.packname
        const { wra = data.pack_id ? data.pack_id : author ? author : "sius-dev", wrb = data.packname ? data.packname : packname ? packname : "SiusBot", wrc = data.author ? data.author : author ? author : "Sius", wrd = data.categories ? data.categories : [""], wre = data.isAvatar ? data.isAvatar : 0, ...wrf } = data;
        const json = { "sticker-pack-id": wra, "sticker-pack-name": wrb, "sticker-pack-publisher": wrc, "emojis": wrd, "is-avatar-sticker": wre, ...wrf };
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);
        await img.load(tmpFileIn);
        fs.unlinkSync(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);
        const buff = fs.readFileSync(tmpFileOut);
        fs.unlinkSync(tmpFileOut);
        return buff;
    }
}

export { imageToWebp, videoToWebp, writeExif, toAudio, toPTT, toVideo, ffmpeg };