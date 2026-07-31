import type { Card } from '../utils/cards';
import { Shuffle, RotateCcw, Undo2, CheckCircle2, AlertTriangle, ListOrdered, ShieldAlert } from 'lucide-react';

interface DeckProgressProps {
  selectedCards: Card[];
  onRemoveCard: (index: number) => void;
  onUndo: () => void;
  onReset: () => void;
  onDemoShuffle: () => void;
  isDemoDeck: boolean;
  lang: 'it' | 'en';
}

export const DeckProgress: React.FC<DeckProgressProps> = ({
  selectedCards,
  onRemoveCard,
  onUndo,
  onReset,
  onDemoShuffle,
  isDemoDeck,
  lang,
}) => {
  const count = selectedCards.length;
  const isComplete = count === 52;
  const progressPct = Math.round((count / 52) * 100);
  const isIt = lang === 'it';

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
            <ListOrdered size={20} color="var(--btc-orange)" />
            {isIt ? 'Sequenza Carte Inserite' : 'Entered Card Sequence'}
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isComplete ? 'var(--accent-emerald)' : 'var(--btc-orange)',
                background: 'rgba(255,255,255,0.05)',
                padding: '2px 8px',
                borderRadius: '8px',
              }}
            >
              {count} / 52
            </span>
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onUndo}
            disabled={count === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.03)',
              color: count === 0 ? 'var(--text-dim)' : 'var(--text-main)',
              fontSize: '0.85rem',
            }}
          >
            <Undo2 size={16} />
            {isIt ? 'Annulla Ultima' : 'Undo Last'}
          </button>

          <button
            onClick={onReset}
            disabled={count === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.03)',
              color: count === 0 ? 'var(--text-dim)' : 'var(--accent-red)',
              fontSize: '0.85rem',
            }}
          >
            <RotateCcw size={16} />
            {isIt ? 'Resetta' : 'Reset'}
          </button>

          <button
            onClick={onDemoShuffle}
            className="pulse-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--btc-orange), #d97706)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            <Shuffle size={16} />
            {isIt ? 'Demo Mescolata Casuale' : 'Demo Random Shuffle'}
          </button>
        </div>
      </div>

      {/* ─── SECURITY WARNING: Demo Deck ─────────────────────── */}
      {isDemoDeck && count > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
          color: 'var(--accent-red)',
          fontSize: '0.85rem',
          marginBottom: '0.75rem',
          background: 'rgba(239, 68, 68, 0.12)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(239, 68, 68, 0.35)',
        }}>
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong>{isIt ? '⚠️ ATTENZIONE: Entropia NON sicura!' : '⚠️ WARNING: Insecure Entropy!'}</strong>
            <br />
            {isIt
              ? "Questa sequenza usa Math.random() del browser, NON è crittograficamente sicura. Per un seed Bitcoin reale, mescola un mazzo fisico e inserisci le carte manualmente. Usa la Demo solo per test."
              : "This sequence uses the browser's Math.random(), which is NOT cryptographically secure. For a real Bitcoin seed, shuffle a physical deck and enter the cards manually. Use Demo for testing only."}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            background: isComplete
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : 'linear-gradient(90deg, var(--btc-orange), #f59e0b)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Status banner */}
      {isComplete ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.9rem', marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <CheckCircle2 size={18} />
          <span>
            {isIt
              ? 'Mazzo completo di 52 carte verificato! Entropia massima (~225.58 bit) calcolata.'
              : 'Complete 52-card deck verified! Maximum entropy (~225.58 bits) calculated.'}
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <AlertTriangle size={16} color="var(--btc-orange)" />
          <span>
            {isIt
              ? `Seleziona le carte rimanenti (${52 - count} mancanti) per completare l'entropia del mazzo.`
              : `Select remaining cards (${52 - count} left) to complete deck entropy.`}
          </span>
        </div>
      )}

      {/* Selected Cards Strip */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          maxHeight: '220px',
          overflowY: 'auto',
          padding: '8px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          minHeight: '80px',
          alignItems: count === 0 ? 'center' : 'flex-start',
          justifyContent: count === 0 ? 'center' : 'flex-start',
        }}
      >
        {count === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            {isIt
              ? 'Nessuna carta selezionata. Clicca sulle carte in alto o usa la Demo Mescolata per iniziare.'
              : 'No cards selected yet. Click cards above or use Demo Shuffle to begin.'}
          </p>
        ) : (
          selectedCards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`card-item selected-sequence ${card.isRed ? 'red' : 'black'}`}
              onClick={() => onRemoveCard(idx)}
              title={isIt ? `Clicca per rimuovere ${card.id}` : `Click to remove ${card.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                <span>{card.rank}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>#{idx + 1}</span>
              </div>
              <div style={{ fontSize: '1rem', textAlign: 'center' }}>{card.symbol}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
