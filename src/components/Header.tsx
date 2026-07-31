import { useState } from 'react';
import { MessageSquare, Globe, X } from 'lucide-react';

interface HeaderProps {
  lang: 'it' | 'en';
  onLangChange: (lang: 'it' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onLangChange }) => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const isIt = lang === 'it';

  return (
    <header style={{ marginBottom: '1.75rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.5rem',
              color: '#000',
              boxShadow: '0 2px 12px var(--accent-glow)',
            }}
          >
            ♠
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.6px', lineHeight: 1.2 }}>
              52<span style={{ color: 'var(--accent)' }}>Entropy</span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
              {isIt
                ? 'Entropia da 52 carte → Seed Bitcoin BIP-39'
                : '52-card deck entropy → BIP-39 Bitcoin Seed'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowQuoteModal(true)}
            className="btn-secondary"
            style={{ borderColor: 'rgba(247, 147, 26, 0.25)', color: 'var(--accent)', background: 'var(--accent-subtle)' }}
          >
            <MessageSquare size={14} />
            @giacomozucco
          </button>

          <button
            onClick={() => onLangChange(lang === 'it' ? 'en' : 'it')}
            className="btn-secondary"
          >
            <Globe size={14} />
            {lang === 'it' ? 'IT' : 'EN'}
          </button>
        </div>
      </div>

      {/* Quote Context Modal */}
      {showQuoteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            className="panel"
            style={{ maxWidth: '600px', width: '100%', padding: '1.75rem', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQuoteModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.15rem', fontWeight: 700 }}>
              L'Intuizione di Giacomo Zucco
            </h3>

            <blockquote
              style={{
                background: 'var(--bg-base)',
                borderLeft: '3px solid var(--accent)',
                padding: '1rem 1.1rem',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontStyle: 'italic',
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                lineHeight: 1.6,
              }}
            >
              "Calcolare l'entropia equivalente esatta é pallosissimo. Ma un mazzo di 52 carte ben mescolato ha piú di 128 bit. Ci sono metodi non noiosi anche se matematicamente meno eleganti. Un tool che parte dal mazzo e genera seed sul device sarebbe top."
              <br /><br />
              <span style={{ fontSize: '0.82rem', fontStyle: 'normal', color: 'var(--text-secondary)' }}>
                "Un mazzo ben mescolato fornisce log2(52!) ≈ 225 bit, fin troppo per 128 bit di entropia necessarie in Bitcoin."
              </span>
            </blockquote>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <strong>52Entropy</strong> è stato sviluppato in omaggio a questa visione: offrire una soluzione open-source, offline, trasparente e matematicamente ineccepibile.
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
