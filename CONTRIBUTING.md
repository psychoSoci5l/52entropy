# 🤝 Contributing to 52Entropy

Grazie per voler contribuire! 52Entropy è un progetto open-source dedicato alla sicurezza Bitcoin.

## Filosofia del Progetto

- **Zero fiducia**: Ogni contributo deve mantenere l'approccio trustless.
- **Zero dipendenze di rete**: Nessuna nuova dipendenza che richieda connessione Internet.
- **Semplicità**: Meno codice = meno bug = più sicurezza.
- **Verificabilità**: Il codice deve essere ispezionabile e comprensibile.

## Come Contribuire

### Pull Request

1. **Forka** il repository
2. **Crea un branch**: `feature/nome-feature` o `fix/descrizione-bug`
3. **Scrivi test**: ogni modifica alla logica di entropia/BIP-39 DEVE includere test
4. **Verifica**: `npm run build && npx vitest run` (14/14 test devono passare)
5. **Apri una PR** con descrizione chiara

### Cosa cerchiamo

- 🧪 **Test vector verification**: Nuovi vettori di test BIP-39 verificati
- 🔐 **Security audit**: Code review e suggerimenti di sicurezza
- 🌍 **Traduzioni**: Localizzazione dell'interfaccia
- 📝 **Documentazione**: Miglioramenti a FAQ, tutorial, guide
- 🐛 **Bug fix**: Edge case nel parsing delle carte, comportamento inatteso

### Cosa NON cerchiamo

- ❌ Nuove dipendenze che richiedono network
- ❌ Feature che complicano l'audit (es. wallet completo, transazioni)
- ❌ Ottimizzazioni premature che riducono la leggibilità
- ❌ Aggiunta di tracking o analytics

## Setup di Sviluppo

```bash
git clone https://github.com/52Entropy/52entropy.git
cd 52entropy
npm install
npm run dev      # Dev server su localhost:5173
npx vitest       # Test in watch mode
npx vitest run   # Test one-shot
npm run build    # Build di produzione (dist/index.html)
```

### Struttura del Progetto

```
src/
├── utils/
│   ├── cards.ts           # Definizione carte, parsing, mazzo completo
│   ├── entropy.ts         # Rango di Lehmer, SHA-256, pipeline entropia
│   ├── bip39.ts           # Generazione mnemonico BIP-39
│   ├── bip39Seed.ts       # Derivazione PBKDF2 master seed
│   ├── bip39Wordlist.ts   # Wordlist BIP-39 inglese (2048 parole)
│   ├── testVectors.ts     # Vettori di test BIP-39 ufficiali
│   ├── exporter.ts        # Download HTML standalone
│   └── entropy.test.ts    # Suite di test (14 test)
├── components/
│   ├── CardSelector.tsx   # Griglia selezione carte
│   ├── DeckProgress.tsx   # Progresso e sequenza inserita
│   ├── QuickTextInput.tsx # Input testuale rapido
│   ├── EntropyDisplay.tsx # Dettaglio calcolo entropia
│   ├── MnemonicResult.tsx # Frase mnemonica e seed
│   ├── SecurityAudit.tsx  # Pannello sicurezza e download offline
│   └── Header.tsx         # Header con logo e cambio lingua
├── index.css              # Stili globali (system font stack)
├── App.tsx                # Componente principale
└── main.tsx               # Entry point
```

## Codice di Condotta

Sii rispettoso. Questo è un progetto per la community Bitcoin — niente spam, niente shilling di altcoin, niente tossicità.

## Domande?

Apri una [Issue](https://github.com/52Entropy/52entropy/issues) o contatta [@giacomozucco](https://x.com/giacomozucco) su X.
