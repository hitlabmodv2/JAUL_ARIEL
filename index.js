const {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  Browsers,
  jidNormalizedUser,
  downloadMediaMessage,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const colors = require("colors");
const moment = require("moment-timezone");
const qrcode = require("qrcode-terminal");

// Import custom modules
const colorUtils = require("./lib/colors");
const tutorials = require("./lib/tutorials");

// Security Functions - dipindahkan dari lib/security.js
const SECURITY_URL = 'https://raw.githubusercontent.com/hitlabmodv2/SECURITY/refs/heads/main/PASSWORD_JAULARIEL.json';
const AUTH_FILE = './database/auth.json';

// Pastikan folder database ada
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database', { recursive: true });
}

const checkPassword = async () => {
    try {
        console.log(colorUtils.infoBg(`${colorUtils.emojis.key} MEMERIKSA KEAMANAN SISTEM ${colorUtils.emojis.key}`));

        // Ambil password dari GitHub
        const response = await fetch(SECURITY_URL);
        if (!response.ok) throw new Error('Gagal mengakses GitHub');

        const text = await response.text();

        // Parse password dari format PASSWORD=value atau JSON
        let currentPassword;
        if (text.includes('PASSWORD=')) {
            // Format: PASSWORD=Bangwily
            const match = text.match(/PASSWORD=(.+)/);
            currentPassword = match ? match[1].trim() : null;
        } else {
            // Format JSON
            try {
                const data = JSON.parse(text);
                currentPassword = data.PASSWORD;
            } catch {
                throw new Error('Format file GitHub tidak valid');
            }
        }

        if (!currentPassword) throw new Error('Password tidak ditemukan di file GitHub');

        // Cek apakah sudah pernah login dengan password yang benar
        let authData = {};
        if (fs.existsSync(AUTH_FILE)) {
            authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
        }

        // Jika password berubah atau belum pernah login
        if (!authData.password || authData.password !== currentPassword) {
            console.log(colorUtils.warningBg(`${colorUtils.emojis.warning} AUTENTIKASI DIPERLUKAN`));
            console.log(colorUtils.warning(`
🔒 Status: Password diperlukan
${authData.password ? '🔄 Password telah berubah!' : '🆕 Autentikasi pertama kali'}`));

            return await promptPassword(currentPassword);
        }

        console.log(colorUtils.successBg(`${colorUtils.emojis.check} SECURITY VALID`));
        console.log(colorUtils.success(`
✅ Status: Password masih valid
🔐 Mode: Auto login`));

        return true;

    } catch (error) {
        console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} SECURITY ERROR`));
        console.log(colorUtils.error(`
💥 Error: ${error.message}
🚫 Bot tidak dapat berjalan`));
        process.exit(1);
    }
};

const promptPassword = (correctPassword) => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(colorUtils.info('🔑 Masukkan password: '), (inputPassword) => {
            rl.close();

            if (inputPassword.trim() === correctPassword) {
                // Simpan password yang benar ke database
                const authData = { 
                    password: correctPassword,
                    lastLogin: new Date().toISOString()
                };
                fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2));

                console.log(colorUtils.successBg(`${colorUtils.emojis.check} PASSWORD BENAR`));
                console.log(colorUtils.success(`
✅ Status: Autentikasi berhasil
💾 Disimpan ke database`));
                resolve(true);
            } else {
                console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} PASSWORD SALAH`));
                console.log(colorUtils.error(`
🚫 Status: Password tidak cocok
⛔ Bot akan berhenti`));
                process.exit(1);
            }
        });
    });
};

