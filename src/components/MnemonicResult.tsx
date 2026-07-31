import { useState, useEffect } from 'react';
import type { MnemonicResult as MnemonicResultType } from '../utils/bip39';
import type { DerivedBip39Seed } from '../utils/bip39Seed';
import { deriveBip39Seed } from '../utils/bip39Seed';
import { KeyRound, Eye, EyeOff, Copy, Check, ShieldCheck, Lock, Terminal } from 'lucide-react';

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
  const [passphrase, setPassphrase] = useState('');
  const [derivedSeed, setDerivedSeed] = useState<DerivedBip39Seed | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isIt = lang === 'it';

  // Compute 512-bit seed via PBKDF2 whenever phrase or passphrase changes
  useEffect(() => {
    let isCancelled = false;

    if (!mnemonic) {
      setDerivedSeed(null);
      return;
    }

    deriveBip39Seed(mnemonic.phrase, passphrase).then((seed) => {
      if (!isCancelled) {
        setDerivedSeed(seed);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [mnemonic, passphrase]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="panel-hero" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>
            <KeyRound size={22} />
            {isIt ? 'Frase Mnemonica BIP-39 Generata' : 'Generated BIP-39 Mnemonic Phrase'}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Word Count Switch */}
          <div className="segmented-control">
            <button
              className={wordCountTarget === 12 ? 'active' : ''}
              onClick={() => onWordCountChange(12)}
            >
              12 {isIt ? 'Parole' : 'Words'}
            </button>
            <button
              className={wordCountTarget === 24 ? 'active' : ''}
              onClick={() => onWordCountChange(24)}
            >
              24 {isIt ? 'Parole' : 'Words'}
            </button>
          </div>

          {/* Privacy Toggle */}
          <button
            onClick={() => setIsMasked(!isMasked)}
            className="btn-secondary"
            style={{
              color: isMasked ? undefined : 'var(--err)',
              borderColor: isMasked ? undefined : 'rgba(239, 68, 68, 0.3)',
              background: isMasked ? undefined : 'var(--err-muted)',
            }}
          >
            {isMasked ? <Eye size={15} /> : <EyeOff size={15} />}
            {isMasked ? (isIt ? 'Mostra Seed' : 'Show Seed') : (isIt ? 'Nascondi Seed' : 'Hide Seed')}
          </button>
        </div>
      </div>

      {!mnemonic ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
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
                className="inner-card"
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: item.isChecksumIncluded
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid var(--border-subtle)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                  <span>#{item.index}</span>
                  {item.isChecksumIncluded && (
                    <span style={{ color: 'var(--ok)', fontSize: '0.65rem', fontWeight: 700 }}>
                      +Checksum
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isMasked ? 'var(--text-tertiary)' : 'var(--text-primary)', letterSpacing: isMasked ? '3px' : '0' }}>
                  {isMasked ? '••••••' : item.word}
                </div>

                <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px', opacity: 0.6 }}>
                  idx: {item.wordIndex}
                </div>
              </div>
            ))}
          </div>

          {/* Optional BIP-39 Passphrase Field (25th Word) */}
          <div className="inner-card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px' }}>
              <Lock size={15} />
              <span>{isIt ? 'Passphrase BIP-39 Opzionale (25ª Parola / "Extension"):' : 'Optional BIP-39 Passphrase (25th Word / Extension):'}</span>
            </div>
            <input
              type={isMasked ? 'password' : 'text'}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder={isIt ? 'Inserisci passphrase opzionale per protezione ulteriore...' : 'Enter optional passphrase for extra security...'}
              className="input-field"
            />
          </div>

          {/* 512-bit Master Root Seed (PBKDF2 HMAC-SHA512) */}
          {derivedSeed && (
            <div className="inner-card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <Terminal size={14} />
                  {isIt ? 'BIP-39 Master Seed 512-bit (PBKDF2 HMAC-SHA512):' : 'BIP-39 Master 512-bit Seed (PBKDF2 HMAC-SHA512):'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Path Standard: m/84'/0'/0' (Native SegWit bc1q)</span>
              </div>
              <div className="mono-data" style={{ color: isMasked ? 'var(--text-tertiary)' : 'var(--text-primary)', wordBreak: 'break-all', fontWeight: 600, opacity: isMasked ? 0.6 : 0.85 }}>
                {isMasked ? '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••' : derivedSeed.seedHex}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: 'var(--bg-base)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ok)', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>
                {isIt ? 'Checksum SHA-256 Verificato' : 'SHA-256 Checksum Verified'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCopy(mnemonic.phrase, 'phrase')}
                disabled={isMasked}
                className="btn-primary"
              >
                {copiedField === 'phrase' ? <Check size={16} /> : <Copy size={16} />}
                {copiedField === 'phrase'
                  ? (isIt ? 'Copiato!' : 'Copied!')
                  : (isIt ? 'Copia Frase Seed' : 'Copy Seed Phrase')}
              </button>

              {derivedSeed && (
                <button
                  onClick={() => handleCopy(derivedSeed.seedHex, 'seed')}
                  disabled={isMasked}
                  className="btn-secondary"
                  style={{
                    borderColor: isMasked ? undefined : 'rgba(247, 147, 26, 0.3)',
                    color: isMasked ? undefined : 'var(--accent)',
                  }}
                >
                  {copiedField === 'seed' ? <Check size={16} /> : <Copy size={16} />}
                  {copiedField === 'seed'
                    ? (isIt ? 'Copiato!' : 'Copied!')
                    : (isIt ? 'Copia Seed Hex 512-bit' : 'Copy 512-bit Seed Hex')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
