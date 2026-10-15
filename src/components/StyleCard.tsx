import React, { useState } from 'react';
import { Copy, Check, Star, ExternalLink, Eye } from 'lucide-react';
import { TextStyleDefinition, ZalgoOptions, AccentMode } from '../types';

interface StyleCardProps {
  styleDef: TextStyleDefinition;
  inputText: string;
  prefix: string;
  suffix: string;
  zalgoOptions: ZalgoOptions;
  accentMode: AccentMode;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenSocialPreview: (styleName: string, transformedText: string) => void;
  lang: 'fr' | 'en';
}

export const StyleCard: React.FC<StyleCardProps> = ({
  styleDef,
  inputText,
  prefix,
  suffix,
  zalgoOptions,
  accentMode,
  isFavorite,
  onToggleFavorite,
  onOpenSocialPreview,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  // If no text is typed, use a representative default text so the user immediately sees what the font looks like!
  const effectiveBaseText = inputText.trim() || (lang === 'fr' ? 'Exemple de texte YayText' : 'Sample YayText Preview');
  
  // Apply transformation with accent handling
  const coreTransformed = styleDef.transform(effectiveBaseText, { zalgo: zalgoOptions, accentMode });
  // Apply prefix & suffix if specified
  const transformedText = `${prefix}${coreTransformed}${suffix}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transformedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = transformedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleTweet = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(transformedText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="p-4 pb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
            {lang === 'fr' ? styleDef.nameFr : styleDef.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'fr' ? styleDef.descriptionFr : styleDef.description}
          </p>
        </div>

        {/* Favorite star */}
        <button
          type="button"
          onClick={() => onToggleFavorite(styleDef.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 transition-colors shrink-0"
          title={
            isFavorite
              ? lang === 'fr'
                ? 'Retirer des favoris'
                : 'Remove from favorites'
              : lang === 'fr'
              ? 'Ajouter aux favoris'
              : 'Add to favorites'
          }
        >
          <Star
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorite ? 'fill-amber-400 text-amber-500' : ''
            }`}
          />
        </button>
      </div>

      {/* Styled Output Box */}
      <div className="px-4 py-3 my-1">
        <div
          className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 min-h-[64px] flex items-center select-all overflow-x-auto text-slate-900 font-normal leading-relaxed text-base break-words"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        >
          <span className="w-full">{transformedText}</span>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Social Preview Button */}
          <button
            type="button"
            onClick={() => onOpenSocialPreview(lang === 'fr' ? styleDef.nameFr : styleDef.name, transformedText)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md transition-colors border border-transparent hover:border-slate-200"
            title={lang === 'fr' ? 'Aperçu sur réseaux sociaux' : 'Social media preview'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'fr' ? 'Aperçu' : 'Preview'}</span>
          </button>

          {/* Tweet / Share Button */}
          <button
            type="button"
            onClick={handleTweet}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md transition-colors border border-transparent hover:border-slate-200"
            title={lang === 'fr' ? 'Tweeter ce texte' : 'Tweet this text'}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tweet</span>
          </button>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{lang === 'fr' ? 'Copié !' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Copier' : 'Copy'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
