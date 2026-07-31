# 🔒 52Entropy — Domande Frequenti (FAQ)

## Matematica e Entropia

### Perché 225.58 bit quando a Bitcoin servono solo 128 o 256 bit?

Un mazzo da 52 carte ben mescolato ha `52!` (52 fattoriale) possibili ordinamenti. L'entropia in bit è `log₂(52!) ≈ 225.58`. 

Per il BIP-39:
- **12 parole** = 128 bit di entropia + 4 bit di checksum → 132 bit
- **24 parole** = 256 bit di entropia + 8 bit di checksum → 264 bit

225.58 > 128, quindi un mazzo mescolato è **più che sufficiente** per 12 parole. Per 24 parole servirebbero ~256 bit, ma:
1. Il rango di Lehmer (0 → 52!-1) viene passato attraverso SHA-256, producendo 256 bit uniformi.
2. L'entropia "effettiva" è limitata a 225.58 bit, ma per applicazioni pratiche è computazionalmente indistinguibile da 256 bit casuali.
3. Se vuoi il massimo, usa due mazzi mescolati indipendentemente.

### Cosa significa "Codice di Lehmer" / "Factoradic"?

È un sistema matematico che assegna un numero univoco a ogni possibile permutazione di un insieme. Per 52 carte, ogni permutazione ha un rango compreso tra `0` e `52! - 1`. Questo rango **codifica esattamente l'ordine** — non c'è perdita di informazione.

### Perché fate SHA-256 del rango invece di usarlo direttamente?

Il rango di Lehmer non è distribuito uniformemente nei suoi bit più significativi. Passarlo attraverso SHA-256 garantisce:
1. Distribuzione uniforme dei bit
2. Resistenza a eventuali bias nel mescolamento
3. Compatibilità con lo standard BIP-39 (che richiede 128-256 bit di entropia uniforme)

### Il motore "Pragmatico (SHA-256 String)" è sicuro?

È un'alternativa più semplice: fa l'hash della sequenza canonica delle carte (es. `"AS,10H,KD,2C,..."`). È deterministico e riproducibile, ma **non conserva l'intera entropia del mazzo** — SHA-256 tronca a 256 bit. Il motore Factoradic è la scelta matematicamente superiore.

---

## Sicurezza e Air-Gap

### Come faccio a essere sicuro che l'app non rubi il mio seed?

52Entropy è progettato per funzionare **completamente offline**:

1. **Zero chiamate di rete**: Il codice non fa mai `fetch()`, `XMLHttpRequest`, WebSocket, o beacon.
2. **Nessuna dipendenza CDN**: Dal 31 luglio 2026, tutti i font sono system-native (nessun Google Fonts).
3. **Single-file HTML**: Il build produce un unico file `.html` auto-contenuto (~250 KB).
4. **Codice open-source**: Ogni riga è ispezionabile su GitHub.

**Procedura di verifica consigliata:**
1. Clona il repository
2. Ispeziona il codice (in particolare `src/utils/bip39.ts` e `src/utils/entropy.ts`)
3. Esegui `npm run build`
4. Copia `dist/index.html` su una chiavetta USB
5. Apri il file su un computer **mai connesso a Internet**
6. Verifica il seed generato con un wallet hardware (Trezor, Coldcard, Ledger)

### L'app funziona su un computer air-gapped?

Sì. Il file `dist/index.html` è completamente auto-contenuto. Aprilo con qualsiasi browser moderno (Chromium, Firefox, Safari) su un computer senza connessione di rete. Non serve installare nulla.

### Come posso verificare che il seed generato sia corretto?

1. **Test vector integrato**: L'app viene testata automaticamente contro i vettori ufficiali BIP-39 (abandon...about + TREZOR).
2. **Verifica con wallet hardware**: Inserisci la frase mnemonica nel tuo Coldcard/Trezor/Ledger e verifica che generi gli stessi indirizzi.
3. **Ian Coleman Tool**: Usa lo [strumento BIP-39 di Ian Coleman](https://iancoleman.io/bip39/) (offline!) per verificare i seed.

---

## Utilizzo Pratico

### Devo per forza inserire tutte e 52 le carte?

Sì, per generare il seed BIP-39 è necessario l'ordine completo del mazzo. La progress bar ti mostra quante carte hai inserito.

### Cosa succede se sbaglio l'ordine di una carta?

Il seed generato sarà completamente diverso — anche un solo errore produce una permutazione diversa e quindi un seed diverso. Usa i pulsanti **Undo** per correggere o **Reset** per ricominciare.

### Posso usare un mazzo parziale (es. 32 carte)?

No, 52Entropy è progettato per il mazzo standard da 52 carte (francese). Mazzi diversi (ramino, poker ridotto) non sono supportati perché la matematica del rango di Lehmer dipende dal numero esatto di carte.

### La passphrase BIP-39 (25ª parola) è obbligatoria?

No, è opzionale. La passphrase aggiunge un ulteriore strato di sicurezza: anche se qualcuno scopre le tue 12/24 parole, senza la passphrase non può accedere ai fondi. Scegli una passphrase **memorabile ma non banale**.

### Quale derivation path viene usato?

L'app mostra il **BIP-39 Master Seed** (512 bit). La derivazione degli indirizzi specifici (BIP-84 per Native SegWit `bc1q...`) dipende dal wallet che usi. Il derivation path standard per Native SegWit è `m/84'/0'/0'/0/0`.

---

## Sviluppo e Community

### Perché è stato creato 52Entropy?

L'idea originale è di **Giacomo Zucco** ([@giacomozucco](https://x.com/giacomozucco)), che ha osservato:

> *"Un mazzo di 52 carte ben mescolato ha più di 128 bit. Un tool che parte dal mazzo e genera seed sul device sarebbe top."*

52Entropy è l'implementazione open-source di questa visione.

### Posso contribuire?

Certo! Il progetto è MIT-licensed. Apri una issue o una PR su GitHub. Vedi [CONTRIBUTING.md](CONTRIBUTING.md).

### Come faccio a eseguire i test?

```bash
git clone https://github.com/52Entropy/52entropy.git
cd 52entropy
npm install
npx vitest run
```

I test includono:
- Verifica del rango di Lehmer (0 e 52!-1)
- Test vector BIP-39 ufficiali (3 vettori, mnemonico + seed)
- Parsing delle carte e gestione duplicati
