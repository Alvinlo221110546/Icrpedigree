// src/Middleware/encrypt.js
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const KEY = process.env.ENCRYPTION_KEY || 'default_dev_key_change_me_please_123456';
const KEY_BUF = crypto.createHash('sha256').update(KEY).digest(); // 32 bytes key

// encode result as iv:cipher:tag (base64)
export const encryptText = (plaintext) => {
  if (plaintext === null || plaintext === undefined) return null;
  const iv = crypto.randomBytes(12); // 96-bit recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY_BUF, iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${encrypted.toString('base64')}:${tag.toString('base64')}`;
};

export const decryptText = (payload) => {
  if (!payload) return null;
  try {
    const [ivB, encryptedB, tagB] = payload.split(':');
    const iv = Buffer.from(ivB, 'base64');
    const encrypted = Buffer.from(encryptedB, 'base64');
    const tag = Buffer.from(tagB, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY_BUF, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (e) {
    // kalau gagal decrypt, fallback null
    return null;
  }
};
