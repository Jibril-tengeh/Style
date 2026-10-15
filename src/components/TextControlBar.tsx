import React, { useRef } from 'react';
import { Clipboard, RotateCcw, Sparkles, AlertCircle, Languages } from 'lucide-react';
import { TextStats, AccentMode } from '../types';

interface TextControlBarProps {
  inputText: string;
  setInputText: (val: string) => void;
  prefix: string;
  setPrefix: (val: string) => void;
  suffix: string;
  setSuffix: (val: string) => void;
  accentMode: AccentMode;
  setAccentMode: (mode: AccentMode) => void;
  stats: TextStats;
  lang: 'fr' | 'en';
}

export const TextControlBar: React.FC<TextControlBarProps> = ({
  inputText,
  setInputText,
  prefix,
  setPrefix,
  suffix,
  setSuffix,
  accentMode,
  setAccentMode,
  stats,
  lang,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const presets = lang === 'fr'
    ? [
        { label: 'L’été à la plage ☀️', text: 'L’été à la plage avec un café au soleil' },
        { label: 'Soldes d’été 🔥', text: 'SOLDES D’ÉTÉ : -50% SUR TOUT LE SITE' },
        { label: 'Bio Poésie ✨', text: 'Créateur & rêveur · Poésie et créativité' },
        { label: 'Gamer ⚡', text: 'L’Éclair Céleste PRO' },
        { label: 'Rappel ⚠️', text: 'Rappel pour l’événement de ce soir' },
      ]
    : [
        { label: 'Big Summer Sale 🔥', text: 'SUMMER SALE: 50% OFF EVERYTHING' },
        { label: 'Café & Aesthetics ☕', text: 'Charming café, books, and cozy vibes ✨' },
        { label: 'Insta Bio ✨', text: 'Content Creator & Digital Nomad' },
        { label: 'Gamer Tag ⚡', text: 'Shadow Hunter PRO' },
        { label: 'Urgent ⚠️', text: 'Important announcement for today' },
      ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        if (textareaRef.current) textareaRef.current.focus();
      }
    } catch {
      // Fallback
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  const handleClear = () => {
    setInputText('');
    if (textareaRef.current) textareaRef.current.focus();
  };

  const isTwitterOver = stats.twitterRemaining < 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <label
          htmlFor="primary-text-input"
          className="text-sm font-semibold text-slate-800 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>{lang === 'fr' ? 'Votre texte original :' : 'Your original text:'}</span>
        </label>

        {/* Quick action controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'fr' ? 'Coller' : 'Paste'}</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!inputText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'fr' ? 'Effacer' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="primary-text-input"
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            lang === 'fr'
              ? 'Tapez ou collez votre texte ici (les accents é, è, ê, à, ç sont 100% stylisés en direct)...'
              : 'Type or paste your text here (accents é, è, ê, à, ç are fully styled in real time)...'
          }
          className="w-full px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 bg-slate-50/70 focus:bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-y min-h-[90px]"
        />
      </div>

      {/* Accent Mode & Prefix/Suffix Toolbar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Accent Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
            <Languages className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'fr' ? 'Accents (é, è, ê, à, ç) :' : 'Accents (é, è, ê, à, ç):'}</span>
          </div>
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg flex-wrap gap-0.5">
            <button
              type="button"
              onClick={() => setAccentMode('preserve')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                accentMode === 'preserve'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={
                lang === 'fr'
                  ? 'Garde les vrais accents français (é, è, à) bien visibles sans aucun carré vide'
                  : 'Keeps French accents (é, è, à) visible without any missing boxes'
              }
            >
              {lang === 'fr' ? 'Accents visibles (é, è, à)' : 'Visible accents (é, è, à)'}
            </button>
            <button
              type="button"
              onClick={() => setAccentMode('combine')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                accentMode === 'combine'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={
                lang === 'fr'
                  ? 'Empile les diacritiques (attention : peut afficher des carrés ▯ sur certains Android)'
                  : 'Combining diacritics (may show empty boxes on some Android phones)'
              }
            >
              {lang === 'fr' ? 'Accents empilés (é → 𝐞́)' : 'Stacked accents (é → 𝐞́)'}
            </button>
            <button
              type="button"
              onClick={() => setAccentMode('strip')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                accentMode === 'strip'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={
                lang === 'fr'
                  ? 'Convertit les accents en lettres de base (é → e → 𝐞)'
                  : 'Converts accents to base letters (é → e → 𝐞)'
              }
            >
              {lang === 'fr' ? 'Sans accents (é → 𝐞)' : 'No accents (é → 𝐞)'}
            </button>
          </div>
          {accentMode === 'combine' && (
            <span className="text-[11px] text-amber-600 font-medium">
              {lang === 'fr'
                ? '⚠️ Si votre écran affiche des carrés ▯, choisissez "Accents visibles"'
                : '⚠️ If your screen shows boxes ▯, switch to "Visible accents"'}
            </span>
          )}
        </div>

        {/* Prefix / Suffix optional adornment strip */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-700 shrink-0">
            {lang === 'fr' ? 'Encadrement :' : 'Wrap:'}
          </span>
          <input
            type="text"
            placeholder={lang === 'fr' ? 'Préfixe' : 'Prefix'}
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:border-indigo-500"
          />
          <span className="text-slate-400">+ texte +</span>
          <input
            type="text"
            placeholder={lang === 'fr' ? 'Suffixe' : 'Suffix'}
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:border-indigo-500"
          />
          {(prefix || suffix) && (
            <button
              onClick={() => {
                setPrefix('');
                setSuffix('');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-1"
            >
              {lang === 'fr' ? 'Effacer' : 'Reset'}
            </button>
          )}
        </div>
      </div>

      {/* Preset inspiration prompts */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-500 mr-1">
          {lang === 'fr' ? 'Exemples :' : 'Sample presets:'}
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(p.text)}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-md transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Clean Unboxed Metadata Strip (Zero-Pill discipline) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            <strong className="font-semibold text-slate-800 tabular-nums font-mono">
              {stats.characters}
            </strong>{' '}
            {lang === 'fr' ? 'caractères' : 'chars'}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>
            <strong className="font-semibold text-slate-800 tabular-nums font-mono">
              {stats.words}
            </strong>{' '}
            {lang === 'fr' ? 'mots' : 'words'}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>
            <strong className="font-semibold text-slate-800 tabular-nums font-mono">
              {stats.bytes}
            </strong>{' '}
            {lang === 'fr' ? 'octets UTF-8' : 'UTF-8 bytes'}
          </span>
        </div>

        {/* Twitter character count status */}
        <div className="flex items-center gap-1.5">
          {isTwitterOver ? (
            <div className="flex items-center gap-1 text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'fr'
                  ? `Dépassement X/Twitter (+${Math.abs(stats.twitterRemaining)})`
                  : `X/Twitter limit exceeded (+${Math.abs(stats.twitterRemaining)})`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>{lang === 'fr' ? 'Reste sur X/Twitter :' : 'X/Twitter remaining:'}</span>
              <span className="font-mono font-semibold tabular-nums text-slate-700">
                {stats.twitterRemaining}
              </span>
              <span className="text-slate-400">/ 280</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
