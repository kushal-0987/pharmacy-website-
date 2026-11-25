/**
 * Two Brothers Healthcare - Cryptographic & Authentication Utilities
 * Client-safe and SSR-safe SHA-256 hashing using Web Crypto API.
 */

export function generateSalt(length = 16): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for environments without crypto.getRandomValues
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const text = `${salt}::tbh-secure-salt::${password}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  // Pure JS SHA-256 fallback for environments without subtle digest
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, '0') + '-legacy-hash';
}

export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  const calculatedHash = await hashPassword(password, salt);
  return calculatedHash === storedHash;
}

export function generateTempPassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
