import type { EntropyCalculationResult, EntropyEngineType } from '../utils/entropy';
import { Calculator, Cpu, Hash } from 'lucide-react';

interface EntropyDisplayProps {
  entropyResult: EntropyCalculationResult | null;
  selectedEngine: EntropyEngineType;
  onEngineChange: (engine: EntropyEngineType) => void;
  lang: 'it' | 'en';
}

export const EntropyDisplay: React.FC<EntropyDisplayProps> = ({
  entropyResult,
  selectedEngine,
  onEngineChange,
  lang,
}) => {
  const isIt = lang === 'it';
  const isComplete = entropyResult?.isComplete ?? false;

  return (
    <div className="panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          <Calculator size={20} color="var(--accent)" />
          {isIt ? "Calcolo dell'Entropia del Mazzo" : 'Deck Entropy Calculation'}
        </h3>

        {/* Engine Switcher */}
        <div className="segmented-control">
          <button
            className={selectedEngine === 'factoradic' ? 'active' : ''}
            onClick={() => onEngineChange('factoradic')}
          >
            {isIt ? 'Factoradic 52!' : 'Factoradic 52!'}
          </button>
          <button
            className={selectedEngine === 'sha256_string' ? 'active' : ''}
            onClick={() => onEngineChange('sha256_string')}
          >
            {isIt ? 'SHA-256 String' : 'SHA-256 String'}
          </button>
        </div>
      </div>

      {/* Info Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isIt ? 'Entropia del Mazzo Completo' : 'Full Deck Entropy'}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            ~225.58 Bits
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            log₂(52!) = log₂(8.0658 × 10⁶⁷)
          </div>
        </div>

        <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isIt ? 'Requisito Bitcoin (12 / 24 Parole)' : 'Bitcoin Requirement (12 / 24 Words)'}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ok)', fontFamily: 'var(--font-mono)' }}>
            128 / 256 Bits
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--ok)', marginTop: '4px' }}>
            {isIt ? '✓ 225.58 bit sono più che sufficienti!' : '✓ 225.58 bits is more than enough!'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isIt ? 'Stato Algoritmo' : 'Algorithm State'}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isComplete ? 'var(--ok)' : 'var(--accent)' }}>
            {isComplete ? (isIt ? 'Permutazione Completa' : 'Full Permutation') : (isIt ? 'In Attesa carte' : 'Awaiting cards')}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            {selectedEngine === 'factoradic'
              ? (isIt ? 'Codice di Lehmer 100% deterministico' : '100% deterministic Lehmer code')
              : (isIt ? 'Hash SHA-256 stringa canonica' : 'SHA-256 canonical string hash')}
          </div>
        </div>
      </div>

      {/* Deep Math Details */}
      {entropyResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {selectedEngine === 'factoradic' && isComplete && entropyResult.lehmerRankBigInt && (
            <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '6px', fontWeight: 600 }}>
                <Cpu size={14} />
                <span>{isIt ? 'Rango di Lehmer / Factoradic (Decimal BigInt):' : 'Factoradic / Lehmer Rank (Decimal BigInt):'}</span>
              </div>
              <div className="mono-data" style={{ color: 'var(--text-primary)', wordBreak: 'break-all', opacity: 0.85 }}>
                {entropyResult.lehmerRankBigInt}
              </div>
            </div>
          )}

          <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              <Hash size={14} />
              <span>{isIt ? 'Digest Entropia Generato (SHA-256 256-bit Hex):' : 'Generated Entropy Digest (SHA-256 256-bit Hex):'}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all', fontWeight: 600, opacity: 0.9 }}>
              {entropyResult.entropyHex}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