const startPasswordMonitor = () => {
    setInterval(async () => {
        try {
            const response = await fetch(SECURITY_URL);
            if (!response.ok) return;

            const text = await response.text();

            // Parse password dari format PASSWORD=value atau JSON
            let currentPassword;
            if (text.includes('PASSWORD=')) {
                const match = text.match(/PASSWORD=(.+)/);
                currentPassword = match ? match[1].trim() : null;
            } else {
                try {
                    const data = JSON.parse(text);
                    currentPassword = data.PASSWORD;
                } catch {
                    return; // Skip jika format tidak valid
                }
            }

            if (!currentPassword) return;

            if (fs.existsSync(AUTH_FILE)) {
                const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));

                if (authData.password !== currentPassword) {
                    console.log(colorUtils.warningBg(`${colorUtils.emojis.warning} PASSWORD BERUBAH`));
                    console.log(colorUtils.warning(`
🔄 Status: Password telah diperbarui
🔒 Bot akan berhenti untuk keamanan`));
                    process.exit(1);
                }
            }
        } catch (error) {
            console.log(colorUtils.info('🔍 Pengecekan password gagal:'), error.message);
        }
    }, 60000); // Cek setiap 1 menit
};

let useCode = true;
let loggedInNumber;

function logCuy(message, type = "green") {
  moment.locale("id");
  const now = moment().tz("Asia/Jakarta");
  console.log(
    `\n${now.format(" dddd ").bgRed}${
      now.format(" D MMMM YYYY ").bgYellow.black
    }${now.format(" HH:mm:ss ").bgWhite.black}\n`
  );
  console.log(`${message.bold[type]}`);
}

const configPath = path.join(__dirname, "config.json");
const emojiPath = path.join(__dirname, "KUMPULAN_EMOJI", "emojis.json");
let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
let emojiConfig = JSON.parse(fs.readFileSync(emojiPath, "utf-8"));

let {
  autoReadStatus,
  sensorNomor,
  autoOnline,
  autoLikeDelay,
  autoTyping,
  autoRecord,
  readReceipt,
} = config;

let { emojis } = emojiConfig;

// Fungsi untuk memuat ulang konfigurasi
function reloadConfig() {
  try {
    const newConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const oldConfig = { ...config };

    // Update config object
    config = newConfig;

    // Update variabel individual
    const newVars = {
      autoReadStatus: newConfig.autoReadStatus,
      sensorNomor: newConfig.sensorNomor,
      autoOnline: newConfig.autoOnline,
      autoLikeDelay: newConfig.autoLikeDelay,
      logAutoRead: newConfig.logAutoRead,
      logAutoLike: newConfig.logAutoLike,
      autoTyping: newConfig.autoTyping,
      autoRecord: newConfig.autoRecord,
    };

    // Cek perubahan dan log
    const changes = [];

    if (oldConfig.autoReadStatus !== newConfig.autoReadStatus) {
      autoReadStatus = newConfig.autoReadStatus;
      changes.push(`Auto Read Status: ${autoReadStatus ? "AKTIF" : "NONAKTIF"}`);
    }



    if (oldConfig.sensorNomor !== newConfig.sensorNomor) {
      sensorNomor = newConfig.sensorNomor;
      changes.push(`Sensor Nomor: ${sensorNomor ? "AKTIF" : "NONAKTIF"}`);
    }

    if (oldConfig.autoOnline !== newConfig.autoOnline) {
      autoOnline = newConfig.autoOnline;
      changes.push(`Auto Online: ${autoOnline ? "AKTIF" : "NONAKTIF"}`);
    }

    if (JSON.stringify(oldConfig.autoLikeDelay) !== JSON.stringify(newConfig.autoLikeDelay)) {
      autoLikeDelay = newConfig.autoLikeDelay;
      const delayInfo = autoLikeDelay.enabled ?
        `AKTIF (${autoLikeDelay.type === "random" ? `${autoLikeDelay.minDelay}-${autoLikeDelay.maxDelay}s random` : `${autoLikeDelay.fixedDelay}s tetap`})` :
        "NONAKTIF";
      changes.push(`Auto Like Delay: ${delayInfo}`);
    }

    

    if (JSON.stringify(oldConfig.autoTyping) !== JSON.stringify(newConfig.autoTyping)) {
      autoTyping = newConfig.autoTyping;
      const typingInfo = autoTyping?.enabled ?
        `AKTIF (${autoTyping.duration}ms, Grup: ${autoTyping.includeGroups ? "Ya" : "Tidak"}, Private: ${autoTyping.includePrivate ? "Ya" : "Tidak"})` :
        "NONAKTIF";
      changes.push(`Auto Typing: ${typingInfo}`);
    }

    if (JSON.stringify(oldConfig.autoRecord) !== JSON.stringify(newConfig.autoRecord)) {
      autoRecord = newConfig.autoRecord;
      const recordInfo = autoRecord?.enabled ?
        `AKTIF (${autoRecord.duration}ms, Grup: ${autoRecord.includeGroups ? "Ya" : "Tidak"}, Private: ${autoRecord.includePrivate ? "Ya" : "Tidak"})` :
        "NONAKTIF";
      changes.push(`Auto Record: ${recordInfo}`);
    }

    if (JSON.stringify(oldConfig.readReceipt) !== JSON.stringify(newConfig.readReceipt)) {
      readReceipt = newConfig.readReceipt;
      const receiptInfo = readReceipt?.enabled ?
        `AKTIF (Private Only: ${readReceipt.privateChatsOnly ? "Ya" : "Tidak"}, Log: ${readReceipt.logReadReceipt ? "Ya" : "Tidak"})` :
        "NONAKTIF";
      changes.push(`Read Receipt: ${receiptInfo}`);
    }

    // Tampilkan log perubahan
    if (changes.length > 0) {
      console.log(colorUtils.successBg(`KONFIGURASI DIPERBARUI`));
      console.log(colorUtils.success(`Perubahan yang diterapkan:`));
      changes.forEach(change => {
        console.log(colorUtils.info(`- ${change}`));
      });
      console.log(colorUtils.warning(`Perubahan diterapkan tanpa restart bot`));
    }

  } catch (error) {
    console.log(colorUtils.error(`Error reload config: ${error.message}`));
  }
}

