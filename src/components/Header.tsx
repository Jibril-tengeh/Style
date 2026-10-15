import React, { useState } from 'react';
import { Sparkles, Globe, Menu, X, Type, Flame, Hash, Smile, HelpCircle } from 'lucide-react';

interface HeaderProps {
  lang: 'fr' | 'en';
  setLang: (lang: 'fr' | 'en') => void;
  onOpenCustomDecorator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  onOpenCustomDecorator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: '#styles',
      labelFr: 'Polices',
      labelEn: 'Fonts',
      icon: Type,
    },
    {
      href: '#zalgo',
      labelFr: 'Glitch & Zalgo',
      labelEn: 'Glitch & Zalgo',
      icon: Flame,
    },
    {
      href: '#symbols',
      labelFr: 'Symboles',
      labelEn: 'Symbols',
      icon: Hash,
    },
    {
      href: '#kaomoji',
      labelFr: 'Kaomoji',
      labelEn: 'Kaomoji',
      icon: Smile,
    },
    {
      href: '#guide',
      labelFr: 'Guide & FAQ',
      labelEn: 'Guide & FAQ',
      icon: HelpCircle,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 header-safe transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element Brand mark */}
        <a
          href="/"
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-indigo-600 transition-colors">
            YT
          </div>
          <span className="flex items-center gap-1.5">
            <span>YayText</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded text-slate-500 bg-slate-100 hidden sm:inline-block">
              Unicode
            </span>
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {lang === 'fr' ? link.labelFr : link.labelEn}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action lockup */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors border border-transparent hover:border-slate-300"
            title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono uppercase">{lang}</span>
          </button>

          {/* Primary Action CTA */}
          <button
            type="button"
            onClick={onOpenCustomDecorator}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-lg transition-all shadow-sm hover:shadow whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>{lang === 'fr' ? 'Encadrer le texte' : 'Custom Decorator'}</span>
          </button>

          {/* Mobile Decorator icon shortcut */}
          <button
            type="button"
            onClick={onOpenCustomDecorator}
            className="sm:hidden p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title={lang === 'fr' ? 'Encadrer le texte' : 'Custom Decorator'}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Appears smoothly when hamburger clicked) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{lang === 'fr' ? link.labelFr : link.labelEn}</span>
              </a>
            );
          })}
          <div className="pt-2 mt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomDecorator();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>{lang === 'fr' ? 'Encadrer le texte' : 'Custom Decorator'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
