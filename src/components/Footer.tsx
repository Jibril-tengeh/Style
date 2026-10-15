import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  lang: 'fr' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">YayText</span>
          <span>·</span>
          <span>
            {lang === 'fr'
              ? 'Générateur de polices et styles de texte Unicode pour réseaux sociaux'
              : 'Unicode text font generator for social media and profiles'}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#styles" className="hover:text-slate-900 transition-colors">
            {lang === 'fr' ? 'Polices' : 'Fonts'}
          </a>
          <a href="#zalgo" className="hover:text-slate-900 transition-colors">
            Zalgo
          </a>
          <a href="#symbols" className="hover:text-slate-900 transition-colors">
            {lang === 'fr' ? 'Symboles' : 'Symbols'}
          </a>
          <a href="#guide" className="hover:text-slate-900 transition-colors">
            FAQ
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Haut de page' : 'Back to top'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
