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
    <div className="panel" style={{ padding: '0.9rem 1.25rem' }}>
      {/* ── Header row: title, count, progress, actions ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: count > 0 ? '0.6rem' : '0',
      }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <ListOrdered size={18} color="var(--accent)" />
          {isIt ? 'Sequenza' : 'Sequence'}
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: isComplete ? 'var(--ok)' : 'var(--accent)',
            background: 'var(--bg-base)',
            padding: '1px 8px',
            borderRadius: 'var(--radius-sm)',
          }}>
            {count}/52
          </span>
        </h3>

        <div className="progress-track" style={{ flex: 1, minWidth: '80px', height: '5px' }}>
          <div
            className={`progress-fill ${isComplete ? 'complete' : 'incomplete'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
          <button onClick={onUndo} disabled={count === 0} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <Undo2 size={14} />
            {isIt ? 'Annulla' : 'Undo'}
          </button>
          <button onClick={onReset} disabled={count === 0} className="btn-danger" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <RotateCcw size={14} />
            {isIt ? 'Resetta' : 'Reset'}
          </button>
          <button onClick={onDemoShuffle} className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
            <Shuffle size={14} />
            {isIt ? 'Demo' : 'Demo'}
          </button>
        </div>
      </div>

      {/* ── Warning banner (demo only) ── */}
      {isDemoDeck && count > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          color: 'var(--err)',
          fontSize: '0.78rem',
          marginBottom: '0.6rem',
          background: 'var(--err-muted)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>
            <strong>{isIt ? '⚠️ Demo — Entropia NON sicura.' : '⚠️ Demo — Insecure entropy.'}</strong>
            {' '}{isIt
              ? 'Usa Math.random(). Per un seed reale mescola un mazzo fisico.'
              : 'Uses Math.random(). For a real seed, shuffle a physical deck.'}
          </span>
        </div>
      )}

      {/* ── Status line ── */}
      {count > 0 && (
        <div style={{ fontSize: '0.78rem', marginBottom: count > 0 ? '0.5rem' : '0' }}>
          {isComplete ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ok)' }}>
              <CheckCircle2 size={14} />
              {isIt ? 'Mazzo completo! ~225.58 bit di entropia calcolati.' : 'Complete deck! ~225.58 bits of entropy calculated.'}
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
              <AlertTriangle size={14} color="var(--accent)" />
              {isIt
                ? `${52 - count} carte mancanti per completare l'entropia.`
                : `${52 - count} cards remaining to complete entropy.`}
            </span>
          )}
        </div>
      )}

      {/* ── Card strip — horizontal scroll, single row ── */}
      <div style={{
        display: 'flex',
        gap: '5px',
        overflowX: 'auto',
        padding: count === 0 ? '0.5rem' : '6px',
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        minHeight: count === 0 ? '36px' : 'auto',
        alignItems: 'center',
      }}>
        {count === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', margin: 0, whiteSpace: 'nowrap' }}>
            {isIt
              ? 'Clicca sulle carte qui sopra — appariranno in sequenza.'
              : 'Click cards above — they\'ll appear here in sequence.'}
          </p>
        ) : (
          selectedCards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`card-item selected-sequence ${card.isRed ? 'red' : 'black'}`}
              onClick={() => onRemoveCard(idx)}
              title={isIt ? `Clicca per rimuovere ${card.id}` : `Click to remove ${card.id}`}
              style={{ flexShrink: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700 }}>
                <span>{card.rank}</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.6rem' }}>#{idx + 1}</span>
              </div>
              <div style={{ fontSize: '0.9rem', textAlign: 'center' }}>{card.symbol}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
