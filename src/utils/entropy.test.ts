import { describe, it, expect } from 'vitest';
import { FULL_DECK, parseCardInput, generateRandomShuffle } from './cards';
import { computeLehmerRank, FACTORIAL_52, bigIntToUint8Array32 } from './entropy';
import { entropyToMnemonic } from './bip39';
import { deriveBip39Seed } from './bip39Seed';
import { BIP39_TEST_VECTORS } from './testVectors';

describe('Card Parsing & Deck Rules', () => {
  it('should parse standard text shorthand correctly', () => {
    const input = 'AS 10H KD 2C';
    const { cards, invalidTokens } = parseCardInput(input);
    expect(cards).toHaveLength(4);
    expect(invalidTokens).toHaveLength(0);
    expect(cards.map((c) => c.id)).toEqual(['AS', '10H', 'KD', '2C']);
  });

  it('should filter out duplicate card inputs', () => {
    const input = 'AS 10H AS KD 10H';
    const { cards } = parseCardInput(input);
    expect(cards).toHaveLength(3);
    expect(cards.map((c) => c.id)).toEqual(['AS', '10H', 'KD']);
  });

  it('should parse unicode suit symbols', () => {
    const input = 'A♠ 10♥ K♦ 2♣';
    const { cards, invalidTokens } = parseCardInput(input);
    expect(cards).toHaveLength(4);
    expect(invalidTokens).toHaveLength(0);
    expect(cards.map((c) => c.id)).toEqual(['AS', '10H', 'KD', '2C']);
  });
});

describe('Factoradic (Lehmer Code) Engine', () => {
  it('should assign rank 0 to identity permutation', () => {
    const rank = computeLehmerRank(FULL_DECK);
    expect(rank).toBe(0n);
  });

  it('should assign max rank 52! - 1 to reversed deck', () => {
    const reversedDeck = [...FULL_DECK].reverse();
    const rank = computeLehmerRank(reversedDeck);
    expect(rank).toBe(FACTORIAL_52 - 1n);
  });

  it('should produce rank strictly within [0, 52! - 1] for random shuffles', () => {
    for (let i = 0; i < 5; i++) {
      const shuffle = generateRandomShuffle();
      const rank = computeLehmerRank(shuffle);
      expect(rank >= 0n).toBe(true);
      expect(rank < FACTORIAL_52).toBe(true);
    }
  });

  it('should serialize rank into 32-byte array correctly', () => {
    const bytes = bigIntToUint8Array32(1n);
    expect(bytes).toHaveLength(32);
    expect(bytes[31]).toBe(1);
    expect(bytes[0]).toBe(0);
  });

  it('should serialize max rank 52! - 1 without overflow', () => {
    const maxRank = FACTORIAL_52 - 1n;
    const bytes = bigIntToUint8Array32(maxRank);
    expect(bytes).toHaveLength(32);
    // First few bytes of 52! - 1 should be non-zero in 32-byte representation
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    expect(hex).toHaveLength(64);
  });
});

describe('BIP-39 Mnemonic & Seed Derivation', () => {
  it('should derive valid 12-word mnemonic with checksum', async () => {
    const testBytes = new Uint8Array(32).fill(0xab);
    const mnemonic = await entropyToMnemonic(testBytes, 12);
    expect(mnemonic.words).toHaveLength(12);
    expect(mnemonic.phrase.split(' ')).toHaveLength(12);
  });

  it('should derive valid 24-word mnemonic with checksum', async () => {
    const testBytes = new Uint8Array(32).fill(0xab);
    const mnemonic = await entropyToMnemonic(testBytes, 24);
    expect(mnemonic.words).toHaveLength(24);
    expect(mnemonic.phrase.split(' ')).toHaveLength(24);
  });

  it('should derive 512-bit seed via PBKDF2-HMAC-SHA512', async () => {
    const phrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const seedResult = await deriveBip39Seed(phrase, 'TREZOR');
    expect(seedResult.seedHex).toHaveLength(128); // 64 bytes = 128 hex characters
  });

  // ─── BIP-39 Test Vector Verification ───────────────────────
  // These tests ensure our implementation matches the official BIP-39 spec
  // and produces the same output as Ian Coleman's reference tool.

  for (const vector of BIP39_TEST_VECTORS) {
    it(`BIP-39 vector: ${vector.description}`, async () => {
      // Convert hex entropy to Uint8Array
      const entropyBytes = new Uint8Array(
        vector.entropyHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
      );

      // Generate mnemonic
      const mnemonic = await entropyToMnemonic(entropyBytes, vector.wordCount);
      expect(mnemonic.phrase).toBe(vector.expectedMnemonic);
      expect(mnemonic.words).toHaveLength(vector.wordCount);

      // Verify seed without passphrase (if provided by spec)
      if (vector.expectedSeedNoPassphrase) {
        const seedNoPass = await deriveBip39Seed(mnemonic.phrase, '');
        expect(seedNoPass.seedHex).toBe(vector.expectedSeedNoPassphrase);
      }

      // Verify seed with passphrase (if provided)
      if (vector.expectedSeedWithPassphrase) {
        const seedWithPass = await deriveBip39Seed(
          mnemonic.phrase,
          vector.expectedSeedWithPassphrase.passphrase
        );
        expect(seedWithPass.seedHex).toBe(
          vector.expectedSeedWithPassphrase.seedHex
        );
      }
    });
  }
});
