import { useState } from 'react';
import type { Card } from '../utils/cards';
import { parseCardInput } from '../utils/cards';
import { FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuickTextInputProps {
  onApplyCards: (cards: Card[]) => void;
  lang: 'it' | 'en';
}

export const QuickTextInput: React.FC<QuickTextInputProps> = ({ onApplyCards, lang }) => {
  const [inputText, setInputText] = useState('');
  const [parseResult, setParseResult] = useState<{ cards: Card[]; invalidTokens: string[] } | null>(null);

  const isIt = lang === 'it';

  const handleParse = () => {
    if (!inputText.trim()) return;
    const res = parseCardInput(inputText);
    setParseResult(res);
    if (res.cards.length > 0) {
      onApplyCards(res.cards);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        <FileText size={20} color="var(--btc-orange)" />
        {isIt ? 'Incolla o Digita Sequenza Testuale' : 'Paste or Type Text Sequence'}
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        {isIt
          ? 'Puoi incollare codici come "AS 10H KD 2C 3S..." o "A♠ 10♥ K♦ 2♣...". I duplicati vengono filtrati automaticamente.'
          : 'Paste codes like "AS 10H KD 2C 3S..." or "A♠ 10♥ K♦ 2♣...". Duplicates will be filtered automatically.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setParseResult(null);
          }}
          placeholder={
            isIt
              ? 'Esempio: AS, 2S, 3S, 4S, 5S, 6S, 7S, 8S, 9S, 10S, JS, QS, KS, AH...'
              : 'Example: AS, 2S, 3S, 4S, 5S, 6S, 7S, 8S, 9S, 10S, JS, QS, KS, AH...'
          }
          rows={3}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={handleParse}
            disabled={!inputText.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '8px 16px',
              borderRadius: '8px',
              background: inputText.trim() ? 'var(--btc-orange)' : 'rgba(255,255,255,0.1)',
              color: inputText.trim() ? '#000' : 'var(--text-dim)',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            <span>{isIt ? 'Analizza ed Applica Sequenza' : 'Parse & Apply Sequence'}</span>
            <ArrowRight size={16} />
          </button>

          {parseResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={16} />
                {parseResult.cards.length} {isIt ? 'carte valide' : 'valid cards'}
              </span>

              {parseResult.invalidTokens.length > 0 && (
                <span style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <AlertCircle size={16} />
                  {parseResult.invalidTokens.length} {isIt ? 'non valide' : 'invalid'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
