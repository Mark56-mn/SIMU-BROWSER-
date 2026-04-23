import CryptoJS from 'crypto-js';

// IN PRODUCTION: This key should be derived from user secrets or Web3 wallets.
// For SIMU Browser demo, we use a shared ecosystem key for groups to simulate E2E
// while keeping it functional for the placeholder users.
const ECOSYSTEM_SHARED_KEY = 'simu_network_secure_chat_key_2026';

export interface EncryptedPayload {
  content: string;
  iv: string;
}

/**
 * Encrypts a message using AES-256-CBC
 */
export const encryptMessage = (text: string): EncryptedPayload => {
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

/**
 * Decrypts a message using AES-256-CBC
 */
export const decryptMessage = (encryptedText: string, ivBase64: string): string => {
  try {
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(ECOSYSTEM_SHARED_KEY), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed', error);
    return '*** [Encrypted Message] ***';
  }
};