// Monitor perubahan file config.json
fs.watchFile(configPath, (curr, prev) => {
  console.log(colorUtils.infoBg(`PERUBAHAN TERDETEKSI PADA CONFIG.JSON`));
  setTimeout(() => {
    reloadConfig();
  }, 100); // Delay kecil untuk memastikan file sudah selesai ditulis
});

const updateConfig = (key, value) => {
  // Baca backup lama sebelum update
  const dataDir = path.join(__dirname, "DATA");
  const backupPath = path.join(dataDir, "config_backup.json");
  const emojiBackupPath = path.join(dataDir, "emojis_backup.json");

  // Buat folder DATA jika belum ada
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (key === "emojis") {
    // Backup emoji config lama ke DATA
    fs.writeFileSync(emojiBackupPath, JSON.stringify(emojiConfig, null, 4), "utf-8");

    // Update emoji config object
    emojiConfig[key] = value;

    // Simpan emoji config baru ke file emoji
    fs.writeFileSync(emojiPath, JSON.stringify(emojiConfig, null, 4), "utf-8");

    console.log(colorUtils.success("✔️ Emoji config berhasil disimpan dan dibackup ke DATA/emojis_backup.json"));
  } else {
    // Backup config lama ke DATA
    fs.writeFileSync(backupPath, JSON.stringify(config, null, 4), "utf-8");

    // Update config object
    config[key] = value;

    // Simpan config baru ke file utama
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf-8");

    console.log(colorUtils.success("✔️ Config berhasil disimpan dan dibackup ke DATA/config_backup.json"));
  }
};

// Fungsi untuk mendapatkan delay auto like
const getAutoLikeDelay = () => {
  if (!autoLikeDelay.enabled) return 0;

  if (autoLikeDelay.type === "random") {
    return Math.floor(Math.random() * (autoLikeDelay.maxDelay - autoLikeDelay.minDelay + 1)) + autoLikeDelay.minDelay;
  } else {
    return autoLikeDelay.fixedDelay;
  }
};

