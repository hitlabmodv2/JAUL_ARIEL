
const colors = require("colors");

// Konfigurasi warna custom
const customColors = {
  // Warna untuk pairing code
  pairingBg: ['bgBlue', 'white'],
  pairingText: ['cyan', 'bold'],
  pairingCode: ['bgYellow', 'black', 'bold'],
  
  // Warna untuk QR code
  qrBg: ['bgBlue', 'white'],
  qrText: ['blue', 'bold'],
  qrBorder: ['yellow', 'bold'],
  
  // Warna untuk status
  successBg: ['bgBlue', 'white'],
  successText: ['blue', 'bold'],
  errorBg: ['bgRed', 'white'],
  errorText: ['red', 'bold'],
  warningBg: ['bgYellow', 'black'],
  warningText: ['yellow', 'bold'],
  infoBg: ['bgCyan', 'black'],
  infoText: ['cyan', 'bold'],
  
  // Warna untuk tutorial
  tutorialBg: ['bgMagenta', 'white'],
  tutorialText: ['magenta', 'bold'],
  stepBg: ['bgWhite', 'black'],
  stepText: ['white', 'bold']
};

// Fungsi untuk menerapkan warna
const applyColor = (text, colorConfig) => {
  let coloredText = text;
  colorConfig.forEach(color => {
    coloredText = coloredText[color];
  });
  return coloredText;
};

// Fungsi warna untuk berbagai keperluan
const colorUtils = {
  // Pairing Code Colors
  pairingTitle: (text) => applyColor(` ${text} `, customColors.pairingBg),
  pairingMsg: (text) => applyColor(text, customColors.pairingText),
  pairingCodeDisplay: (text) => applyColor(` ${text} `, customColors.pairingCode),
  
  // QR Code Colors
  qrTitle: (text) => applyColor(` ${text} `, customColors.qrBg),
  qrMsg: (text) => applyColor(text, customColors.qrText),
  qrBorder: (text) => applyColor(text, customColors.qrBorder),
  
  // Status Colors
  success: (text) => applyColor(text, customColors.successText),
  successBg: (text) => applyColor(` ${text} `, customColors.successBg),
  error: (text) => applyColor(text, customColors.errorText),
  errorBg: (text) => applyColor(` ${text} `, customColors.errorBg),
  warning: (text) => applyColor(text, customColors.warningText),
  warningBg: (text) => applyColor(` ${text} `, customColors.warningBg),
  info: (text) => applyColor(text, customColors.infoText),
  infoBg: (text) => applyColor(` ${text} `, customColors.infoBg),
  
  // Tutorial Colors
  tutorialTitle: (text) => applyColor(` ${text} `, customColors.tutorialBg),
  tutorialMsg: (text) => applyColor(text, customColors.tutorialText),
  tutorialBg: (text) => applyColor(` ${text} `, customColors.tutorialBg),
  step: (text) => applyColor(` ${text} `, customColors.stepBg),
  stepText: (text) => applyColor(text, customColors.stepText),
  
  // Emoji dan Simbol
  emojis: {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️',
    pairing: '🔗',
    qr: '📱',
    phone: '📞',
    key: '🔑',
    robot: '🤖',
    wifi: '📶',
    check: '✔️',
    cross: '✖️',
    arrow: '➤',
    star: '⭐',
    fire: '🔥',
    heart: '💚',
    loading: '⏳',
    scan: '📷'
  },
  
  symbols: {
    border: '═',
    corner: '╔╗╚╝',
    line: '─',
    bullet: '•',
    arrow: '→',
    check: '✓',
    cross: '✗'
  }
};

module.exports = colorUtils;
