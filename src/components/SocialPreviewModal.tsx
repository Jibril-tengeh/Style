import React, { useState } from 'react';
import { X, Copy, Check, Heart, MessageCircle, Repeat2, Bookmark, Send, Share2 } from 'lucide-react';
import { SocialPlatform } from '../types';

interface SocialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  styleName: string;
  transformedText: string;
  lang: 'fr' | 'en';
}

export const SocialPreviewModal: React.FC<SocialPreviewModalProps> = ({
  isOpen,
  onClose,
  styleName,
  transformedText,
  lang,
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>('twitter');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transformedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'fr' ? 'Aperçu Réseaux Sociaux' : 'Social Media Preview'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'fr' ? `Style appliqué : ${styleName}` : `Applied style: ${styleName}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'twitter', name: 'X / Twitter' },
            { id: 'instagram', name: 'Instagram Bio' },
            { id: 'whatsapp', name: 'WhatsApp' },
            { id: 'tiktok', name: 'TikTok' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPlatform(tab.id as SocialPlatform)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                platform === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Mockup Preview Area */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex-1 flex items-center justify-center min-h-[260px]">
          {/* TWITTER / X MOCKUP */}
          {platform === 'twitter' && (
            <div className="w-full max-w-md bg-black text-white p-4 rounded-xl border border-neutral-800 shadow-lg text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shrink-0">
                  YT
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">Alexandre Dupont</span>
                    <span className="text-neutral-500 text-xs">@alex_creative · 2m</span>
                  </div>
                  <div className="mt-2 text-white text-base leading-relaxed break-words whitespace-pre-wrap">
                    {transformedText}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-neutral-500 text-xs max-w-xs">
                    <span className="flex items-center gap-1 hover:text-sky-400">
                      <MessageCircle className="w-3.5 h-3.5" /> 18
                    </span>
                    <span className="flex items-center gap-1 hover:text-green-400">
                      <Repeat2 className="w-3.5 h-3.5" /> 42
                    </span>
                    <span className="flex items-center gap-1 hover:text-rose-400">
                      <Heart className="w-3.5 h-3.5" /> 312
                    </span>
                    <span className="flex items-center gap-1 hover:text-indigo-400">
                      <Bookmark className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSTAGRAM BIO MOCKUP */}
          {platform === 'instagram' && (
            <div className="w-full max-w-sm bg-white p-5 rounded-2xl border border-slate-200 shadow-md text-sm text-slate-900">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-lg">
                    YT
                  </div>
                </div>
                <div className="flex-1 flex justify-around text-center text-xs">
                  <div>
                    <span className="font-bold block text-sm">142</span>
                    <span className="text-slate-500">posts</span>
                  </div>
                  <div>
                    <span className="font-bold block text-sm">18.4k</span>
                    <span className="text-slate-500">followers</span>
                  </div>
                  <div>
                    <span className="font-bold block text-sm">490</span>
                    <span className="text-slate-500">following</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-slate-900">Creative Explorer ✨</p>
                <div className="text-slate-800 text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {transformedText}
                </div>
                <p className="text-xs text-indigo-600 font-medium hover:underline">
                  linktr.ee/my_profile
                </p>
              </div>
            </div>
          )}

          {/* WHATSAPP MOCKUP */}
          {platform === 'whatsapp' && (
            <div className="w-full max-w-sm bg-[#e5ddd5] p-5 rounded-2xl border border-slate-300 shadow-md">
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-[#d9fdd3] text-slate-900 px-3.5 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-sm relative">
                  <p className="break-words leading-relaxed whitespace-pre-wrap">{transformedText}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500">
                    <span>16:42</span>
                    <span className="text-[#53bdeb] font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TIKTOK MOCKUP */}
          {platform === 'tiktok' && (
            <div className="w-full max-w-sm bg-black text-white p-4 rounded-2xl border border-neutral-800 shadow-md text-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs">
                  @
                </div>
                <span className="font-bold text-xs text-white">@viral_creator</span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-100 break-words whitespace-pre-wrap">
                {transformedText} <span className="text-neutral-400 font-semibold">#fyp #viral #trending</span>
              </p>
              <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-neutral-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> 24.5K
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> 842
                </span>
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> 1.2K
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {lang === 'fr'
              ? 'Prêt à être collé sur vos profils et posts'
              : 'Ready to be pasted on your profiles and posts'}
          </span>
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
                <span>{lang === 'fr' ? 'Copié dans le presse-papier !' : 'Copied to clipboard!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Copier le texte' : 'Copy text'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
