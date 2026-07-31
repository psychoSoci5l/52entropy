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
    <div className="panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
            <ListOrdered size={20} color="var(--accent)" />
            {isIt ? 'Sequenza Carte Inserite' : 'Entered Card Sequence'}
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: isComplete ? 'var(--ok)' : 'var(--accent)',
                background: 'var(--bg-base)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {count} / 52
            </span>
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={onUndo} disabled={count === 0} className="btn-secondary">
            <Undo2 size={15} />
            {isIt ? 'Annulla Ultima' : 'Undo Last'}
          </button>

          <button onClick={onReset} disabled={count === 0} className="btn-danger">
            <RotateCcw size={15} />
            {isIt ? 'Resetta' : 'Reset'}
          </button>

          <button onClick={onDemoShuffle} className="btn-primary">
            <Shuffle size={15} />
            {isIt ? 'Demo Mescolata' : 'Demo Shuffle'}
          </button>
        </div>
      </div>

      {/* ─── SECURITY WARNING: Demo Deck ─────────────────────── */}
      {isDemoDeck && count > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
          color: 'var(--err)',
          fontSize: '0.84rem',
          marginBottom: '0.75rem',
          background: 'var(--err-muted)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
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
      <div className="progress-track" style={{ marginBottom: '1rem' }}>
        <div
          className={`progress-fill ${isComplete ? 'complete' : 'incomplete'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Status banner */}
      {isComplete ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ok)', fontSize: '0.88rem', marginBottom: '1rem', background: 'var(--ok-muted)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.18)' }}>
          <CheckCircle2 size={18} />
          <span>
            {isIt
              ? 'Mazzo completo di 52 carte verificato! Entropia massima (~225.58 bit) calcolata.'
              : 'Complete 52-card deck verified! Maximum entropy (~225.58 bits) calculated.'}
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '1rem' }}>
          <AlertTriangle size={16} color="var(--accent)" />
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
          padding: '10px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          minHeight: '80px',
          alignItems: count === 0 ? 'center' : 'flex-start',
          justifyContent: count === 0 ? 'center' : 'flex-start',
        }}
      >
        {count === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', fontStyle: 'italic' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700 }}>
                <span>{card.rank}</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.62rem' }}>#{idx + 1}</span>
              </div>
              <div style={{ fontSize: '0.95rem', textAlign: 'center' }}>{card.symbol}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