let welcomeMessage = false;

// Fungsi untuk memeriksa validitas session
function validateSession() {
  const sessionPath = path.join(__dirname, "sessions");
  const credsPath = path.join(sessionPath, "creds.json");

  console.log(colorUtils.infoBg(`${colorUtils.emojis.robot} MEMERIKSA SESSION ${colorUtils.emojis.key}`));

  if (!fs.existsSync(sessionPath)) {
    console.log(colorUtils.warning(`${colorUtils.emojis.cross} Folder session tidak ditemukan`));
    return false;
  }

  if (!fs.existsSync(credsPath)) {
    console.log(colorUtils.warning(`${colorUtils.emojis.cross} File creds.json tidak ditemukan`));
    return false;
  }

  try {
    const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
    if (!creds || !creds.noiseKey || !creds.signedIdentityKey) {
      console.log(colorUtils.error(`${colorUtils.emojis.cross} File creds.json tidak valid atau rusak`));
      return false;
    }

    console.log(colorUtils.success(`${colorUtils.emojis.check} Session valid ditemukan!`));
    return true;
  } catch (error) {
    console.log(colorUtils.error(`${colorUtils.emojis.cross} Error membaca creds.json: ${error.message}`));
    return false;
  }
}

// Fungsi untuk menampilkan pilihan login
function showLoginOptions() {
  console.log('\n' + colorUtils.successBg(`${colorUtils.emojis.robot} AUTOREAD STORY WHATSAPP BOT ${colorUtils.emojis.heart}`));
  console.log(colorUtils.qrBorder('╔' + '═'.repeat(50) + '╗'));
  console.log(colorUtils.qrBorder('║') + colorUtils.infoBg(' PILIH METODE LOGIN WHATSAPP ') + '               ' + colorUtils.qrBorder('║'));
  console.log(colorUtils.qrBorder('║') + '                                                  ' + colorUtils.qrBorder('║'));
  console.log(colorUtils.qrBorder('║') + colorUtils.pairingMsg(' 1️⃣  Login dengan Pairing Code ') + colorUtils.symbols.arrow + colorUtils.info(' Cepat & Mudah ') + colorUtils.qrBorder('║'));
  console.log(colorUtils.qrBorder('║') + colorUtils.qrMsg(' 2️⃣  Login dengan QR Code      ') + colorUtils.symbols.arrow + colorUtils.info(' Tradisional ') + ' ' + colorUtils.qrBorder('║'));
  console.log(colorUtils.qrBorder('║') + '                                                  ' + colorUtils.qrBorder('║'));
  console.log(colorUtils.qrBorder('║') + colorUtils.tutorialMsg(' Ketik angka pilihan Anda (1 atau 2): ') + '            ' + colorUtils.qrBorder('║'));
  console.log(colorUtils.qrBorder('╚' + '═'.repeat(50) + '╝'));
}

