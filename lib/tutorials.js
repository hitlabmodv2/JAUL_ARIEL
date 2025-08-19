
const colorUtils = require('./colors');

const tutorials = {
  pairingCodeTutorial: () => {
    console.log('\n' + colorUtils.tutorialTitle(`${colorUtils.emojis.pairing} TUTORIAL PAIRING CODE ${colorUtils.emojis.pairing}`));
    console.log(colorUtils.qrBorder('╔' + '═'.repeat(60) + '╗'));
    console.log(colorUtils.qrBorder('║') + colorUtils.tutorialMsg(' 📱 Cara Login dengan Pairing Code:                     ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText('                                                        ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 1️⃣  Buka aplikasi WhatsApp di ponsel Anda              ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 2️⃣  Ketuk menu titik tiga (⋮) di pojok kanan atas      ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 3️⃣  Pilih "Perangkat Tertaut"                          ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 4️⃣  Ketuk "Tautkan Perangkat"                          ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 5️⃣  Masukkan kode pairing yang muncul di bawah         ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText('                                                        ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.warning(' ⚠️  Pastikan nomor yang dimasukkan benar!              ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('╚' + '═'.repeat(60) + '╝'));
  },

  qrCodeTutorial: () => {
    console.log('\n' + colorUtils.tutorialTitle(`${colorUtils.emojis.qr} TUTORIAL QR CODE ${colorUtils.emojis.qr}`));
    console.log(colorUtils.qrBorder('╔' + '═'.repeat(60) + '╗'));
    console.log(colorUtils.qrBorder('║') + colorUtils.tutorialMsg(' 📷 Cara Login dengan QR Code:                         ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText('                                                        ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 1️⃣  Buka aplikasi WhatsApp di ponsel Anda              ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 2️⃣  Ketuk menu titik tiga (⋮) di pojok kanan atas      ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 3️⃣  Pilih "Perangkat Tertaut"                          ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 4️⃣  Ketuk "Tautkan Perangkat"                          ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' 5️⃣  Scan QR Code yang muncul di bawah                  ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText('                                                        ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.info(' 📱 Arahkan kamera ke QR Code untuk scan               ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('╚' + '═'.repeat(60) + '╝'));
  },

  pairingNumberTutorial: () => {
    console.log('\n' + colorUtils.tutorialTitle(`${colorUtils.emojis.phone} TUTORIAL NOMOR WHATSAPP ${colorUtils.emojis.phone}`));
    console.log(colorUtils.qrBorder('╔' + '═'.repeat(55) + '╗'));
    console.log(colorUtils.qrBorder('║') + colorUtils.tutorialMsg(' 📞 Format Nomor WhatsApp:                        ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText('                                                   ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' ✓ Harus diawali dengan kode negara 62            ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' ✓ Contoh: 628123456789                           ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText(' ✓ Jangan gunakan +62 atau 0                      ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.stepText('                                                   ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('║') + colorUtils.warning(' ⚠️  Pastikan nomor aktif dan terdaftar WA!        ') + colorUtils.qrBorder('║'));
    console.log(colorUtils.qrBorder('╚' + '═'.repeat(55) + '╝'));
  }
};

module.exports = tutorials;
