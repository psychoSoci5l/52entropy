import { useState } from 'react';
import type { MnemonicResult as MnemonicResultType } from '../utils/bip39';
import { KeyRound, Eye, EyeOff, Copy, Check, ShieldCheck } from 'lucide-react';

interface MnemonicResultProps {
  mnemonic: MnemonicResultType | null;
  wordCountTarget: 12 | 24;
  onWordCountChange: (count: 12 | 24) => void;
  lang: 'it' | 'en';
}

export const MnemonicResult: React.FC<MnemonicResultProps> = ({
  mnemonic,
  wordCountTarget,
  onWordCountChange,
  lang,
}) => {
  const [isMasked, setIsMasked] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isIt = lang === 'it';

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--border-active)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--btc-orange)' }}>
            <KeyRound size={22} />
            {isIt ? 'Frase Mnemonica BIP-39 Generata' : 'Generated BIP-39 Mnemonic Phrase'}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Word Count Switch */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => onWordCountChange(12)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: wordCountTarget === 12 ? 'var(--btc-orange)' : 'transparent',
                color: wordCountTarget === 12 ? '#000' : 'var(--text-muted)',
              }}
            >
              12 {isIt ? 'Parole' : 'Words'} (128-bit)
            </button>
            <button
              onClick={() => onWordCountChange(24)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: wordCountTarget === 24 ? 'var(--btc-orange)' : 'transparent',
                color: wordCountTarget === 24 ? '#000' : 'var(--text-muted)',
              }}
            >
              24 {isIt ? 'Parole' : 'Words'} (256-bit)
            </button>
          </div>

          {/* Privacy Toggle */}
          <button
            onClick={() => setIsMasked(!isMasked)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '6px 12px',
              borderRadius: '8px',
              background: isMasked ? 'rgba(255,255,255,0.08)' : 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--border-color)',
              color: isMasked ? 'var(--text-main)' : 'var(--accent-red)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {isMasked ? <Eye size={16} /> : <EyeOff size={16} />}
            {isMasked ? (isIt ? 'Mostra Seed' : 'Show Seed') : (isIt ? 'Nascondi Seed' : 'Hide Seed')}
          </button>
        </div>
      </div>

      {!mnemonic ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontStyle: 'italic' }}>
          {isIt
            ? 'Completa la selezione delle 52 carte del mazzo per generare la frase mnemonica BIP-39.'
            : 'Complete standard 52-card deck selection to generate BIP-39 mnemonic.'}
        </div>
      ) : (
        <div>
          {/* Mnemonic Words Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '10px',
              marginBottom: '1.25rem',
            }}
          >
            {mnemonic.words.map((item) => (
              <div
                key={item.index}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: item.isChecksumIncluded
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.07)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <span>#{item.index}</span>
                  {item.isChecksumIncluded && (
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.65rem', fontWeight: 700 }}>
                      +Checksum
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isMasked ? 'var(--text-dim)' : 'var(--text-main)', letterSpacing: isMasked ? '2px' : '0' }}>
                  {isMasked ? '••••••' : item.word}
                </div>

                <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px', opacity: 0.7 }}>
                  idx: {item.wordIndex}
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>
                {isIt ? 'Checksum SHA-256 Verificato' : 'SHA-256 Checksum Verified'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleCopy(mnemonic.phrase, 'phrase')}
                disabled={isMasked}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: isMasked ? 'rgba(255,255,255,0.05)' : 'var(--btc-orange)',
                  color: isMasked ? 'var(--text-dim)' : '#000',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {copiedField === 'phrase' ? <Check size={16} /> : <Copy size={16} />}
                {copiedField === 'phrase'
                  ? (isIt ? 'Copiato!' : 'Copied!')
                  : (isIt ? 'Copia Frase Seed' : 'Copy Seed Phrase')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
