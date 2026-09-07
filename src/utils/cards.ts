export type Suit = 'S' | 'H' | 'D' | 'C';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;        // e.g. "AS", "10H", "KD"
  suit: Suit;
  rank: Rank;
  rankIndex: number; // 0 to 12
  suitIndex: number; // 0 to 3
  deckIndex: number; // 0 to 51 (canonical ordering)
  symbol: string;    // '♠', '♥', '♦', '♣'
  suitName: string;  // 'Picche', 'Cuori', 'Quadri', 'Fiori'
  suitNameEn: string;
  isRed: boolean;
}

export const SUITS: { code: Suit; symbol: string; name: string; nameEn: string; isRed: boolean }[] = [
  { code: 'S', symbol: '♠', name: 'Picche', nameEn: 'Spades', isRed: false },
  { code: 'H', symbol: '♥', name: 'Cuori', nameEn: 'Hearts', isRed: true },
  { code: 'D', symbol: '♦', name: 'Quadri', nameEn: 'Diamonds', isRed: true },
  { code: 'C', symbol: '♣', name: 'Fiori', nameEn: 'Clubs', isRed: false },
];

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Generate standard 52-card deck in canonical order (Spades 0-12, Hearts 13-25, Diamonds 26-38, Clubs 39-51)
export const FULL_DECK: Card[] = SUITS.flatMap((suitObj, suitIdx) =>
  RANKS.map((rank, rankIdx) => {
    const id = `${rank}${suitObj.code}`;
    const deckIndex = suitIdx * 13 + rankIdx;
    return {
      id,
      suit: suitObj.code,
      rank,
      rankIndex: rankIdx,
      suitIndex: suitIdx,
      deckIndex,
      symbol: suitObj.symbol,
      suitName: suitObj.name,
      suitNameEn: suitObj.nameEn,
      isRed: suitObj.isRed,
    };
  })
);

export const CARD_MAP = new Map<string, Card>(FULL_DECK.map((c) => [c.id, c]));

/**
 * Parses user input strings like "AS 10H KD 2C" or "A♠ 10♥ K♦ 2♣" or comma/space separated text.
 * Returns array of matched Cards and any invalid/unmatched tokens.
 */
export function parseCardInput(text: string): { cards: Card[]; invalidTokens: string[] } {
  // Normalize unicode suit symbols to letter codes
  let normalized = text
    .replace(/♠/g, 'S')
    .replace(/♥/g, 'H')
    .replace(/♦/g, 'D')
    .replace(/♣/g, 'C')
    .toUpperCase();

  // Split by whitespace, commas, dashes
  const tokens = normalized.split(/[\s,;\n]+/).filter(Boolean);
  const cards: Card[] = [];
  const invalidTokens: string[] = [];
  const seenIds = new Set<string>();

  for (const token of tokens) {
    const card = CARD_MAP.get(token);
    if (card) {
      if (!seenIds.has(card.id)) {
        seenIds.add(card.id);
        cards.push(card);
      }
    } else {
      invalidTokens.push(token);
    }
  }

  return { cards, invalidTokens };
}

/**
 * Fisher-Yates shuffle using a cryptographically secure random source
 * (crypto.getRandomValues with rejection sampling to avoid modulo bias).
 *
 * Even though the demo shuffle is not a substitute for a physically shuffled
 * deck, using a CSPRNG removes any risk of a predictable software-generated
 * seed being mistaken for a real one.
 */
export function generateRandomShuffle(): Card[] {
  const deck = [...FULL_DECK];
  const rng = new Uint32Array(1);

  for (let i = deck.length - 1; i > 0; i--) {
    // Rejection sampling: draw uniform u in [0, 2^32), accept only values
    // below the largest multiple of (i + 1) to avoid modulo bias.
    const bound = i + 1;
    const limit = Math.floor(0x100000000 / bound) * bound;
    let j: number;
    do {
      crypto.getRandomValues(rng);
      j = rng[0] % bound;
    } while (rng[0] >= limit);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
