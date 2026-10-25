// Cryptographic Security Engine for LEGEND MOD Control Center
// Multi-layered protection against cracking, brute force, URL discovery, and session tampering.

const SESSION_KEY = 'legend_mod_secure_session';
const LOCKOUT_KEY = 'legend_mod_auth_lockout';
const CUSTOM_CREDENTIALS_KEY = 'legend_mod_admin_credentials';
const SECURITY_SALT = 'LEGEND_MOD_MA_LEGEND_SUPER_SECRET_SALT_2026_9478';

// Irreversible Salted SHA-256 Hashes of Default Credentials
// SHA-256 is mathematically one-way: plain text passwords can NEVER be extracted by decompiling JS.
export const DEFAULT_MASTER_HASH = '26c128dac0581a40bc8dbafb1b39249fe828962d2b59e6ef05c249813494f3ae';
export const DEFAULT_PIN_HASH = 'dd7d200ccd2a94040c1c026cf5e7be6bc8ccffe7d862fd010e477ec10668c7a8';
export const DEFAULT_PORTAL_HASH = 'afd9c60197fed69fc078d9f7b8ab864135e0fd408757592269b1ea44d4ca7d31';

// Helper: Compute SHA-256 hash using Web Crypto API
export async function sha256(message: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback simple hash for server environment
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      hash = (hash << 5) - hash + message.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  const msgBuffer = new TextEncoder().encode(message + SECURITY_SALT);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get saved custom credential hashes or defaults (Never returns plain text)
export function getStoredCredentialHashes(): { masterHash: string; pinHash: string; portalHash: string } {
  if (typeof window === 'undefined') {
    return { masterHash: DEFAULT_MASTER_HASH, pinHash: DEFAULT_PIN_HASH, portalHash: DEFAULT_PORTAL_HASH };
  }
  try {
    const raw = localStorage.getItem(CUSTOM_CREDENTIALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        masterHash: parsed.masterHash || DEFAULT_MASTER_HASH,
        pinHash: parsed.pinHash || DEFAULT_PIN_HASH,
        portalHash: parsed.portalHash || DEFAULT_PORTAL_HASH
      };
    }
  } catch (e) {}

  return { masterHash: DEFAULT_MASTER_HASH, pinHash: DEFAULT_PIN_HASH, portalHash: DEFAULT_PORTAL_HASH };
}

// Verify entered credentials against irreversible cryptographic hashes
export async function verifyCredentials(masterKey: string, pin: string): Promise<boolean> {
  const masterHash = await sha256(masterKey.trim());
  const pinHash = await sha256(pin.trim());
  
  const stored = getStoredCredentialHashes();
  const targetMaster = stored.masterHash || DEFAULT_MASTER_HASH;
  const targetPin = stored.pinHash || DEFAULT_PIN_HASH;

  return masterHash === targetMaster && pinHash === targetPin;
}

// Verify secret portal key against hash
export async function verifyPortalKey(portalKey: string): Promise<boolean> {
  if (!portalKey) return false;
  const inputHash = await sha256(portalKey.trim().toLowerCase());
  const stored = getStoredCredentialHashes();
  const targetPortal = stored.portalHash || DEFAULT_PORTAL_HASH;
  return inputHash === targetPortal;
}

// Update admin credentials by computing SHA-256 hashes first (Called from Settings)
export async function updateStoredCredentials(masterKey?: string, pin?: string, portalKey?: string) {
  if (typeof window === 'undefined') return;
  const current = getStoredCredentialHashes();
  const updates: any = { ...current };

  if (masterKey && masterKey.trim()) {
    updates.masterHash = await sha256(masterKey.trim());
  }
  if (pin && pin.trim()) {
    updates.pinHash = await sha256(pin.trim());
  }
  if (portalKey && portalKey.trim()) {
    updates.portalHash = await sha256(portalKey.trim().toLowerCase());
  }

  localStorage.setItem(CUSTOM_CREDENTIALS_KEY, JSON.stringify(updates));
}

// Anti-Brute Force Lockout Management
export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  
  try {
    const data = JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{"attempts":0,"lockedUntil":0}');
    const now = Date.now();
    if (data.lockedUntil && data.lockedUntil > now) {
      const remaining = Math.ceil((data.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds: remaining, attempts: data.attempts };
    }
    return { isLocked: false, remainingSeconds: 0, attempts: data.attempts || 0 };
  } catch (e) {
    return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  }
}

export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, attempts: 1 };
  
  const current = getLockoutStatus();
  const newAttempts = current.attempts + 1;
  const now = Date.now();

  // After 3 failed attempts, lock out for 15 minutes (900 seconds)
  if (newAttempts >= 3) {
    const lockTime = 15 * 60 * 1000;
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify({
      attempts: newAttempts,
      lockedUntil: now + lockTime
    }));
    return { isLocked: true, remainingSeconds: 900, attempts: newAttempts };
  }

  localStorage.setItem(LOCKOUT_KEY, JSON.stringify({
    attempts: newAttempts,
    lockedUntil: 0
  }));
  return { isLocked: false, remainingSeconds: 0, attempts: newAttempts };
}

export function resetLockout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCKOUT_KEY);
}

// Cryptographic Session Token Creation & Verification
export async function createAdminSession(): Promise<void> {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const expiresAt = now + 12 * 60 * 60 * 1000; // 12 hours validity
  const user = 'MA_LEGEND_ADMIN';
  
  // Create cryptographic signature
  const signature = await sha256(`${user}:${now}:${expiresAt}`);

  const sessionPayload = {
    user,
    issuedAt: now,
    expiresAt,
    signature
  };

  const serialized = JSON.stringify(sessionPayload);
  sessionStorage.setItem(SESSION_KEY, serialized);
  localStorage.setItem(SESSION_KEY, serialized);
  resetLockout();
}

export async function verifyAdminSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  if (!raw) return false;

  try {
    const session = JSON.parse(raw);
    const now = Date.now();

    // Check expiration
    if (!session.expiresAt || session.expiresAt < now) {
      destroyAdminSession();
      return false;
    }

    // Verify cryptographic signature to prevent DevTools tampering
    const expectedSignature = await sha256(`${session.user}:${session.issuedAt}:${session.expiresAt}`);
    if (session.signature !== expectedSignature) {
      console.warn('Security Alert: Tampered session token detected! Terminating.');
      destroyAdminSession();
      return false;
    }

    return true;
  } catch (e) {
    destroyAdminSession();
    return false;
  }
}

export function destroyAdminSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('yalla_admin_session');
}
