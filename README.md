# 🃏⚡ 52Entropy — Physical Deck to Bitcoin BIP-39 Seed Generator

![52Entropy Interface](public/52entropy_ui_preview.png)

> **Un omaggio all'intuizione di Giacomo Zucco su X (Twitter)**
> 
> *"Calcolare l'entropia equivalente esatta é pallosissimo. Ma un mazzo di 52 carte ben mescolato ha piú di 128 bit. Ci sono metodi non noiosi anche se matematicamente meno eleganti. Un tool che parte dal mazzo e genera seed sul device sarebbe top. :)"*  
> — **Giacomo Zucco** ([@giacomozucco](https://x.com/giacomozucco))

---

## 📋 Indice

1. [Il Problema Iniziale](#-il-problema-iniziale)
2. [Le Soluzioni Tradizionali ed i Loro Limiti](#-le-soluzioni-tradizionali-ed-i-loro-limiti)
3. [L'Intuizione di Giacomo Zucco](#-lintuizione-di-giacomo-zucco)
4. [La Nostra Soluzione: 52Entropy](#-la-nostra-soluzione-52entropy)
5. [Fondamenti Matematici](#-fondamenti-matematici)
6. [Architettura & Sicurezza Air-Gapped](#-architettura--sicurezza-air-gapped)
7. [Guida all'Uso Offline](#-guida-alluso-offline)
8. [Verifica & Suite di Test](#-verifica--suite-di-test)
9. [Ringraziamenti & Licenza](#-ringraziamenti--licenza)

---

## 🚨 Il Problema Iniziale

La generazione di chiavi private Bitcoin si basa in modo critico sull'**entropia** (casualità pura). Tuttavia, fare affidamento esclusivamente su:
- Generatori di numeri pseudo-casuali (PRNG) software integrati nei sistemi operativi,
- Chip hardware o risorse di sistema potenzialmente compromesse o con bug di implementazione,

ha storicamente causato gravi vulnerabilità ed eventi di scioglimento/svuotamento dei wallet. Generare entropia mediante **oggetti fisici reali** (dadi, monete, carte da gioco) elimina ogni dipendenza da hardware invisibile o codice di terze parti.

---

## 🎲 Le Soluzioni Tradizionali ed i Loro Limiti

Quando gli utenti cercano di generare entropia fisica in autonomia:

* **Monete**: Una moneta fornisce 1 bit di entropia per lancio ($H = \log_2(2) = 1$). Generare 128 bit richiede almeno 128 lanci consecutivi con trascrizione manuale di testa/croce ($0/1$). È un processo lungo, noioso e incline ad errori umani.
* **Dadi a 6 facce**: Ogni lancio fornisce $\log_2(6) \approx 2.585$ bit. Richiede circa 50 lanci e complesse tabelle di conversione in base binaria/esadecimale.
* **Carte da gioco**: Un mazzo da 52 carte ben mescolato contiene un'entropia immensa. Tuttavia, **la mappatura manuale da carte a valori binari è estremamente laboriosa** ("pallosissima"), poiché richiede di assegnare indici, verificare i semi e calcolare le permutazioni a mano.

---

## 💡 L'Intuizione di Giacomo Zucco

Durante una discussione su X legata alla sicurezza dei wallet, Luca Venturini obiettava che mappare le carte in binario a mano fosse troppo complesso rispetto ad una moneta. 

Giacomo Zucco ha colto il punto fondamentale:

> **Un singolo mazzo da 52 carte ben mescolato contiene $52!$ permutazioni possibili, equivalenti a $\approx 225.58$ bit di entropia pura.**
> 
> Poiché a Bitcoin servono 128 bit (per 12 parole BIP-39) o 256 bit (per 24 parole), **un mazzo da 52 carte è più che sufficiente**. Non serve fare la matematica a mano: basta un software locale, trasparente e privo di connessione di rete che legga l'ordine delle carte dal mazzo ed estragga l'entropia ed il seed BIP-39 direttamente sul dispositivo.

---

## ⚡ La Nostra Soluzione: 52Entropy

**52Entropy** trasforma questa intuizione in uno strumento web/offline open-source, trasparente e privo di qualsiasi dipendenza di rete:

- 🃏 **Selezione Visiva & Parser Testuale**: Inserisci l'ordine delle carte estratte dal mazzo tramite una griglia visiva o incollando shorthand come `AS 10H KD 2C`.
- 🧮 **Doppio Motore di Entropia**:
  1. **Matematico Esatto (Rango di Lehmer / Factoradic)**: Converte la permutazione del mazzo nel suo numero esatto in $[0, 52!-1]$ tramite `BigInt` locale.
  2. **Pragmatico (Stringa Canonica SHA-256)**: Hashing diretto della sequenza canonica ordinata.
- 🔑 **Standard BIP-39 Compliant**: Generazione di 12 o 24 parole con checksum SHA-256 verificato, **passphrase opzionale (25ª parola)** e derivazione **Master Seed 512-bit (PBKDF2 HMAC-SHA512)**.
- 🛡️ **Air-Gapped Single-File Bundle**: Compilazione in un unico file `.html` autonomo da salvare su USB ed eseguire su hardware disconnesso da Internet.

---

## 📐 Fondamenti Matematici

### 1. Entropia Totale del Mazzo
Il numero totale di modi in cui un mazzo di 52 carte distinte può essere ordinato è dato da $52!$:

$$52! = 80,658,175,170,943,878,571,660,636,856,403,766,975,289,505,440,883,277,824,000,000,000,000$$

L'entropia in bit è espressa da:

$$\text{Entropia} = \log_2(52!) \approx 225.581 \text{ bits}$$

### 2. Confronto Requisiti Bitcoin
- **12 Parole BIP-39**: 128 bit di entropia + 4 bit checksum.
- **24 Parole BIP-39**: 256 bit di entropia + 8 bit checksum.

Poiché $225.58 \text{ bits} > 128 \text{ bits}$, un singolo mazzo mescolato supera abbondantemente i requisiti di casualità per un wallet Bitcoin standard a 12 parole.

---

## 🔒 Architettura & Sicurezza Air-Gapped

- **0 Network Requests**: Nessuna chiamata HTTP, nessun tracker, nessuna libreria esterna caricata via CDN.
- **Web Crypto API**: Crittografia nativa del browser per SHA-256 e PBKDF2 HMAC-SHA512.
- **Maschera di Privacy**: Protezione visiva per nascondere la frase mnemonica da sguardi indesiderati.

---

## 🚀 Guida all'Uso Offline

### Avvio Locale in Sviluppo
```bash
git clone https://github.com/vostro-user/52entropy.git
cd 52entropy
npm install
npm run dev
```

### Generazione File HTML Standalone per Air-Gap
Per generare la versione da caricare su una chiavetta USB:
```bash
npm run build
```
Il file generato in `dist/index.html` è un **bundle auto-contenuto** (~248 kB) che può essere aperto con qualsiasi browser su un PC totalmente privo di connessione Internet.

---

## 🧪 Verifica & Suite di Test

Il progetto include una suite di unit test con **Vitest**:

```bash
npx vitest run
```

### Test Superati (9/9):
- ✅ Mappatura rango 0 per mazzo ordinato
- ✅ Mappatura rango massimo $52! - 1$ per mazzo invertito
- ✅ Validazione intervallo $[0, 52!-1]$ su permutazioni casuali
- ✅ Serializzazione BigInt a 32 byte Big-Endian
- ✅ Derivazione BIP-39 e verifica checksum su 12 e 24 parole
- ✅ Derivazione PBKDF2 HMAC-SHA512 del Master Seed a 512 bit

---

## 🙏 Ringraziamenti & Licenza

Un ringraziamento speciale a **Giacomo Zucco** ([@giacomozucco](https://x.com/giacomozucco)) per aver espresso e diffuso questa intuizione con la consueta chiarezza.

Rilasciato sotto licenza **MIT** — Libero ed open-source per tutta la community Bitcoin.
