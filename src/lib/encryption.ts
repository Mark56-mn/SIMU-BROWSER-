import CryptoJS from 'crypto-js';

const ECOSYSTEM_SHARED_KEY = 'simu_network_secure_chat_key_2026';

export const encryptMessage = (text: string) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(ECOSYSTEM_SHARED_KEY), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    content: encrypted.toString(),
    iv: CryptoJS.enc.Base64.stringify(iv)
  };
};

export const decryptMessage = (encryptedText: string, ivBase64: string) => {
  try {
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(ECOSYSTEM_SHARED_KEY), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return '*** [Encrypted Message] ***';
  }
};
