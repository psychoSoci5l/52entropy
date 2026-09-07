import { useState } from 'react';
import { BookOpen, ChevronDown, Shuffle, Keyboard, Eye, Download, AlertTriangle } from 'lucide-react';

interface OnboardingProps {
  lang: 'it' | 'en';
}

const STEPS = {
  it: [
    {
      icon: Shuffle,
      title: '1. Mescola un mazzo fisico',
      body: 'Usa un riffle shuffle incrociato ripetuto: taglia il mazzo in due, intervalla le carte e ricompatta. Ripeti almeno 5-7 volte. Non usare mescolate a mazzo (overhand) da sole: nonrandomizzano abbastanza. Non guardare le carte mentre mescoli.',
    },
    {
      icon: Keyboard,
      title: '2. Trascrivi l\'ordine delle 52 carte',
      body: 'Gira le carte una alla volta e registrale in ordine, qui nella griglia o nell\'input testuale (es. "AS 10H KD..."). L\'ordine conta: è la sequenza stessa a fare da entropia.',
    },
    {
      icon: Eye,
      title: '3. Genera e verifica il seed',
      body: 'A mazzo completo l\'app calcola rango di Lehmer + SHA-256 e produce il mnemonico BIP-39. Passphrase opzionale (25ª parola) per protezione extra. Copia solo quando sei pronto.',
    },
    {
      icon: Download,
      title: '4. Usa offline per seed reali',
      body: 'Per seed veri: scarica l\'HTML standalone, copialo su USB e aprilo su un computer air-gapped. Su questa pagina online fai solo prove. Ricorda: lo stato non viene salvato — se ricarichi, riparti da capo.',
    },
  ],
  en: [
    {
      icon: Shuffle,
      title: '1. Shuffle a physical deck',
      body: 'Use repeated riffle shuffles: split the deck in two, interleave the cards, and press them back together. Repeat at least 5-7 times. Overhand shuffles alone are not enough. Don\'t look at the cards while shuffling.',
    },
    {
      icon: Keyboard,
      title: '2. Transcribe the order of all 52 cards',
      body: 'Flip the cards one at a time and record them in order, here in the grid or via the text input (e.g. "AS 10H KD..."). Order matters: the sequence itself is the entropy.',
    },
    {
      icon: Eye,
      title: '3. Generate and verify the seed',
      body: 'With a complete deck the app computes Lehmer rank + SHA-256 and produces the BIP-39 mnemonic. Optional passphrase (25th word) for extra protection. Copy only when ready.',
    },
    {
      icon: Download,
      title: '4. Go offline for real seeds',
      body: 'For real seeds: download the standalone HTML, copy it to a USB stick and open it on an air-gapped computer. Use this online page for practice only. State is not saved — reloading starts over.',
    },
  ],
};

export const Onboarding: React.FC<OnboardingProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isIt = lang === 'it';
  const steps = isIt ? STEPS.it : STEPS.en;

  return (
    <div className="panel" style={{ padding: '0.9rem 1.25rem' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600,
          padding: 0, width: '100%', textAlign: 'left',
        }}
        aria-expanded={isOpen}
      >
        <BookOpen size={18} color="var(--accent)" />
        {isIt ? 'Come funziona — dal mazzo al seed in 4 passi' : 'How it works — deck to seed in 4 steps'}
        <ChevronDown
          size={16}
          style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.9rem' }}>
          {steps.map((step) => (
            <div key={step.title} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <step.icon size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{step.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                  {step.body}
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
            <AlertTriangle size={13} color="var(--accent)" style={{ flexShrink: 0 }} />
            {isIt
              ? 'Il pulsante Demo serve solo a esplorare l\'interfaccia: non genera entropia da un mazzo reale.'
              : 'The Demo button is for exploring the interface only: it does not generate entropy from a real deck.'}
          </div>
        </div>
      )}
    </div>
  );
};