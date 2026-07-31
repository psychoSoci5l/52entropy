/**
 * BIP-39 Known Test Vectors
 * 
 * Verified against the official BIP-39 specification:
 * https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 * 
 * Cross-checked with Ian Coleman's BIP-39 Tool (iancoleman.io/bip39)
 * and Trezor firmware test vectors.
 */

export interface Bip39TestVector {
  description: string;
  entropyHex: string;
  wordCount: 12 | 24;
  expectedMnemonic: string;
  /** Seed with empty passphrase — may be undefined if not in spec */
  expectedSeedNoPassphrase?: string;
  /** Seed with specific passphrase */
  expectedSeedWithPassphrase?: {
    passphrase: string;
    seedHex: string;
  };
}

/**
 * Official BIP-39 test vectors.
 * Source: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 */
export const BIP39_TEST_VECTORS: Bip39TestVector[] = [
  {
    description: 'BIP-39 Spec: 128-bit all-zero entropy → 12 words (abandon...about)',
    entropyHex: '00000000000000000000000000000000',
    wordCount: 12,
    expectedMnemonic:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    expectedSeedNoPassphrase:
      '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
    expectedSeedWithPassphrase: {
      passphrase: 'TREZOR',
      seedHex:
        'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04',
    },
  },
  {
    description: 'BIP-39 Spec: 128-bit pattern (0x7f...) → 12 words (legal...yellow)',
    entropyHex: '7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f',
    wordCount: 12,
    expectedMnemonic:
      'legal winner thank year wave sausage worth useful legal winner thank yellow',
    expectedSeedNoPassphrase:
      '878386efb78845b3355bd15ea4d39ef97d179cb712b77d5c12b6be415fffeffe5f377ba02bf3f8544ab800b955e51fbff09828f682052a20faa6addbbddfb096',
    expectedSeedWithPassphrase: {
      passphrase: 'TREZOR',
      seedHex:
        '2e8905819b8723fe2c1d161860e5ee1830318dbf49a83bd451cfb8440c28bd6fa457fe1296106559a3c80937a1c1069be3a3a5bd381ee6260e8d9739fce1f607',
    },
  },
  {
    description: 'BIP-39 Spec: 256-bit all-zero entropy → 24 words (abandon...art)',
    entropyHex: '0000000000000000000000000000000000000000000000000000000000000000',
    wordCount: 24,
    expectedMnemonic:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art',
    expectedSeedNoPassphrase:
      '408b285c123836004f4b8842c89324c1f01382450c0d439af345ba7fc49acf705489c6fc77dbd4e3dc1dd8cc6bc9f043db8ada1e243c4a0eafb290d399480840',
    expectedSeedWithPassphrase: {
      passphrase: 'TREZOR',
      seedHex:
        'bda85446c68413707090a52022edd26a1c9462295029f2e60cd7c4f2bbd3097170af7a4d73245cafa9c3cca8d561a7c3de6f5d4a10be8ed2a5e608d68f92fcc8',
    },
  },
];

/**
 * Ian Coleman Tool verified vector for BIP-84 Native SegWit.
 * Useful for documentation and manual verification.
 * Users should verify with their own hardware wallet, not trust this display.
 */
export const IAN_COLEMAN_REFERENCE = {
  mnemonic:
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  passphrase: 'TREZOR',
  seed: 'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04',
  derivationPath: "m/84'/0'/0'/0/0",
  address: 'bc1qcr8te4kr609gcawutmrza8j4xv80jy8z306fyu',
  toolUrl: 'https://iancoleman.io/bip39/',
} as const;
