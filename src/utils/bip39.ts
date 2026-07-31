import { BIP39_ENGLISH_WORDLIST } from './bip39Wordlist';
import { sha256, bytesToHex } from './entropy';

export interface MnemonicWord {
  index: number;
  wordIndex: number;
  word: string;
  binaryString: string;
  isChecksumIncluded?: boolean;
}

export interface MnemonicResult {
  wordCount: 12 | 24;
  entropyBits: number;
  checksumBits: number;
  words: MnemonicWord[];
  phrase: string;
  rawEntropyHex: string;
  checksumHex: string;
  fullBinaryBits: string;
}

export async function entropyToMnemonic(
  entropyBytes: Uint8Array,
  wordCount: 12 | 24 = 12
): Promise<MnemonicResult> {
  const reqEntropyLen = wordCount === 12 ? 16 : 32;
  const selectedEntropy = entropyBytes.slice(0, reqEntropyLen);
  const hash = await sha256(selectedEntropy);

  let entropyBin = '';
  for (let i = 0; i < selectedEntropy.length; i++) {
    entropyBin += selectedEntropy[i].toString(2).padStart(8, '0');
  }

  const checksumBitsLen = wordCount === 12 ? 4 : 8;
  const hashBin = hash[0].toString(2).padStart(8, '0');
  const checksumBin = hashBin.slice(0, checksumBitsLen);

  const combinedBin = entropyBin + checksumBin;

  const words: MnemonicWord[] = [];
  for (let i = 0; i < wordCount; i++) {
    const chunk = combinedBin.slice(i * 11, (i + 1) * 11);
    const wordIdx = parseInt(chunk, 2);
    words.push({
      index: i + 1,
      wordIndex: wordIdx,
      word: BIP39_ENGLISH_WORDLIST[wordIdx],
      binaryString: chunk,
      isChecksumIncluded: i === wordCount - 1,
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
