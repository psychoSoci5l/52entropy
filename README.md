# 🃏⚡ 52Entropy — Physical Deck to Bitcoin BIP-39 Seed Generator

<p align="center">
  <img src="public/52entropy_ui_demo.png" alt="52Entropy — Demo shuffle with entropy calculation and BIP-39 mnemonic" width="720" />
</p>

<p align="center">
  <img src="public/52entropy_ui_tour.gif" alt="52Entropy UI Tour — empty state, demo, revealed seed" width="720" />
</p>

<p align="center">
  <strong>14/14 tests passing</strong>   |  
  <strong>Zero network calls</strong>   |  
  <strong>MIT License</strong>
</p>

> **Dall'intuizione di Giacomo Zucco:**  
> *"Un mazzo di 52 carte ben mescolato ha più di 128 bit. Un tool che parte dal mazzo e genera seed sul device sarebbe top. :)"*  
> — **[@giacomozucco](https://x.com/giacomozucco)**

---

**52Entropy** trasforma l'ordine di un mazzo di carte da gioco in un seed Bitcoin BIP-39 (12 o 24 parole). Zero network calls, zero tracker, zero fiducia richiesta. Open-source, MIT.

---

## ✨ Perché 52Entropy

| Problema | Soluzione |
|----------|-----------|
| Hardware wallet con RNG potenzialmente compromesso | Entropia da **oggetto fisico** (mazzo di carte) |
| Seed generati con PRNG software | **Rango di Lehmer deterministico** su 52! permutazioni |
| Strumenti online che potrebbero rubare il seed | **Single-file HTML** da eseguire su computer **air-gapped** |
| Mappatura manuale carte→binario noiosa | **Selezione visiva** o **input testuale** |
| Impossibilità di verificare il risultato | **14 test** + vettori BIP-39 ufficiali + codice ispezionabile |

---

## 🧮 La Matematica

Un mazzo da 52 carte ben mescolato ha `52!` permutazioni possibili:

$$log_2(52!) \approx 225.58\text{ bit}$$

> Più che sufficiente per **12 parole** (128 bit) o **24 parole** (256 bit con SHA-256).

L'algoritmo usa il **codice di Lehmer (factoradic)** per assegnare un rango esatto a ogni permutazione, poi SHA-256 per uniformare i bit.

---

## 🎯 Il Metodo Zucco — Implementato Passo per Passo

> **Luglio 2026.** La discussione sulla vulnerabilità ColdCard Mk3 ha riacceso l'attenzione sull'entropia fisica. Giacomo Zucco ha descritto il metodo manuale per derivare un seed BIP-39 da un mazzo di carte. **52Entropy lo implementa integralmente, con un miglioramento crittografico.**

### Confronto Passo per Passo

| # | Metodo Manuale (Zucco) | 52Entropy | Verdetto |
|---|---|---|---|
| 1 | Assegna a ogni carta un numero 0–51 (es. Quadri A=0) | `deckIndex` 0–51: Picche 0-12, Cuori 13-25, Quadri 26-38, Fiori 39-51 | ✅ Stesso principio |
| 2 | Calcola rango della permutazione con **Lehmer code** → R | `computeLehmerRank()` — BigInt nativo, complessità O(n²) | ✅ Identico |
| 3 | Prendi i **128 bit più significativi** di R, oppure usa modulo → S | **SHA-256(R)** → primi 128 bit. Hash crittografico come estrattore di uniformità | ⚡ **Superiore** |
| 4 | Checksum = primi **4 bit** di SHA-256(S) | `SHA-256(S)[0] >> 4` | ✅ Identico |
| 5 | Concatena: 128 bit + 4 bit = **132 bit** | Entropia + checksum = 132 bit | ✅ Identico |
| 6 | Dividi in **12 gruppi da 11 bit** | Split ogni 11 bit, conversione binaria | ✅ Identico |
| 7 | Pesca parole dalla **wordlist BIP-39** inglese | `BIP39_ENGLISH_WORDLIST` ufficiale (2048 parole) | ✅ Identico |

### Perché SHA-256(R) invece degli MSB?

`52!` **non è una potenza di 2**. I bit più significativi di un numero in `[0, 52!-1]` hanno una distribuzione **non uniforme** — alcune combinazioni di bit sono impossibili nel range. Prendere gli MSB direttamente introduce un bias sottile ma reale.

**SHA-256 è un estrattore di casualità crittografica**: produce 256 bit perfettamente uniformi indipendentemente dal bias dell'input. È lo stesso approccio usato da BIP-39 per il checksum.

### Provato Matematicamente

```typescript
// Test: identità → rango 0
computeLehmerRank(FULL_DECK) === 0n                    // ✅

// Test: mazzo invertito → rango 52! - 1
computeLehmerRank(reversedDeck) === FACTORIAL_52 - 1n  // ✅

// Test: 5 mescolate casuali → rango ∈ [0, 52!-1]
for (5 random shuffles) rank ∈ [0, 52!-1]              // ✅

// Test: vettori BIP-39 ufficiali (Trezor spec)
'abandon...about' + 'TREZOR' → seed verificato           // ✅
'legal...yellow'  + 'TREZOR' → seed verificato           // ✅
'abandon...art' (24w)         → seed verificato           // ✅
```

### ColdCard & Hardware Wallet — Perché Usare Entropia Fisica

Con la recente discussione sulla vulnerabilità ColdCard Mk3, il consiglio di Giacomo è chiaro:

> *"Se hai somme significative su chiavi generate da ColdCard senza un adeguato lancio di dadi e senza passphrase forte, SPOSTALI ORA."*

**52Entropy risolve il problema alla radice**: generi l'entropia tu, con un mazzo di carte fisico, su un computer air-gapped. Nessun RNG hardware da cui fidarsi. Poi importi il seed nel tuo hardware wallet preferito e verifichi l'impronta.

---

## 🔒 Air-Gapped by Design

- **0 chiamate di rete** — nessuna `fetch()`, nessun CDN, nessun Google Fonts
- **System font stack** — rendering identico su qualsiasi OS, offline
- **Single-file HTML** — ~250 KB, eseguibile su qualsiasi browser
- **Web Crypto API** — SHA-256 e PBKDF2 nativi
- **Codice ispezionabile** — `src/utils/` contiene tutta la logica crypto

### 🔬 Verifica Indipendente

Non fidarti solo dell'app. Dopo aver generato il seed:

1. **Hardware wallet**: Importa la frase mnemonica nel tuo Coldcard/Trezor/Ledger e verifica l'impronta
2. **Ian Coleman Tool**: Usa lo [strumento BIP-39](https://iancoleman.io/bip39/) **offline** per verificare il master seed
3. **Test vectors**: Il nostro test `abandon...about + TREZOR` è verificato contro la specifica BIP-39

---

## 🚀 Utilizzo

### Online (solo per test)
👉 [52entropy.com](https://52entropy.com)

### Offline (per seed reali)

```bash
git clone https://github.com/52Entropy/52entropy.git
cd 52entropy
npm install
npm run build          # → dist/index.html (standalone)
npx vitest run         # 14/14 test devono passare
```

Poi copia `dist/index.html` su chiavetta USB e aprilo su un computer **air-gapped**.

---

## 🧪 Test Suite

```bash
npx vitest run
```

```
✓ Card parsing & duplicate detection
✓ Factoradic rank: identity (0), reversed (52! - 1), random shuffles
✓ BigInt serialization to 32 bytes
✓ BIP-39 vectors: 3 official test vectors verified
  ├─ abandon...about + TREZOR ✓
  ├─ legal...yellow + TREZOR ✓
  └─ abandon...art (24w) + TREZOR ✓
```

---

## 📚 Documentazione

- 📖 **[Tutorial Completo](TUTORIAL.md)** — 7 fasi, dalla mescolata al seed verificato
- ❓ **[FAQ](FAQ.md)** — sicurezza, matematica, troubleshooting
- 🤝 **[CONTRIBUTING](CONTRIBUTING.md)** — struttura codice, setup, linee guida
- 🔬 **[Audit Roadmap](AUDIT_ROADMAP.md)** — gap analysis e miglioramenti futuri

---

## 🏗️ Stack

| Cosa | Tecnologia |
|------|-----------|
| UI | React 19 + TypeScript 6 |
| Build | Vite 8 + `vite-plugin-singlefile` |
| Test | Vitest 4 |
| Crypto | Web Crypto API (SHA-256, PBKDF2) |
| Matematica | BigInt nativo (Lehmer / factoradic) |
| Icone | Lucide React |
| Dipendenze esterne | **Zero** oltre a React e Lucide |

---

## 🙏 Crediti

A **Giacomo Zucco** ([@giacomozucco](https://x.com/giacomozucco)) per l'intuizione originale e per il suo lavoro di educazione Bitcoin.

> *"Bitcoin non è una tecnologia finanziaria, ma una rivoluzione monetaria, sociale e politica."*

---

## 📄 Licenza

MIT — [LICENSE](LICENSE)