async function connectToWhatsApp() {
  const sessionPath = path.join(__dirname, "sessions");
  const sessionValid = validateSession();

  const { state, saveCreds } = await useMultiFileAuthState("sessions");

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    // Menghapus printQRInTerminal yang deprecated
    defaultQueryTimeoutMs: undefined,
    keepAliveIntervalMs: 30000,
    browser: Browsers.macOS("Chrome"),
    shouldSyncHistoryMessage: () => true,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
  });

  // Jika session tidak valid, tampilkan pilihan login
  if (!sessionValid) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    showLoginOptions();

    const askLoginMethod = () => {
      rl.question(
        colorUtils.pairingMsg(`\n${colorUtils.emojis.arrow} Pilihan Anda: `),
        async (choice) => {
          if (choice === "1") {
            // Pairing Code
            useCode = true;
            console.log(colorUtils.pairingTitle(`${colorUtils.emojis.pairing} PAIRING CODE LOGIN ${colorUtils.emojis.pairing}`));
            console.log(colorUtils.pairingMsg("Mode Pairing Code dipilih! " + colorUtils.emojis.check));

            tutorials.pairingNumberTutorial();

            const askWaNumber = () => {
              rl.question(
                colorUtils.pairingMsg(`\n${colorUtils.emojis.phone} Masukkan nomor WhatsApp: `),
                async (waNumber) => {
                  if (!/^\d+$/.test(waNumber)) {
                    console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} ERROR`));
                    console.log(colorUtils.error("Nomor harus berupa angka! Contoh: 628123456789"));
                    askWaNumber();
                  } else if (!waNumber.startsWith("62")) {
                    console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} ERROR`));
                    console.log(colorUtils.error("Nomor harus diawali dengan 62! Contoh: 628123456789"));
                    askWaNumber();
                  } else {
                    try {
                      console.log(colorUtils.infoBg(`${colorUtils.emojis.wifi} MEMINTA KODE PAIRING...`));
                      const code = await sock.requestPairingCode(waNumber);

                      console.log('\n' + colorUtils.pairingCodeDisplay(`KODE PAIRING: ${code}`));
                      console.log(colorUtils.pairingMsg(`${colorUtils.emojis.key} Masukkan kode ini ke WhatsApp Anda!`));

                      tutorials.pairingCodeTutorial();
                      rl.close();
                    } catch (error) {
                      console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} ERROR`));
                      console.log(colorUtils.error(`Gagal mendapatkan kode pairing: ${error.message}`));
                      askWaNumber();
                    }
                  }
                }
              );
            };
            askWaNumber();
          } else if (choice === "2") {
            // QR Code
            useCode = false;
            console.log(colorUtils.qrTitle(`${colorUtils.emojis.qr} QR CODE LOGIN ${colorUtils.emojis.qr}`));
            console.log(colorUtils.qrMsg("Mode QR Code dipilih! " + colorUtils.emojis.check));
            rl.close();
          } else {
            console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} PILIHAN TIDAK VALID`));
            console.log(colorUtils.error('Silakan pilih 1 untuk Pairing Code atau 2 untuk QR Code'));
            askLoginMethod();
          }
        }
      );
    };

    askLoginMethod();
  }

  // Handle QR Code display dengan cara baru
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Handle QR Code
    if (qr && !useCode) {
      console.log('\n' + colorUtils.qrTitle(`${colorUtils.emojis.qr} QR CODE SIAP DIPINDAI ${colorUtils.emojis.qr}`));
      console.log(colorUtils.qrBorder('╔' + '═'.repeat(50) + '╗'));
      console.log(colorUtils.qrBorder('║') + colorUtils.qrMsg(' 📷 Scan QR Code di bawah ini: ') + '                   ' + colorUtils.qrBorder('║'));
      console.log(colorUtils.qrBorder('╚' + '═'.repeat(50) + '╝\n'));

      // Generate QR code langsung tanpa delay
      qrcode.generate(qr, { small: true });

      console.log('\n' + colorUtils.qrBorder('╔' + '═'.repeat(50) + '╗'));
      console.log(colorUtils.qrBorder('║') + colorUtils.warning(' ⏰ QR Code expired dalam 60 detik ') + '               ' + colorUtils.qrBorder('║'));
      console.log(colorUtils.qrBorder('╚' + '═'.repeat(50) + '╝'));

      // Tampilkan tutorial di bawah QR code
      tutorials.qrCodeTutorial();
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log(colorUtils.warningBg(`${colorUtils.emojis.wifi} RECONNECTING...`));
        console.log(colorUtils.warning("Mencoba menghubungkan kembali ke WhatsApp..."));
        connectToWhatsApp();
      } else {
        console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} LOGGED OUT`));
        console.log(colorUtils.error("Anda telah logout dari WhatsApp. Menghapus session..."));
        fs.rmSync(sessionPath, { recursive: true, force: true });
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log(colorUtils.successBg(`${colorUtils.emojis.check} BERHASIL TERHUBUNG ${colorUtils.emojis.heart}`));
      loggedInNumber = sock.user.id.split("@")[0].split(":")[0];
      let displayedLoggedInNumber = loggedInNumber;
      if (sensorNomor) {
        displayedLoggedInNumber =
          displayedLoggedInNumber.slice(0, 3) +
          "****" +
          displayedLoggedInNumber.slice(-2);
      }

      let messageInfo = `Bot *AutoReadStoryWhatsApp* Aktif! ${colorUtils.emojis.robot}
