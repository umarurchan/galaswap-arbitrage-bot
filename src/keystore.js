// Simple client-side keystore using WebCrypto (PBKDF2 + AES-GCM)

function toBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function deriveKey(passphrase, saltBytes, iterations = 210000) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return key;
}

export async function encryptPrivateKey(privateKeyHex, passphrase) {
  const cleaned = privateKeyHex.trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$/.test(cleaned)) {
    throw new Error('Invalid private key format');
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(cleaned)
  );
  return {
    kty: 'enc-v1',
    alg: 'PBKDF2-AESGCM',
    iterations: 210000,
    salt: toBase64(salt.buffer),
    iv: toBase64(iv.buffer),
    ct: toBase64(ciphertext),
  };
}

export async function decryptPrivateKey(payload, passphrase) {
  const salt = new Uint8Array(fromBase64(payload.salt));
  const iv = new Uint8Array(fromBase64(payload.iv));
  const key = await deriveKey(passphrase, salt, payload.iterations || 210000);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    fromBase64(payload.ct)
  );
  const dec = new TextDecoder();
  const hex = dec.decode(plaintext);
  if (!/^[0-9a-f]{64}$/.test(hex)) {
    throw new Error('Decryption failed or corrupted data');
  }
  return '0x' + hex;
}

const STORAGE_KEY = 'gc_keystore_v1';

export function saveEncryptedKeystore(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export function loadEncryptedKeystore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearEncryptedKeystore() {
  localStorage.removeItem(STORAGE_KEY);
}

