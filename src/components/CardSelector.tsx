import { useState } from 'react';
import type { Card, Suit } from '../utils/cards';
import { SUITS, FULL_DECK } from '../utils/cards';
import { Layers } from 'lucide-react';

interface CardSelectorProps {
  selectedCards: Card[];
  onSelectCard: (card: Card) => void;
  lang: 'it' | 'en';
}

export const CardSelector: React.FC<CardSelectorProps> = ({ selectedCards, onSelectCard, lang }) => {
  const [activeSuit, setActiveSuit] = useState<Suit | 'ALL'>('ALL');
  const selectedIds = new Set(selectedCards.map((c) => c.id));

  const filteredCards = activeSuit === 'ALL'
    ? FULL_DECK
    : FULL_DECK.filter((c) => c.suit === activeSuit);

  const isIt = lang === 'it';

  return (
    <div className="panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          <Layers size={20} color="var(--accent)" />
          {isIt ? 'Seleziona Carte dal Mazzo (in Ordine)' : 'Select Cards from Shuffled Deck (In Order)'}
        </h3>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            className={`suit-tab ${activeSuit === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveSuit('ALL')}
          >
            {isIt ? 'Tutte (52)' : 'All (52)'}
          </button>

          {SUITS.map((suit) => {
            const countInSuit = selectedCards.filter((c) => c.suit === suit.code).length;
            const isRed = suit.isRed;
            return (
              <button
                key={suit.code}
                className={`suit-tab ${activeSuit === suit.code ? 'active' : ''}`}
                onClick={() => setActiveSuit(suit.code)}
                style={{
                  color: activeSuit === suit.code ? undefined : isRed ? '#c0392b' : '#1a1a2e',
                }}
              >
                <span>{suit.symbol}</span>
                <span>{isIt ? suit.name : suit.nameEn}</span>
                <span style={{ opacity: 0.5, fontSize: '0.72rem' }}>({countInSuit}/13)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 52 Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
          gap: '8px',
          maxHeight: '380px',
          overflowY: 'auto',
          padding: '4px',
        }}
      >
        {filteredCards.map((card) => {
          const isSelected = selectedIds.has(card.id);
          const selectedOrderIndex = selectedCards.findIndex((c) => c.id === card.id);

          return (
            <div
              key={card.id}
              className={`card-item ${card.isRed ? 'red' : 'black'} ${isSelected ? 'selected' : ''}`}
              onClick={() => !isSelected && onSelectCard(card)}
              title={isSelected ? `${card.id} (Posizione ${selectedOrderIndex + 1})` : `Seleziona ${card.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-rank">{card.rank}</span>
                {isSelected && (
                  <span style={{ fontSize: '0.6rem', background: 'var(--accent)', color: '#000', padding: '1px 4px', borderRadius: '3px', fontWeight: 700 }}>
                    #{selectedOrderIndex + 1}
                  </span>
                )}
              </div>
              <div className="card-symbol">{card.symbol}</div>
              <div className="card-small-suit">{card.symbol}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
