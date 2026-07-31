# Deck Entropy — Bitcoin Seed Generator 🃏⚡

> **Inspired by Giacomo Zucco's Vision on X / Twitter**
> 
> *"Calcolare l'entropia equivalente esatta é pallosissimo. Ma un mazzo di 52 carte ben mescolato ha piú di 128 bit. Ci sono metodi non noiosi anche se matematicamente meno eleganti. Un tool che parte dal mazzo e genera seed sul device sarebbe top. :)"*
> — [@giacomozucco](https://x.com/giacomozucco)

---

## 📌 Overview

**Deck Entropy** is an open-source, 100% client-side, air-gapped security tool designed to derive cryptographically secure **Bitcoin BIP-39 seed phrases** (12 or 24 words) directly from a physical, shuffled 52-card playing deck.

No tedious binary conversions, no manual dice rolling, and **zero network calls**. You simply unpack your physical deck, enter the card order via the visual card picker or text shorthand, and the application computes the exact mathematical entropy and derives your BIP-39 seed mnemonic.

---

## 🧮 Mathematical & Cryptographic Foundation

### 1. Entropy of a Shuffled Deck
A standard deck of 52 playing cards has $52!$ (52 factorial) possible permutations:

$$52! = 80,658,175,170,943,878,571,660,636,856,403,766,975,289,505,440,883,277,824,000,000,000,000$$

The total information entropy in bits provided by a well-shuffled 52-card deck is:

$$\text{Entropy} = \log_2(52!) \approx 225.58 \text{ bits}$$

### 2. Bitcoin BIP-39 Requirements
- **12 Mnemonic Words**: Requires **128 bits** of entropy (+ 4-bit checksum = 132 bits).
- **24 Mnemonic Words**: Requires **256 bits** of entropy (+ 8-bit checksum = 264 bits).

Since $225.58 \text{ bits} \gg 128 \text{ bits}$, a single well-shuffled 52-card deck provides far more entropy than needed for a standard 12-word Bitcoin wallet seed.

---

## ⚡ Dual Entropy Engines

This tool provides two selectable calculation engines:

1. **Exact Factoradic (Lehmer Rank) Engine** *(Mathematically Rigorous)*:
   - Computes the exact rank $R \in [0, 52! - 1]$ of the card permutation using Lehmer coding.
   - Maps the arbitrary-precision BigInt rank directly to a 32-byte array.
   - Computes SHA-256 of the rank bytes to guarantee uniform bit distribution for BIP-39 entropy.
2. **Canonical String Hashing Engine** *(Giacomo's "Non-Boring" Pragmatic Approach)*:
   - Formats the 52-card order into a canonical string (e.g. `AS,10H,KD,2C,...`).
   - Computes the SHA-256 digest of the canonical string to yield 256 bits of entropy.

---

## 🛡️ Security & Air-Gapped Air-Gap Design

- **100% Offline**: 0 network requests, 0 external APIs, 0 tracking.
- **Native Web Crypto**: Uses browser-native `crypto.subtle` for SHA-256 hashing.
- **Local Memory Privacy**: Includes a **Hide/Show Seed** privacy mask to shield your screen against shoulder surfing and screen recorders.
- **Standalone HTML Export**: Export a single, self-contained `.html` bundle with one click to take to an air-gapped computer or Raspberry Pi.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 📄 License

MIT License — Free and open for the Bitcoin community.
