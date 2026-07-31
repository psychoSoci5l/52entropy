import type { Card } from './cards';

/**
 * Computes the exact BigInt factorial of n.
 */
export function bigintFactorial(n: number): bigint {
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

export const FACTORIAL_52 = bigintFactorial(52);
export const TOTAL_ENTROPY_BITS = 225.5810031238644;

/**
 * Computes the exact Factoradic (Lehmer code) rank of a 52-card permutation.
 * Input: array of 52 unique Cards.
 * Output: BigInt rank in range [0, 52! - 1].
 */
export function computeLehmerRank(cards: Card[]): bigint {
  if (cards.length !== 52) {
    throw new Error('Permutation must contain exactly 52 cards.');
  }

  const indices = cards.map((c) => c.deckIndex);
  let rank = 0n;

  for (let i = 0; i < 52; i++) {
    let count = 0n;
    for (let j = i + 1; j < 52; j++) {
      if (indices[j] < indices[i]) {
        count++;
      }
    }
    const nRemaining = 51 - i;
    rank += count * bigintFactorial(nRemaining);
  }

  return rank;
}

/**
 * Converts BigInt to Uint8Array (32 bytes Big-Endian).
 */
export function bigIntToUint8Array32(bigint: bigint): Uint8Array {
  const hex = bigint.toString(16).padStart(64, '0').slice(-64); // 64 hex chars = 32 bytes
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Computes SHA-256 digest of Uint8Array or string using Web Crypto API.
 */
export async function sha256(data: Uint8Array | string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const rawBytes = typeof data === 'string' ? encoder.encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', rawBytes.buffer as ArrayBuffer);
  return new Uint8Array(hashBuffer);
}

/**
 * Converts Uint8Array to Hex string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts Uint8Array to Binary string.
 */
export function bytesToBinaryString(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(2).padStart(8, '0'))
    .join('');
}

export type EntropyEngineType = 'factoradic' | 'sha256_string';

export interface EntropyCalculationResult {
  engine: EntropyEngineType;
  cardCount: number;
  isComplete: boolean;
  lehmerRankHex?: string;
  lehmerRankBigInt?: string;
  canonicalString?: string;
  entropyBytes: Uint8Array; // 32 bytes
  entropyHex: string;
  bitsOfEntropy: number;
}

/**
 * Main entropy calculation pipeline.
 */
export async function calculateDeckEntropy(
  cards: Card[],
  engine: EntropyEngineType = 'factoradic'
): Promise<EntropyCalculationResult> {
  const isComplete = cards.length === 52;
  const canonicalString = cards.map((c) => c.id).join(',');

  if (!isComplete) {
    // Partial deck hash for real-time preview
    const rawHash = await sha256(canonicalString || 'empty');
    return {
      engine,
      cardCount: cards.length,
      isComplete: false,
      canonicalString,
      entropyBytes: rawHash,
      entropyHex: bytesToHex(rawHash),
      bitsOfEntropy: (cards.length / 52) * 225.58,
    };
  }

  if (engine === 'factoradic') {
    const rankBigInt = computeLehmerRank(cards);
    const rankHex = rankBigInt.toString(16).padStart(64, '0');
    // SHA-256 of the exact rank bytes ensures cryptographic uniformity for BIP-39 entropy
    const rankBytes = bigIntToUint8Array32(rankBigInt);
    const entropyBytes = await sha256(rankBytes);
    return {
      engine: 'factoradic',
      cardCount: 52,
      isComplete: true,
      lehmerRankHex: rankHex,
      lehmerRankBigInt: rankBigInt.toString(10),
      canonicalString,
      entropyBytes,
      entropyHex: bytesToHex(entropyBytes),
      bitsOfEntropy: 225.58,
    };
  } else {
    // SHA-256 of Canonical String
    const entropyBytes = await sha256(canonicalString);
    return {
      engine: 'sha256_string',
      cardCount: 52,
      isComplete: true,
      canonicalString,
      entropyBytes,
      entropyHex: bytesToHex(entropyBytes),
      bitsOfEntropy: 225.58,
    };
  }
}
