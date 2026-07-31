import { useState, useEffect } from 'react';
import type { Card } from './utils/cards';
import { calculateDeckEntropy } from './utils/entropy';
import type { EntropyCalculationResult, EntropyEngineType } from './utils/entropy';
import { entropyToMnemonic } from './utils/bip39';
import type { MnemonicResult as MnemonicResultType } from './utils/bip39';

import { Header } from './components/Header';
import { CardSelector } from './components/CardSelector';
import { DeckProgress } from './components/DeckProgress';
import { QuickTextInput } from './components/QuickTextInput';
import { EntropyDisplay } from './components/EntropyDisplay';
import { MnemonicResult } from './components/MnemonicResult';
import { SecurityAudit } from './components/SecurityAudit';

export function App() {
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [engine, setEngine] = useState<EntropyEngineType>('factoradic');
  const [wordCountTarget, setWordCountTarget] = useState<12 | 24>(12);

  const [entropyResult, setEntropyResult] = useState<EntropyCalculationResult | null>(null);
  const [mnemonicResult, setMnemonicResult] = useState<MnemonicResultType | null>(null);

  // Recalculate entropy and BIP-39 mnemonic whenever cards, engine, or wordCountTarget change
  useEffect(() => {
    let isCancelled = false;

    async function updateCalculations() {
      const entropy = await calculateDeckEntropy(selectedCards, engine);
      if (isCancelled) return;
      setEntropyResult(entropy);

      if (entropy.isComplete) {
        const mnemonic = await entropyToMnemonic(entropy.entropyBytes, wordCountTarget);
        if (isCancelled) return;
        setMnemonicResult(mnemonic);
      } else {
        setMnemonicResult(null);
      }
    }

    updateCalculations();

    return () => {
      isCancelled = true;
    };
  }, [selectedCards, engine, wordCountTarget]);

  // Card selection handlers
  const handleSelectCard = (card: Card) => {
    if (selectedCards.some((c) => c.id === card.id)) return;
    setSelectedCards((prev) => [...prev, card]);
  };

  const handleRemoveCard = (index: number) => {
    setSelectedCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUndo = () => {
    setSelectedCards((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setSelectedCards([]);
  };

  const handleApplyCards = (cards: Card[]) => {
    setSelectedCards(cards);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem' }}>
      <Header lang={lang} onLangChange={setLang} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Main Grid: Card Selector + Deck Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          <CardSelector selectedCards={selectedCards} onSelectCard={handleSelectCard} lang={lang} />
          <DeckProgress
            selectedCards={selectedCards}
            onRemoveCard={handleRemoveCard}
            onUndo={handleUndo}
            onReset={handleReset}
            onSetDeck={handleApplyCards}
            lang={lang}
          />
        </div>

        {/* Quick Text Input */}
        <QuickTextInput onApplyCards={handleApplyCards} lang={lang} />

        {/* Entropy Calculation Display */}
        <EntropyDisplay
          entropyResult={entropyResult}
          selectedEngine={engine}
          onEngineChange={setEngine}
          lang={lang}
        />

        {/* BIP-39 Seed Mnemonic Result */}
        <MnemonicResult
          mnemonic={mnemonicResult}
          wordCountTarget={wordCountTarget}
          onWordCountChange={setWordCountTarget}
          lang={lang}
        />

        {/* Air-Gapped Security & Audit Panel */}
        <SecurityAudit lang={lang} />
      </div>
    </div>
  );
}

export default App;
