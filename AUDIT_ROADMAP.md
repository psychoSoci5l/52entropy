# Audit Completo del Progetto "52Entropy" & Roadmap

> **Aggiornamento Settembre 2026** — audit indipendente di sicurezza, dogfooding funzionale e UX eseguiti sul bundle di produzione. Stato attuale: **sicurezza 8/10, flusso funzionale 9/10, estetica 8/10**. Questo documento elenca cosa è stato corretto, cosa resta, e le linee guida d'uso per l'utente finale.

## 📊 Valutazione Aggiornata (post-fix, scala 1-10)

| Categoria | Prima | Ora | Note |
| :--- | :---: | :---: | :--- |
| **Architettura & Crittografia** | 6/10 | **9/10** | Lehmer/BigInt + SHA-256 verificati su vettori Trezor; wordlist identica all'ufficiale (2048/2048). Resta la derivazione indirizzi (zpub/bc1q) non implementata. |
| **Completezza Funzionale** | 5/10 | **8/10** | Passphrase BIP-39 ✅, 12/24 parole ✅, export standalone ✅ (ora sanitizzato). Mancano QR code e derivazione indirizzi. |
| **Esperienza Utente & UX** | 6/10 | **8/10** | Onboarding in-app con guida alla mescolata ✅, nota anteprima parziale ✅. Mobile senza scroll orizzontale. Manca OCR fotocamera. |
| **Sicurezza & Air-Gap** | 6/10 | **9/10** | Zero network ✅, CSP ✅, Demo con CSPRNG ✅, export sanitizzato ✅, niente seed in storage/URL ✅. |
| **Testing & Copertura** | 5/10 | **8/10** | 17 test (vettori BIP-39 ufficiali, permutazioni, sanitizzazione export). Mancano test E2E browser. |

## 🔍 Audit 2026: Findings e Remediation

| Finding | Severità | Stato |
| :--- | :--- | :--- |
| Bottone Demo usava `Math.random()` (PRNG predicibile) | 🟠 High | ✅ **Risolto**: Fisher-Yates con `crypto.getRandomValues()` + rejection sampling |
| Export HTML includeva seed rivelato/passphrase in chiaro nel file | 🟡 Medium | ✅ **Risolto**: `sanitizeExportedHtml()` maschera parole, input e hex lunghi prima del download |
| Copia seed in clipboard senza avviso | 🟡 Medium | ⬜ Da documentare in FAQ (comportamento standard, rischio noto) |
| Nessuna Content Security Policy | 🟢 Low | ✅ **Risolto**: CSP restrictiva in `index.html` (`default-src 'none'; connect-src 'none'`) |
| Campo passphrase senza `autoComplete="off"` | 🟢 Low | ✅ **Risolto** |
| npm audit: nanoid <3.3.18 (solo tooling build, non nel bundle) | 🟢 Low | ⬜ `npm audit fix` quando opportuno |
| Preview entropia parziale presentata come reale | 🟢 Low | ✅ **Risolto**: banner "solo anteprima non crittografica" nel pannello entropia |
| Nessuna guida in-app alla mescolata | UX | ✅ **Risolto**: pannello "Come funziona" collassabile |

## 🃏 Guida alla Mescolata — Consigli per l'Utente

La sicurezza del seed dipende **dalla qualità della mescolata fisica**, non dall'app. L'app misura e converte: l'entropia la crei tu.

### Come mescolare bene

1. **Riffle shuffle (mescolata a ponte)**: dividi il mazzo in due pila, intervalla le carte lasciandole cadere incrociate, ricompatta. È la mescolata con la massima entropia per singola passata.
2. **Ripeti almeno 5-7 riffle completi**. Meno di 5: il mazzo conserva correlazioni misurabili rispetto all'ordine iniziale.
3. **Mescola a faccia in giù**, senza guardare le carte: vedere anche una sola carta riduce l'incertezza effettiva.
4. **Evita di fidarti solo della mescolata a mazzo (overhand)**: lascia blocchi di carte consecutivi e non randomizza abbastanza. Usala come variazione, non come unico metodo.
5. **Non usare mai la stessa sequenza due volte**: se registri lo stesso ordine (o quasi), l'entropia effettiva crolla. Il mazzo nuovo va mescolato da capo, partendo da un ordine diverso.

### Come trascrivere

- Gira le carte **una alla volta**, in ordine, e registrale subito nell'app (griglia o input testuale `AS 10H KD...`).
- Trascrivi **senza riordinare**: l'ordine di pescata è ciò che conta. Se sbagli una carta, usa Annulla/Reset e ricontrolla sul mazzo fisico.
- Conta che servono **tutte e 52**: a mazzo parziale l'app mostra solo un'anteprima non crittografica (contrassegnata come tale).

### Dove generare il seed

- **Solo prove**: questa pagina online.
- **Seed reali**: `Scarica HTML Standalone` → chiavetta USB → computer **air-gapped** (mai connesso a rete). L'export non contiene il seed: il file riparte mascherato.
- Dopo la generazione, **verifica** l'impronta del mnemonico sul tuo hardware wallet (Coldcard/Trezor/Ledger) o con Ian Coleman tool offline, prima di depositare fondi.

## 🛠️ Roadmap Futura

### Fase 1 — Derivazione Indirizzi & QR (prossimo passo)
- Derivazione deterministic: master xpub/zpub e primo indirizzo `bc1q` (m/84'/0'/0'/0/0) per verifica su hardware wallet.
- Export QR code del mnemonico (con avviso di sicurezza: QR = seed in chiaro visualizzabile).

### Fase 2 — UX & Accessibilità
- OCR fotocamera per trascrivere il mazzo (progressive enhancement, opzionale).
- `aria-label` su tutte le card e navigazione completa da tastiera.
- Onboarding esteso: tooltip contestuali al primo utilizzo.

### Fase 3 — Robustezza
- Test E2E browser (Playwright) sul flusso completo: input → entropy → mnemonic → export.
- Check CI che blocchi regressioni: zero `fetch`/XHR nel bundle, zero dati sensibili nell'export (già testato in unit).
- Auto-purge clipboard dopo 60s (dove l'API `ClipboardItem`/`write` lo consente) con avviso.

### Fase 4 — Distribuzione
- Release GitHub con artefatto `52entropy-offline.html` firmato (checksum SHA-256 pubblicato).
- Guida air-gapped step-by-step con screenshot (TUTORIAL.md già esistente — estenderla con la sezione mescolata sopra).