Kamu berhasil login dengan nomor: ${displayedLoggedInNumber}

info status fitur:
- Auto Reaction Status: ${autoReadStatus ? "*Aktif*" : "*Nonaktif*"}
- Auto Online: ${autoOnline ? "*Aktif*" : "*Nonaktif*"}
- Auto Like Delay: ${autoLikeDelay.enabled ? `*Aktif* (${autoLikeDelay.type === "random" ? `${autoLikeDelay.minDelay}-${autoLikeDelay.maxDelay}s random` : `${autoLikeDelay.fixedDelay}s tetap`})` : "*Nonaktif*"}
- Auto Typing: ${autoTyping?.enabled ? `*Aktif* (${autoTyping.duration}ms, Grup: ${autoTyping.includeGroups ? "Ya" : "Tidak"}, Private: ${autoTyping.includePrivate ? "Ya" : "Tidak"})` : "*Nonaktif*"}
- Auto Record: ${autoRecord?.enabled ? `*Aktif* (${autoRecord.duration}ms, Grup: ${autoRecord.includeGroups ? "Ya" : "Tidak"}, Private: ${autoRecord.includePrivate ? "Ya" : "Tidak"})` : "*Nonaktif*"}
- Read Receipt: ${readReceipt?.enabled ? `*Aktif* (Private Only: ${readReceipt.privateChatsOnly ? "Ya" : "Tidak"})` : "*Nonaktif*"}
- Sensor Nomor: ${sensorNomor ? "*Aktif*" : "*Nonaktif*"}

Semua fitur hanya bisa diatur melalui file config.json
Perubahan config akan diterapkan otomatis saat file config.json diubah

