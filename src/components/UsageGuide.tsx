import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, ShieldCheck, Smartphone, Laptop } from 'lucide-react';

interface UsageGuideProps {
  lang: 'fr' | 'en';
}

export const UsageGuide: React.FC<UsageGuideProps> = ({ lang }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = lang === 'fr'
    ? [
        {
          q: 'Comment fonctionne YayText et ces polices personnalisées ?',
          a: 'Contrairement aux polices classiques (comme Arial ou Roboto) qui nécessitent d’être installées sur votre ordinateur, YayText utilise le standard international Unicode. Chaque lettre stylisée (comme 𝐓 ou 𝒯) correspond à un caractère Unicode officiel distinct. Vous pouvez donc les copier et les coller n’importe où sur le Web !'
        },
        {
          q: 'Où puis-je utiliser ces polices et styles de texte ?',
          a: 'Vous pouvez les coller directement dans vos bios et légendes Instagram, vos tweets sur X (Twitter), vos commentaires TikTok, vos messages et statuts WhatsApp, vos serveurs et pseudos Discord, vos posts Facebook et LinkedIn, ainsi que vos SMS.'
        },
        {
          q: 'Est-ce compatible avec tous les téléphones (iPhone et Android) ?',
          a: 'Oui ! Tous les smartphones modernes sous iOS et Android, ainsi que les ordinateurs sous Windows, macOS et Linux supportent les jeux de caractères Unicode modernes.'
        },
        {
          q: 'Qu’est-ce que le texte Zalgo / Glitch ?',
          a: 'Le texte Zalgo utilise des "caractères combinants diacritiques" (accents, tildes et points) empilés verticalement au-dessus et en dessous de chaque lettre, créant un effet visuel chaotique et effrayant inspiré des creepypastas d’internet.'
        },
        {
          q: 'Comment sont stylisées les lettres avec accents (é, è, ê, à, ç, etc.) ?',
          a: 'Le consortium Unicode n’a créé de lettres mathématiques (comme 𝐀, 𝐚) que pour l’alphabet latin de base. Pour styliser vos textes en français sans laisser de lettres normales, notre moteur décompose automatiquement les accents et leur associe des marques diacritiques combinées (ex: 𝐞́, 𝗲̀, 𝘦̂, 𝗮̀, 𝗰̧). Vous pouvez aussi activer le mode "Simplifiés" (é → 𝐞) dans la barre d’outils pour un rendu épuré sur les styles à bulles ou carrés.'
        },
        {
          q: 'Le service est-il 100% gratuit et sans limite ?',
          a: 'Oui, YayText est entièrement gratuit, sans inscription, sans publicité intrusive et fonctionne directement et instantanément dans votre navigateur.'
        }
      ]
    : [
        {
          q: 'How does YayText and these custom fonts work?',
          a: 'Unlike traditional fonts that require installation on your device, YayText leverages the global Unicode character set. Each styled glyph (like 𝐓 or 𝒯) is a genuine standardized Unicode code point. That means you can copy and paste them anywhere on the internet without any font installation!'
        },
        {
          q: 'Where can I paste these stylish texts?',
          a: 'You can paste them into Instagram bios & captions, Twitter/X posts, TikTok comments, WhatsApp status and messages, Discord nicknames and messages, Facebook, LinkedIn, YouTube video titles, and SMS.'
        },
        {
          q: 'Is this compatible with iPhone, Android, and PC?',
          a: 'Yes! Modern versions of iOS, Android, macOS, Windows, and Linux natively support the mathematical alphanumeric and combining Unicode ranges.'
        },
        {
          q: 'What is Zalgo / Glitch text?',
          a: 'Zalgo text stacks combining diacritical marks vertically above, through, and beneath letters, generating a chaotic digital corruption aesthetic popular in horror memes and internet folklore.'
        },
        {
          q: 'Is it completely free?',
          a: 'Yes, 100% free with zero registration, zero limits, and instant real-time client-side generation.'
        }
      ];

  return (
    <section id="guide" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm scroll-mt-20">
      <div className="max-w-3xl">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>
            {lang === 'fr'
              ? 'Guide d’utilisation & Questions Fréquentes'
              : 'Usage Guide & Frequently Asked Questions'}
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'fr'
            ? 'Tout comprendre sur le fonctionnement des polices Unicode pour réseaux sociaux'
            : 'Everything you need to know about Unicode font styling for social platforms'}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">
              {lang === 'fr' ? 'Copier-Coller Direct' : 'Direct Copy-Paste'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              {lang === 'fr'
                ? 'Aucun logiciel requis. Cliquez sur Copier et collez directement dans votre application favorite.'
                : 'No apps required. Just click copy and paste into any social bio, post, or message.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">
              {lang === 'fr' ? '100% Mobile Ready' : 'Mobile Friendly'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              {lang === 'fr'
                ? 'Fonctionne parfaitement sur iPhone, iPad, Android, tablettes et ordinateurs de bureau.'
                : 'Fully compatible across iOS, Android, macOS, Windows, and Linux devices.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">
              {lang === 'fr' ? 'Respect de la Vie Privée' : 'Privacy First'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              {lang === 'fr'
                ? 'Vos textes ne quittent jamais votre navigateur. Traitement 100% local et instantané.'
                : 'Your text is never sent to a server. Processing is 100% local and instant.'}
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
          {faqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200/80 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
