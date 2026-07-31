import { downloadCurrentPageAsOfflineHtml } from '../utils/exporter';
import { ShieldAlert, Download, Lock, WifiOff, FileCode } from 'lucide-react';

interface SecurityAuditProps {
  lang: 'it' | 'en';
}

export const SecurityAudit: React.FC<SecurityAuditProps> = ({ lang }) => {
  const isIt = lang === 'it';

  const handleDownloadOfflineHtml = () => {
    downloadCurrentPageAsOfflineHtml('deck-entropy-bitcoin-seed-generator-airgapped.html');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          <Lock size={20} color="var(--accent-emerald)" />
          {isIt ? 'Sicurezza & Audit Air-Gapped' : 'Security & Air-Gapped Audit'}
        </h3>

        <span className="badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <WifiOff size={14} />
          {isIt ? '100% Offline (0 Chiamate di Rete)' : '100% Offline (0 Network Calls)'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'var(--btc-orange)', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={16} />
            {isIt ? 'Garanzie di Protezione & Audit' : 'Protection Guarantees & Audit'}
          </h4>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>{isIt ? 'Nessun server backend, tracker o libreria di terze parti.' : 'No backend server, trackers, or third-party libraries.'}</li>
            <li>{isIt ? 'Derivazione PBKDF2 HMAC-SHA512 nativa Web Crypto API.' : 'Native Web Crypto API PBKDF2 HMAC-SHA512 derivation.'}</li>
            <li>{isIt ? 'Calcolo Factoradic 52! eseguito con BigInt locale.' : 'Factoradic 52! calculation executed with local BigInt.'}</li>
            <li>{isIt ? 'Codice sorgente 100% ispezionabile ed eseguibile offline.' : '100% inspectable source code runnable offline.'}</li>
          </ul>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Download size={16} />
              {isIt ? 'Esporta Versione Standalone Offline' : 'Export Offline Standalone Version'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {isIt
                ? 'Scarica questa pagina in un singolo file HTML auto-contenuto da salvare su chiavetta USB ed eseguire su hardware Air-Gapped.'
                : 'Download this page as a single self-contained HTML file to save on USB and run on Air-Gapped hardware.'}
            </p>
          </div>

          <button
            onClick={handleDownloadOfflineHtml}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-emerald), #059669)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            <FileCode size={18} />
            {isIt ? 'Scarica File HTML Standalone (.html)' : 'Download Standalone HTML File (.html)'}
          </button>
        </div>
      </div>
    </div>
  );
};
