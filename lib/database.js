import fs from "fs"
import path from "path"
import chalk from "chalk"
import mongoose from "mongoose"
import config from "../settings.js"

let DataBase

if (/mongo/.test(config.database)) {
    DataBase = class MongoDB {
        constructor(url = config.database, options = { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }) {
            this.url = url;
            this._model = null;
            this.options = options;
            this.isConnecting = false;
            this.isReconnecting = false;
            mongoose.connection.on("disconnected", async () => {
                if (this.isReconnecting) return;
                this.isReconnecting = true;
                console.warn("❗ Kehilangan koneksi MongoDB, menghubungkan kembali dalam 5 detik..");
                await new Promise(resolve => setTimeout(resolve, 5000));
                await this.connect();
            });
        }
        connect = async(retries = 5, delay = 2000) => {
            if (mongoose.connection.readyState === 1 || this.isConnecting) {
                console.log("✅ MongoDB berhasil tersambung!");
                return;
            }
            this.isConnecting = true;
            while (retries > 0) {
                try {
                    console.log(`🔄 Mencoba menghubungkan ke MongoDB... (Percobaan ke ${6 - retries}/5)`);
                    if (mongoose.connection.readyState === 0) {
                        await mongoose.connect(this.url, { ...this.options });
                    }
                    if (!this._model) {
                        const schema = new mongoose.Schema({
                            data: { type: Object, required: true, default: {} }
                        });
                        this._model = mongoose.models.data || mongoose.model("data", schema);
                    }
                    console.log("✅ Berhasil tersambung ke MongoDB.");
                    this.isConnecting = false;
                    this.isReconnecting = false;
                    return;
                } catch (e) {
                    console.error(`❌ Kegagalan koneksi MongoDB: ${e.message}`);
                    await new Promise(res => setTimeout(res, delay));
                    retries--;
                }
            }
            this.isConnecting = false;
            throw new Error("❌ Gagal menghubungkan ke MongoDB setelah beberapa percobaan.");
        };
        read = async () => {
            if (mongoose.connection.readyState !== 1 && !this.isConnecting) {
                await this.connect();
            }
            let doc = await this._model.findOne({});
            if (!doc) {
                doc = new this._model({ data: {} });
                await doc.save();
            }
            try {
                return JSON.parse(doc.data);
            } catch {
                return doc.data || {};
            }
        };
        write = async (data) => {
            if (!data) return;
            if (mongoose.connection.readyState !== 1 && !this.isConnecting) {
                await this.connect();
            }
            const safeData = JSON.stringify(data, (key, value) => {
                if (typeof value === "object" && value !== null && value._id) {
                    return undefined;
                }
                return value;
            });
            await this._model.findOneAndUpdate({}, { data: safeData }, { upsert: true, new: true, setDefaultsOnInsert: true });
        };
    };
} else if (/json/.test(config.database)) {
    DataBase = class DataBase {
        constructor(file = config.database) {
            this.data = {};
            this.file = path.join(process.cwd(), "lib/database", file);
        }
        read = async () => {
            let data;
            if (fs.existsSync(this.file)) {
                data = JSON.parse(fs.readFileSync(this.file));
            } else {
                fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
                data = this.data;
            }
            return data;
        };
        write = async (data) => {
            this.data = data || global.db || {};
            let dirname = path.dirname(this.file);
            if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
            fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
            return this.file;
        };
    };
}

export default DataBase;