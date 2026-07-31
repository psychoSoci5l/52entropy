# Audit Completo del Progetto "Deck Entropy" & Roadmap per Giacomo Zucco

## 📊 Valutazione & Scoring Complessivo (Scala 1-10)

| Categoria | Punteggio (1-10) | Diagnosi & Motivazione Sintetica |
| :--- | :---: | :--- |
| **Architettura & Crittografia** | **6/10** | Mappatura Lehmer funzionale ma manca verifica deterministica rispetto a standard Bitcoin (es. Electrum / Ian Coleman vectors). |
| **Completezza Funzionale** | **5/10** | L'app supporta la generazione di frasi BIP-39 basilari, ma mancano passphrase BIP-39, derivazione indirizzi ed export QR Code. |
| **Esperienza Utente & UX** | **6/10** | Interfaccia moderna ma manca il supporto OCR via fotocamera o scanner di carte, rendendo l'input manuale troppo rigido. |
| **Sicurezza & Air-Gap** | **6/10** | Nessuna chiamata di rete, ma l'esportatore HTML standalone attualmente scarica un template semplificato e non il bundle reale completo. |
| **Testing & Copertura** | **5/10** | Suite Vitest base implementata (8 test passati). Mancano test d'integrazione di permutazioni reali e vettori noti. |

---

## 🔍 Gap Analysis: Perché l'Approccio Iniziale era Superficiale

1. **Esportatore Offline Incompleto**: Il pulsante per il download del file HTML standalone scaricava un file HTML di esempio anziché impacchettare l'intero bundle JS/CSS.
2. **Assenza di Derivazione Indirizzi**: I Bitcoiner esigenti non si accontentano della sola frase mnemonica; vogliono verificare l'indirizzo master (zpub / SegWit native `bc1q...`).
3. **Mancanza di Passphrase BIP-39 (25th Word)**: Funzionalità di sicurezza critica inutilizzabile nella versione precedente.
4. **Validazione Matematica & Vettori di Test**: Assenza di un pannello di confronto che mostri passo-passo la riduzione da $52!$ a 256-bit ed i vettori di test verificabili.

---

## 🛠️ Piano di Azione per Colmare i Gap

### Fase 1: Potenziamento Crittografico & Derivazione Indirizzi
- Aggiungere supporto alla **Passphrase BIP-39** opzionale.
- Implementare derivazione deterministica per verificare checksum ed indice di ciascuna parola.
- Aggiungere pannello con la verifica dettagliata della riduzione dell'entropia $\log_2(52!) \to 256 \text{ bit}$.

### Fase 2: Standalone Exporter Reale & Offline Packaging
- Creare uno script di build che generi una vera **Single-Page Application in un singolo file HTML auto-contenuto** (inline JS + CSS).

### Fase 3: Estensione Suite di Test Vitest
- Aggiungere test per valutare casi limite (es. mazzi parziali, permutazioni inverse, stabilità di SHA-256).
