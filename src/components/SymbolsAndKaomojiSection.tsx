import React, { useState } from 'react';
import { Smile, Sparkles, Copy, Check, Plus, Search } from 'lucide-react';
import { KAOMOJI_COLLECTION, SYMBOL_CATEGORIES } from '../utils/symbolsAndKaomoji';

interface SymbolsAndKaomojiSectionProps {
  onInsertToInput: (textToInsert: string) => void;
  lang: 'fr' | 'en';
}

export const SymbolsAndKaomojiSection: React.FC<SymbolsAndKaomojiSectionProps> = ({
  onInsertToInput,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'kaomoji' | 'symbols'>('kaomoji');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(text);
      setTimeout(() => setCopiedItem(null), 1500);
    } catch {
      // Fallback
      setCopiedItem(text);
      setTimeout(() => setCopiedItem(null), 1500);
    }
  };

  const filteredKaomojis = KAOMOJI_COLLECTION.filter((k) => {
    const q = searchTerm.toLowerCase();
    return (
      k.text.toLowerCase().includes(q) ||
      k.nameEn.toLowerCase().includes(q) ||
      k.nameFr.toLowerCase().includes(q)
    );
  });

  return (
    <div id="symbols" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>
              {lang === 'fr'
                ? 'Bibliothèque Kaomojis & Symboles Unicode'
                : 'Kaomoji & Unicode Symbols Library'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'fr'
              ? 'Cliquez pour copier ou insérer directement dans votre boîte de texte'
              : 'Click to copy or insert directly into your text input box'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('kaomoji')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'kaomoji'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Kaomoji (Faces)</span>
          </button>
          <button
            onClick={() => setActiveTab('symbols')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'symbols'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Symboles' : 'Symbols'}</span>
          </button>
        </div>
      </div>

      {/* Optional Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'fr'
                ? 'Rechercher un symbole ou une émotion...'
                : 'Search symbol or mood...'
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Tab 1: Kaomoji Grid */}
      {activeTab === 'kaomoji' && (
        <div id="kaomoji" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 scroll-mt-20">
          {filteredKaomojis.map((item) => {
            const isCopied = copiedItem === item.text;
            return (
              <div
                key={item.id}
                className="group p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-lg border border-slate-200/80 hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div className="text-center py-2.5 px-1 select-all font-sans text-base text-slate-800 tracking-wide font-medium min-h-[46px] flex items-center justify-center">
                  {item.text}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-[11px] text-slate-500 truncate max-w-[100px]">
                    {lang === 'fr' ? item.nameFr : item.nameEn}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onInsertToInput(item.text)}
                      className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"
                      title={lang === 'fr' ? 'Insérer dans le texte' : 'Insert into text'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(item.text)}
                      className={`p-1 rounded transition-colors ${
                        isCopied
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-500 hover:text-indigo-600 hover:bg-white'
                      }`}
                      title={lang === 'fr' ? 'Copier' : 'Copy'}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Symbols Categories */}
      {activeTab === 'symbols' && (
        <div className="space-y-5">
          {SYMBOL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 tracking-wide">
                {lang === 'fr' ? cat.nameFr : cat.nameEn}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {cat.symbols.map((sym, sIdx) => {
                  const isCopied = copiedItem === sym;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleCopy(sym)}
                      className={`group relative min-w-[38px] h-9 px-2 text-base flex items-center justify-center rounded-lg border transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                      }`}
                      title={lang === 'fr' ? `Copier ${sym}` : `Copy ${sym}`}
                    >
                      <span>{sym}</span>
                      {isCopied && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-in fade-in">
                          {lang === 'fr' ? 'Copié !' : 'Copied!'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
