import React, { useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';

interface CustomDecoratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputText: string;
  lang: 'fr' | 'en';
}

const DECORATOR_TEMPLATES = [
  { name: 'Ailes Royales', nameEn: 'Royal Wings', left: '꧁༺ ', right: ' ༻꧂' },
  { name: 'Étoiles Scintillantes', nameEn: 'Sparkles', left: '✧･ﾟ: *✧ ', right: ' ✧*:･ﾟ✧' },
  { name: 'Ruban & Nœud', nameEn: 'Coquette Bows', left: '୨୧ ', right: ' ୨୧' },
  { name: 'Fleurs Printanières', nameEn: 'Floral Bloom', left: '✿.｡.:* ', right: ' *:.｡.✿' },
  { name: 'Épées Guerrières', nameEn: 'Battle Swords', left: '⚔️ ', right: ' ⚔️' },
  { name: 'Cœurs d’Amour', nameEn: 'Sweet Hearts', left: '♥*♡*♥ ', right: ' ♥*♡*♥' },
  { name: 'Crochets Japonais', nameEn: 'Japanese Lenticular', left: '【 ', right: ' 】' },
  { name: 'Blocs 8-Bit', nameEn: 'Retro 8-Bit', left: '░▒▓█ ', right: ' █▓▒░' },
  { name: 'Égaliseur Musical', nameEn: 'Equalizer Wave', left: 'ıllıllı ', right: ' ıllıllı' },
  { name: 'Couronnes Royales', nameEn: 'Royal Crowns', left: '♛ ', right: ' ♛' },
  { name: 'Flèches Étoilées', nameEn: 'Star Arrows', left: '★彡 ', right: ' 彡★' },
  { name: 'Rétro MSN', nameEn: 'MSN Classic', left: '˙·٠•●♥ ', right: ' ♥●•٠·˙' },
];

export const CustomDecoratorModal: React.FC<CustomDecoratorModalProps> = ({
  isOpen,
  onClose,
  inputText,
  lang,
}) => {
  const [customLeft, setCustomLeft] = useState('꧁༺ ');
  const [customRight, setCustomRight] = useState(' ༻꧂');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sample = inputText.trim() || (lang === 'fr' ? 'Votre Texte Ici' : 'Your Text Here');
  const decoratedResult = `${customLeft}${sample}${customRight}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(decoratedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'fr' ? 'Encadrer & Décorer le Texte' : 'Custom Text Decorator & Frames'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Live Preview Box */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              {lang === 'fr' ? 'Résultat décoré en direct :' : 'Live decorated result:'}
            </label>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-lg font-medium text-slate-900 break-words select-all min-h-[68px] flex items-center justify-center">
              {decoratedResult}
            </div>
          </div>

          {/* Quick Preset Templates */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              {lang === 'fr' ? 'Modèles prédéfinis populaires :' : 'Popular preset templates:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DECORATOR_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCustomLeft(tmpl.left);
                    setCustomRight(tmpl.right);
                  }}
                  className="p-2 text-left bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-lg transition-colors text-xs"
                >
                  <span className="font-semibold text-slate-800 block truncate">
                    {lang === 'fr' ? tmpl.name : tmpl.nameEn}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block truncate mt-0.5">
                    {tmpl.left}...{tmpl.right}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Left & Right inputs */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                {lang === 'fr' ? 'Préfixe / Début :' : 'Prefix / Left side:'}
              </label>
              <input
                type="text"
                value={customLeft}
                onChange={(e) => setCustomLeft(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                {lang === 'fr' ? 'Suffixe / Fin :' : 'Suffix / Right side:'}
              </label>
              <input
                type="text"
                value={customRight}
                onChange={(e) => setCustomRight(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            {lang === 'fr' ? 'Fermer' : 'Close'}
          </button>
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{lang === 'fr' ? 'Copié !' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Copier le texte décoré' : 'Copy decorated text'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
