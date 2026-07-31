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
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          <Calculator size={20} color="var(--btc-orange)" />
          {isIt ? "Calcolo dell'Entropia del Mazzo" : 'Deck Entropy Calculation'}
        </h3>

        {/* Engine Switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => onEngineChange('factoradic')}
            style={{
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: selectedEngine === 'factoradic' ? 'var(--btc-orange)' : 'transparent',
              color: selectedEngine === 'factoradic' ? '#000' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            {isIt ? 'Matematico Esatto (Factoradic 52!)' : 'Exact Math (Factoradic 52!)'}
          </button>

          <button
            onClick={() => onEngineChange('sha256_string')}
            style={{
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: selectedEngine === 'sha256_string' ? 'var(--btc-orange)' : 'transparent',
              color: selectedEngine === 'sha256_string' ? '#000' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            {isIt ? 'Pragmatico (SHA-256 String)' : 'Pragmatic (SHA-256 String)'}
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
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {isIt ? 'Entropia del Mazzo Completo' : 'Full Deck Entropy'}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--btc-orange)', fontFamily: 'var(--font-mono)' }}>
            ~225.58 Bits
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            log₂(52!) = log₂(8.0658 × 10⁶⁷)
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {isIt ? 'Requisito Bitcoin (12 / 24 Parole)' : 'Bitcoin Requirement (12 / 24 Words)'}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            128 / 256 Bits
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
            {isIt ? '✓ 225.58 bit sono più che sufficienti!' : '✓ 225.58 bits is more than enough!'}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {isIt ? 'Stato Algoritmo' : 'Algorithm State'}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isComplete ? 'var(--accent-emerald)' : 'var(--btc-orange)' }}>
            {isComplete ? (isIt ? 'Permutazione Completa' : 'Full Permutation') : (isIt ? 'In Attesa carte' : 'Awaiting cards')}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
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
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--btc-orange)', marginBottom: '4px', fontWeight: 600 }}>
                <Cpu size={14} />
                <span>{isIt ? 'Rango di Lehmer / Factoradic (Decimal BigInt):' : 'Factoradic / Lehmer Rank (Decimal BigInt):'}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-main)', wordBreak: 'break-all', opacity: 0.9 }}>
                {entropyResult.lehmerRankBigInt}
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '4px', fontWeight: 600 }}>
              <Hash size={14} />
              <span>{isIt ? 'Digest Entropia Generato (SHA-256 256-bit Hex):' : 'Generated Entropy Digest (SHA-256 256-bit Hex):'}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', wordBreak: 'break-all', fontWeight: 600 }}>
              {entropyResult.entropyHex}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
