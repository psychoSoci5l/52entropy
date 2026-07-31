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
    <header style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--btc-orange), #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: '#000',
              boxShadow: '0 4px 15px var(--btc-orange-glow)',
            }}
          >
            ♠
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                52<span style={{ color: 'var(--btc-orange)' }}>Entropy</span>
              </h1>
              <span className="badge-btc">Bitcoin BIP-39</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isIt
                ? "Dall'entropia fisica di un mazzo di 52 carte al Seed Bitcoin (BIP-39 12/24 parole)"
                : 'From a physical 52-card deck entropy to Bitcoin Seed (12/24 BIP-39 words)'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Quote Context Button */}
          <button
            onClick={() => setShowQuoteModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(247, 147, 26, 0.12)',
              border: '1px solid rgba(247, 147, 26, 0.3)',
              color: 'var(--btc-orange)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <MessageSquare size={14} />
            <span>@giacomozucco Vision</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => onLangChange(lang === 'it' ? 'en' : 'it')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <Globe size={14} />
            <span>{lang === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}</span>
          </button>
        </div>
      </div>

      {/* Quote Context Modal */}
      {showQuoteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: '600px', width: '100%', padding: '1.5rem', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQuoteModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ color: 'var(--btc-orange)', marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: 700 }}>
              L'Intuizione di Giacomo Zucco (@giacomozucco on X)
            </h3>

            <blockquote
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderLeft: '4px solid var(--btc-orange)',
                padding: '1rem',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
                marginBottom: '1rem',
              }}
            >
              "Calcolare l'entropia equivalente esatta é pallosissimo. Ma un mazzo di 52 carte ben mescolato ha piú di 128 bit. Ci sono metodi non noiosi anche se matematicamente meno eleganti. Un tool che parte dal mazzo e genera seed sul device sarebbe top. :)"
              <br /><br />
              <span style={{ fontSize: '0.85rem', fontStyle: 'normal', color: 'var(--text-muted)' }}>
                "Un mazzo ben mescolato fornisce log2(52!) ≈ 225 bit, fin troppo per 128 bit di entropia necessarie in Bitcoin."
              </span>
            </blockquote>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              **52Entropy** è stato sviluppato in omaggio a questa visione: offrire una soluzione open-source, offline, trasparente e matematicamente ineccepibile.
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
