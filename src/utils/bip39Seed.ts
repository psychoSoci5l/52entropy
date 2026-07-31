import { bytesToHex } from './entropy';

export interface DerivedBip39Seed {
  passphrase: string;
  seedHex: string; // 64 bytes = 128 hex chars
  salt: string;
}

/**
 * Derives 512-bit (64-byte) BIP-39 seed using Web Crypto API PBKDF2-HMAC-SHA512 (2048 iterations).
 */
export async function deriveBip39Seed(
  mnemonicPhrase: string,
  passphrase: string = ''
): Promise<DerivedBip39Seed> {
  const encoder = new TextEncoder();
  const passphraseNormalized = passphrase.normalize('NFKD');
  const salt = `mnemonic${passphraseNormalized}`;

  const passwordBuffer = encoder.encode(mnemonicPhrase.normalize('NFKD'));
  const saltBuffer = encoder.encode(salt);

  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 2048,
      hash: 'SHA-512',
    },
    importedKey,
    512 // 512 bits = 64 bytes
  );

  const seedBytes = new Uint8Array(derivedBits);

  return {
    passphrase,
    seedHex: bytesToHex(seedBytes),
    salt,
  };
}
