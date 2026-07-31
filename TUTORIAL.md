# 🎓 52Entropy — Tutorial Completo

> **Obiettivo**: Generare un seed Bitcoin BIP-39 usando un mazzo di 52 carte da gioco, senza fidarsi di nessun computer.

---

## 📦 Cosa ti serve

| Oggetto | Note |
|---------|------|
| Un mazzo da **52 carte francesi** (completo, senza jolly) | Puoi usare qualsiasi mazzo: Bicycle, Copag, Modiano... |
| Una **chiavetta USB** (opzionale ma consigliata) | Per il file air-gapped |
| Un **computer air-gapped** (opzionale ma consigliato) | Anche un vecchio laptop senza WiFi va bene |
| Pazienza per mescolare bene | Ci vogliono almeno 7-10 mescolate a riffle |

---

## 🔀 Fase 1: Mescola il Mazzo

Questa è la parte **più importante**. Un mazzo mal mescolato produce entropia insufficiente.

### Tecnica consigliata: Riffle Shuffle (+ wash)

1. **Wash iniziale**: Spargi le carte a faccia in giù su un tavolo e mescolale a mano per 30 secondi.
2. **7 Riffle Shuffle**: Dividi il mazzo in due metà uguali e fai la mescolata "a ponte". Ripeti 7 volte. [Studi matematici](https://en.wikipedia.org/wiki/Gilbert%E2%80%93Shannon%E2%80%93Reeds_model) dimostrano che 7 riffle shuffle sono sufficienti per randomizzare un mazzo da 52 carte.
3. **Un taglio finale**: Taglia il mazzo una volta.

✅ Il mazzo è ora sufficientemente casuale (~225.58 bit di entropia).

---

## 💻 Fase 2: Prepara l'Ambiente Air-Gapped

### Opzione A: Usare il file standalone (consigliata)

1. Vai su [github.com/52Entropy/52entropy](https://github.com/52Entropy/52entropy)
2. Scarica l'ultima release (`52entropy-standalone.html`)
3. Copiala su una chiavetta USB
4. Inserisci la chiavetta in un computer **mai connesso a Internet**
5. Apri il file `.html` con il browser

### Opzione B: Build da sorgente (per sviluppatori)

```bash
git clone https://github.com/52Entropy/52entropy.git
cd 52entropy
npm install
npm run build
# Il file è in dist/index.html
```

### Opzione C: Usare la versione online (solo per test, NON per seed reali)

Puoi testare l'app su [52entropy.com](https://52entropy.com), ma **non usarla per seed con fondi reali** — il browser potrebbe avere estensioni malevole.

---

## 🃏 Fase 3: Inserisci l'Ordine delle Carte

Ci sono tre modi per inserire l'ordine:

### Metodo 1: Griglia Visiva (consigliato per principianti)

1. Guarda la prima carta del mazzo mescolato
2. Clicca sulla carta corrispondente nella griglia in alto
3. La carta appare nella "Sequenza Carte Inserite" a destra
4. Ripeti per tutte e 52 le carte

💡 **Suggerimento**: Usa i tab ♠ ♥ ♦ ♣ per filtrare per seme e trovare le carte più velocemente.

### Metodo 2: Input Testuale (consigliato per esperti)

1. Leggi il mazzo e scrivi i codici shorthand:
   ```
   AS = Asso di Picche (Ace of Spades)
   10H = 10 di Cuori (10 of Hearts)
   KD = Re di Quadri (King of Diamonds)
   2C = 2 di Fiori (2 of Clubs)
   ```
   Formati validi: `AS 10H KD 2C` o `A♠ 10♥ K♦ 2♣`

2. Incolla la sequenza nella casella di testo e clicca **"Analizza ed Applica Sequenza"**

### Metodo 3: Demo Casuale (solo per test)

Clicca **"Demo Mescolata Casuale"** per riempire automaticamente il mazzo con un ordine casuale generato dal browser. ⚠️ **Non usare per seed reali** — l'entropia del browser non è adeguata.

---

## 🔢 Fase 4: Verifica l'Entropia

Con 52 carte inserite:

1. Il pannello **"Calcolo dell'Entropia"** mostra:
   - Entropia del mazzo: ~225.58 bit
   - Requisito Bitcoin: 128/256 bit ✓
   - Rango di Lehmer (numero decimale esatto della permutazione)
   - Digest SHA-256 dell'entropia

2. Puoi passare tra i due motori:
   - **Factoradic (52!)**: Calcolo matematico esatto della permutazione
   - **SHA-256 String**: Hash della sequenza testuale

---

## 🔑 Fase 5: Genera il Seed

1. Scegli tra **12 parole** (128 bit) o **24 parole** (256 bit)
2. La frase mnemonica BIP-39 viene generata automaticamente
3. **Proteggi lo schermo!** Clicca l'icona dell'occhio 👁 per mascherare il seed

### Passphrase opzionale (25ª parola)

- Inserisci una passphrase nel campo dedicato
- Il **Master Seed a 512 bit** viene ricalcolato con PBKDF2
- Usa una passphrase che puoi **ricordare** — se la dimentichi, perdi i fondi!

---

## ✅ Fase 6: Verifica Incrociata

**Non fidarti mai di un solo strumento.** Verifica sempre:

### Con Wallet Hardware

1. Prendi il tuo Coldcard, Trezor, Ledger o BitBox
2. Seleziona "Restore Wallet" → "BIP-39 Mnemonic"
3. Inserisci le 12/24 parole (+ passphrase se usata)
4. Controlla che il wallet mostri:
   - La stessa fingerprint
   - Lo stesso xpub/zpub

### Con Electrum (desktop, air-gapped)

1. Crea un nuovo wallet → "Standard wallet" → "I already have a seed"
2. Inserisci la frase mnemonica
3. Verifica che gli indirizzi `bc1q...` corrispondano

### Con Ian Coleman Tool (offline)

1. Scarica https://iancoleman.io/bip39/ (il sito può essere salvato offline)
2. Inserisci la frase + passphrase
3. Confronta il Master Seed hex (deve essere identico)

---

## 🛡️ Fase 7: Conservazione

1. **Scrivi** la frase mnemonica su carta (o metallo per resistenza a fuoco/acqua)
2. **Conserva** la passphrase separatamente dal seed (se ne usi una)
3. **Testa** il restore prima di depositare fondi
4. **Elimina** ogni traccia digitale del seed

---

## ⚠️ Best Practice di Sicurezza

| Fare | Non Fare |
|------|----------|
| ✅ Usare un computer air-gapped | ❌ Generare seed sul telefono di tutti i giorni |
| ✅ Verificare con hardware wallet | ❌ Fidarsi solo dell'app |
| ✅ Tenere il seed su carta/metallo | ❌ Salvare il seed in un file di testo |
| ✅ Testare il restore con pochi satoshi | ❌ Depositare tutto senza aver verificato |
| ✅ Usare una passphrase forte | ❌ Usare passphrase ovvie ("1234", "password") |
| ✅ Mescolare bene (7+ riffle) | ❌ Fare solo 2-3 mescolate veloci |

---

## 🐛 Risoluzione Problemi

| Problema | Soluzione |
|----------|-----------|
| "La frase non corrisponde al mio wallet" | Verifica di aver inserito le carte nell'ordine esatto. Anche una carta fuori posto produce un seed diverso. |
| "Il seed è diverso da Ian Coleman" | Controlla: stessa passphrase? Stesso numero di parole (12 vs 24)? Stesso derivation path? |
| "Non vedo i font correttamente" | L'app usa font di sistema. Se sei su un OS molto vecchio, prova ad aggiornare il browser. |
| "Il file standalone non funziona" | Assicurati di usare un browser moderno (Chromium 90+, Firefox 90+, Safari 15+) |

---

## 📚 Risorse

- [BIP-39 Specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIP-32 HD Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [BIP-84 Native SegWit](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki)
- [Ian Coleman BIP-39 Tool](https://iancoleman.io/bip39/)
- [Giacomo Zucco su X/Twitter](https://x.com/giacomozucco)