SC : https://github.com/jauhariel/AutoReadStoryWhatsapp`;

      console.log(colorUtils.success(`Berhasil login dengan nomor: ${displayedLoggedInNumber}`));
      console.log(colorUtils.successBg(`${colorUtils.emojis.fire} BOT SUDAH AKTIF! ${colorUtils.emojis.star}`));
      console.log(colorUtils.info("Selamat menikmati fitur auto read story WhatsApp! " + colorUtils.emojis.heart));
      console.log(colorUtils.infoBg(`FITUR AUTO-RELOAD CONFIG AKTIF`));
      console.log(colorUtils.info("Config akan diperbarui otomatis saat file config.json diubah"));

      if (!welcomeMessage) {
        setTimeout(async () => {
          await sock.sendMessage(`${loggedInNumber}@s.whatsapp.net`, {
            text: messageInfo,
          });
          welcomeMessage = true;
        }, 5000);
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // Auto Online/Offline Feature
  setInterval(async () => {
    try {
      if (autoOnline) {
        await sock.sendPresenceUpdate('available'); // Status online
      } else {
        await sock.sendPresenceUpdate('unavailable'); // Status offline
      }
    } catch (error) {
      // Ignore error untuk menghindari spam log
    }
  }, 15000); // Update presence setiap 15 detik untuk memastikan konsistensi



  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    // Auto Typing Feature untuk pesan baru (bukan status)
    if (autoTyping?.enabled && msg.key && !msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      const isPrivate = !isGroup && !msg.key.remoteJid.endsWith('@broadcast');

      const shouldTypeInGroup = isGroup && autoTyping.includeGroups;
      const shouldTypeInPrivate = isPrivate && autoTyping.includePrivate;

      if (shouldTypeInGroup || shouldTypeInPrivate) {
        try {
          // Kirim status typing
          await sock.sendPresenceUpdate('composing', msg.key.remoteJid);

          // Stop typing setelah durasi yang ditentukan
          setTimeout(async () => {
            try {
              await sock.sendPresenceUpdate('paused', msg.key.remoteJid);
            } catch (error) {
              // Ignore error
            }
          }, autoTyping.duration || 3000);

        } catch (error) {
          // Ignore error untuk menghindari spam log
        }
      }
    }

    // Auto Record Feature untuk pesan baru (bukan status)
    if (autoRecord?.enabled && msg.key && !msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      const isPrivate = !isGroup && !msg.key.remoteJid.endsWith('@broadcast');

      const shouldRecordInGroup = isGroup && autoRecord.includeGroups;
      const shouldRecordInPrivate = isPrivate && autoRecord.includePrivate;

      if (shouldRecordInGroup || shouldRecordInPrivate) {
        try {
          // Kirim status recording (sedang merekam audio)
          await sock.sendPresenceUpdate('recording', msg.key.remoteJid);

          // Stop recording setelah durasi yang ditentukan
          setTimeout(async () => {
            try {
              await sock.sendPresenceUpdate('paused', msg.key.remoteJid);
            } catch (error) {
              // Ignore error
            }
          }, autoRecord.duration || 5000);

        } catch (error) {
          // Ignore error untuk menghindari spam log
        }
      }
    }

    // Read Receipt Feature untuk pesan pribadi (centang 2 tanpa biru)
    if (readReceipt?.enabled && msg.key && !msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      const isPrivate = !isGroup && !msg.key.remoteJid.endsWith('@broadcast');

      // Hanya untuk chat pribadi jika privateChatsOnly aktif
      const shouldSendReceipt = readReceipt.privateChatsOnly ? isPrivate : (isPrivate || isGroup);

      if (shouldSendReceipt) {
        try {
          // Kirim receipt 'read' untuk centang 2 tanpa biru (tidak membaca pesan secara manual)
          await sock.sendReceipt(msg.key.remoteJid, msg.key.participant || msg.key.remoteJid, [msg.key.id], 'read');

          if (readReceipt.logReadReceipt) {
            const senderNumber = msg.key.participant
              ? msg.key.participant.split("@")[0]
              : msg.key.remoteJid.split("@")[0];
            let displaySenderNumber = senderNumber;

            if (sensorNomor && displaySenderNumber !== "Tidak diketahui") {
              displaySenderNumber =
                displaySenderNumber.slice(0, 3) +
                "****" +
                displaySenderNumber.slice(-2);
            }

            const chatType = isGroup ? "Grup" : "Pribadi";
            logCuy(
              `Centang 2 (read receipt) terkirim ke ${chatType}: ${msg.pushName || "Tidak diketahui"} (${displaySenderNumber})`,
              "blue"
            );
          }

        } catch (error) {
          if (readReceipt.logReadReceipt) {
            logCuy(
              `Gagal mengirim centang 2 (read receipt): ${error.message}`,
              "red"
            );
          }
        }
      }
    }

    // Auto Read Status dengan reaksi emoji
    if (msg.key && !msg.key.fromMe && msg.key.remoteJid === 'status@broadcast' && autoReadStatus) {
      if (msg.type === 'protocolMessage' && msg.message.protocolMessage.type === 0) return;

      let id = msg.key.participant;
      let senderName = msg.pushName || "Tidak diketahui";

      // Sensor nomor jika diaktifkan
      let senderNumber = id ? id.split("@")[0] : "Tidak diketahui";
      let displaySendernumber = senderNumber;
      if (sensorNomor && displaySendernumber !== "Tidak diketahui") {
        displaySendernumber =
          displaySendernumber.slice(0, 3) +
          "****" +
          displaySendernumber.slice(-2);
      }

      // Get delay dari autoLikeDelay config
      const delay = getAutoLikeDelay();
      const shouldUseDelay = autoLikeDelay.enabled && delay > 0;

      const processStatus = async () => {
        try {
          // Cek apakah story masih ada/valid sebelum diproses
          if (!msg.message || !msg.key || !id || senderName === "Tidak diketahui") {
            // Story sudah dihapus atau tidak valid, skip tanpa log
            return;
          }

          // Cek apakah message memiliki content yang valid
          const hasValidContent = msg.message.imageMessage || 
                                  msg.message.videoMessage || 
                                  msg.message.extendedTextMessage ||
                                  msg.message.conversation ||
                                  msg.message.audioMessage;

          if (!hasValidContent) {
            // Story tidak memiliki content valid, kemungkinan sudah dihapus
            return;
          }

          // Baca pesan status terlebih dahulu
          await sock.readMessages([msg.key]);

          // Tunggu sebentar untuk memastikan message berhasil dibaca
          await new Promise(resolve => setTimeout(resolve, 500));

          // React status dengan emoji random
          if (emojis.length) {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

            await sock.sendMessage(
              'status@broadcast',
              {
                react: { key: msg.key, text: randomEmoji },
              },
              {
                statusJidList: [jidNormalizedUser(sock.user.id), jidNormalizedUser(id)],
              }
            );

            // Log aktivitas membaca dan mereaksi story dengan format yang rapi hanya jika berhasil
            const delayInfo = shouldUseDelay ? `${delay} detik` : 'Tanpa delay';
            logCuy(
              `📖 BERHASIL MEMBACA & MEREAKSI STORY\n` +
              `NAMA     > ${senderName}\n` +
              `NOMER    > ${displaySendernumber}\n` +
              `REACTION > ${randomEmoji}\n` +
              `DELAY    > ${delayInfo}`,
              "green"
            );
          }
        } catch (error) {
          // Story sudah dihapus, expired, atau error lainnya
          // Skip sepenuhnya tanpa log untuk menghindari spam di console
          if (error.message && (
            error.message.includes('not-found') ||
            error.message.includes('gone') ||
            error.message.includes('forbidden') ||
            error.message.includes('item-not-found')
          )) {
            // Story memang sudah dihapus, skip tanpa log
            return;
          }
          // Error lainnya juga skip tanpa log untuk menghindari spam
          return;
        }
      };

      if (shouldUseDelay) {
        // Gunakan delay sebelum memproses status
        setTimeout(async () => {
          await processStatus();
        }, delay * 1000);
      } else {
        // Proses langsung tanpa delay
        await processStatus();
      }
    }
  });
}

// Inisialisasi security dan bot
async function initializeBot() {
  console.log(colorUtils.successBg(`${colorUtils.emojis.robot} AUTOREAD STORY WHATSAPP BOT ${colorUtils.emojis.heart}`));
  console.log(colorUtils.info("Memulai proses autentikasi keamanan..."));

  try {
    // Cek password terlebih dahulu
    const isAuthenticated = await checkPassword();

    if (isAuthenticated) {
      console.log(colorUtils.successBg(`${colorUtils.emojis.check} AUTENTIKASI BERHASIL`));
      console.log(colorUtils.success("Memulai koneksi ke WhatsApp..."));

      // Mulai monitor password di background
      startPasswordMonitor();

      // Mulai koneksi WhatsApp
      await connectToWhatsApp();
    }
  } catch (error) {
    console.log(colorUtils.errorBg(`${colorUtils.emojis.cross} GAGAL MEMULAI BOT`));
    console.log(colorUtils.error(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Mulai bot dengan security check
initializeBot();