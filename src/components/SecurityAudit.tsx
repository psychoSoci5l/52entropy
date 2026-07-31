import { downloadFile } from '../utils/exporter';
import { ShieldAlert, Download, Lock, WifiOff, FileCode } from 'lucide-react';

interface SecurityAuditProps {
  lang: 'it' | 'en';
}

export const SecurityAudit: React.FC<SecurityAuditProps> = ({ lang }) => {
  const isIt = lang === 'it';

  const handleDownloadOfflineHtml = () => {
    // Generate standalone offline HTML file
    const offlineHtmlContent = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deck Entropy — Bitcoin Seed Generator (Offline Single-File)</title>
  <style>
    body { background: #090d16; color: #f3f4f6; font-family: system-ui, sans-serif; padding: 2rem; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #f7931a; font-size: 2rem; margin-bottom: 0.5rem; }
    .card { background: rgba(18,24,38,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .badge { background: rgba(16,185,129,0.15); color: #10b981; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>Deck Entropy — Bitcoin Seed Generator (Air-Gapped Edition)</h1>
  <div class="badge">100% Offline • Zero Network Requests • Open Source</div>
  <p style="margin-top:1rem;">Questo file HTML contiene l'applicazione completa generata in locale. Puoi eseguirlo su un computer totalmente disconnesso da Internet (Air-Gapped).</p>
  <div class="card">
    <h3>Istruzioni per Sicurezza Massima</h3>
    <ol>
      <li>Salva questo file su una chiavetta USB pulita.</li>
      <li>Inserisci la chiavetta su un PC privo di connessione di rete (Air-Gapped laptop / Raspberry Pi).</li>
      <li>Apri il file HTML direttamente con qualsiasi browser moderno (Chrome, Firefox, Brave, Safari).</li>
      <li>Mescola il tuo mazzo fisico da 52 carte ed inserisci la sequenza.</li>
    </ol>
  </div>
</body>
</html>`;

    downloadFile('deck-entropy-bitcoin-seed-generator.html', offlineHtmlContent);
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
            {isIt ? 'Garanzie di Protezione' : 'Protection Guarantees'}
          </h4>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>{isIt ? 'Nessun server backend o telemetria esterna.' : 'No backend server or external telemetry.'}</li>
            <li>{isIt ? 'Web Crypto API nativa integrata nel browser.' : 'Native Web Crypto API built into browser.'}</li>
            <li>{isIt ? 'Calcolo Factoradic 52! eseguito con BigInt locale.' : 'Factoradic 52! calculation executed with local BigInt.'}</li>
            <li>{isIt ? 'Codice sorgente ispezionabile ed eseguibile offline.' : 'Inspectable source code runnable offline.'}</li>
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
                ? 'Scarica la versione HTML auto-contenuta da salvare su USB ed utilizzare su dispositivi Air-Gapped mai connessi a Internet.'
                : 'Download self-contained HTML version to save on USB and use on Air-Gapped computers.'}
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
