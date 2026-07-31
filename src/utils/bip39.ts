import { BIP39_ENGLISH_WORDLIST } from './bip39Wordlist';
import { sha256, bytesToHex } from './entropy';

export interface MnemonicWord {
  index: number; // 1 to 12 or 1 to 24
  wordIndex: number; // 0 to 2047
  word: string;
  binaryString: string; // 11-bit binary representation
  isChecksumIncluded?: boolean;
}

export interface MnemonicResult {
  wordCount: 12 | 24;
  entropyBits: number; // 128 or 256
  checksumBits: number; // 4 or 8
  words: MnemonicWord[];
  phrase: string;
  rawEntropyHex: string;
  checksumHex: string;
  fullBinaryBits: string;
}

/**
 * Derives BIP-39 mnemonic phrase from entropy bytes (16 bytes for 12 words, 32 bytes for 24 words).
 */
export async function entropyToMnemonic(
  entropyBytes: Uint8Array,
  wordCount: 12 | 24 = 12
): Promise<MnemonicResult> {
  const reqEntropyLen = wordCount === 12 ? 16 : 32; // 16 bytes = 128 bits, 32 bytes = 256 bits
  const selectedEntropy = entropyBytes.slice(0, reqEntropyLen);

  // Compute SHA-256 hash of selected entropy bytes to get checksum
  const hash = await sha256(selectedEntropy);

  // Convert entropy bytes to binary string
  let entropyBin = '';
  for (let i = 0; i < selectedEntropy.length; i++) {
    entropyBin += selectedEntropy[i].toString(2).padStart(8, '0');
  }

  // Convert first byte of hash to binary string for checksum bits
  const checksumBitsLen = wordCount === 12 ? 4 : 8;
  const hashBin = hash[0].toString(2).padStart(8, '0');
  const checksumBin = hashBin.slice(0, checksumBitsLen);

  // Combined binary sequence
  const combinedBin = entropyBin + checksumBin;

  // Split into 11-bit chunks
  const words: MnemonicWord[] = [];
  const wordCountTarget = wordCount;

  for (let i = 0; i < wordCountTarget; i++) {
    const chunk = combinedBin.slice(i * 11, (i + 1) * 11);
    const wordIdx = parseInt(chunk, 2);
    words.push({
      index: i + 1,
      wordIndex: wordIdx,
      word: BIP39_ENGLISH_WORDLIST[wordIdx],
      binaryString: chunk,
      isChecksumIncluded: i === wordCountTarget - 1,
    });
  }

  const phrase = words.map((w) => w.word).join(' ');

  return {
    wordCount,
    entropyBits: reqEntropyLen * 8,
    checksumBits: checksumBitsLen,
    words,
    phrase,
    rawEntropyHex: bytesToHex(selectedEntropy),
    checksumHex: hash[0].toString(16).padStart(2, '0').slice(0, Math.ceil(checksumBitsLen / 4)),
    fullBinaryBits: combinedBin,
  };
}
