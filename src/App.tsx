import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TextControlBar } from './components/TextControlBar';
import { CategoryFilter } from './components/CategoryFilter';
import { StyleCard } from './components/StyleCard';
import { ZalgoControls } from './components/ZalgoControls';
import { SocialPreviewModal } from './components/SocialPreviewModal';
import { CustomDecoratorModal } from './components/CustomDecoratorModal';
import { SymbolsAndKaomojiSection } from './components/SymbolsAndKaomojiSection';
import { UsageGuide } from './components/UsageGuide';
import { Footer } from './components/Footer';
import { CategoryId, ZalgoOptions, TextStats, AccentMode } from './types';
import { ALL_TEXT_STYLES } from './utils/textTransformers';
import { Sparkles, Star } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'yaytext_user_favorites';

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [inputText, setInputText] = useState('L’été à la plage avec un bon café ✨');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [accentMode, setAccentMode] = useState<AccentMode>('preserve');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['sans_bold', 'script_bold', 'strike_single', 'bubble_white', 'wings_angel'];
    } catch {
      return ['sans_bold', 'script_bold', 'strike_single', 'bubble_white', 'wings_angel'];
    }
  });

  // Save favorites changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignored
    }
  }, [favorites]);

  const toggleFavorite = useCallback((styleId: string) => {
    setFavorites((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    );
  }, []);

  // Zalgo Glitch controls state
  const [zalgoOptions, setZalgoOptions] = useState<ZalgoOptions>({
    up: true,
    mid: true,
    down: true,
    intensity: 5,
  });

  // Re-roll trigger for zalgo randomness
  const [, setZalgoReroll] = useState(0);
  const handleRerollZalgo = () => {
    setZalgoReroll((prev) => prev + 1);
  };

  // Social Preview Modal State
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    styleName: string;
    transformedText: string;
  }>({
    isOpen: false,
    styleName: '',
    transformedText: '',
  });

  // Custom Decorator Modal State
  const [customDecoratorOpen, setCustomDecoratorOpen] = useState(false);

  // Calculate live text statistics
  const stats: TextStats = useMemo(() => {
    // Unicode-aware character count using Array.from
    const chars = Array.from(inputText).length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const bytes = new TextEncoder().encode(inputText).length;
    const twitterRemaining = 280 - chars;
    return {
      characters: chars,
      words,
      bytes,
      twitterRemaining,
    };
  }, [inputText]);

  // Filter styles
  const filteredStyles = useMemo(() => {
    return ALL_TEXT_STYLES.filter((style) => {
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(style.id)) {
        return false;
      }

      // Category filter
      if (!showOnlyFavorites && selectedCategory !== 'all') {
        if (selectedCategory === 'popular') {
          if (!style.popular) return false;
        } else if (style.category !== selectedCategory) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = style.name.toLowerCase().includes(q);
        const matchNameFr = style.nameFr.toLowerCase().includes(q);
        const matchDesc = style.description.toLowerCase().includes(q);
        const matchDescFr = style.descriptionFr.toLowerCase().includes(q);
        const matchId = style.id.toLowerCase().includes(q);
        if (!matchName && !matchNameFr && !matchDesc && !matchDescFr && !matchId) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Put favorited items first if not already viewing only favorites
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, showOnlyFavorites, favorites]);

  // Insert helper from kaomoji/symbol section
  const handleInsertToInput = useCallback((str: string) => {
    setInputText((prev) => (prev ? `${prev} ${str}` : str));
  }, []);

  return (
    <div className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Strict Top Bar */}
      <Header
        lang={lang}
        setLang={setLang}
        onOpenCustomDecorator={() => setCustomDecoratorOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
            {lang === 'fr'
              ? 'Générateur de Styles & Polices de Texte'
              : 'Unicode Text & Font Generator'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance">
            {lang === 'fr'
              ? 'Convertissez instantanément vos textes en gras, italique, barré, bulles, zalgo et cursif pour Instagram, Twitter, TikTok et WhatsApp.'
              : 'Instantly convert your text into bold, italic, strikethrough, bubbles, zalgo, and script for Instagram, Twitter, TikTok, and WhatsApp.'}
          </p>
        </div>

        {/* Primary Text Input Bar & Live Stats */}
        <TextControlBar
          inputText={inputText}
          setInputText={setInputText}
          prefix={prefix}
          setPrefix={setPrefix}
          suffix={suffix}
          setSuffix={setSuffix}
          accentMode={accentMode}
          setAccentMode={setAccentMode}
          stats={stats}
          lang={lang}
        />

        {/* Category Filters, Search & Favorites */}
        <div id="styles" className="scroll-mt-20">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={setShowOnlyFavorites}
            favoritesCount={favorites.length}
            totalVisibleCount={filteredStyles.length}
            lang={lang}
          />
        </div>

        {/* Font Cards Grid */}
        {filteredStyles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStyles.map((style) => (
              <StyleCard
                key={style.id}
                styleDef={style}
                inputText={inputText}
                prefix={prefix}
                suffix={suffix}
                zalgoOptions={zalgoOptions}
                accentMode={accentMode}
                isFavorite={favorites.includes(style.id)}
                onToggleFavorite={toggleFavorite}
                onOpenSocialPreview={(name, txt) =>
                  setPreviewState({
                    isOpen: true,
                    styleName: name,
                    transformedText: txt,
                  })
                }
                lang={lang}
              />
            ))}
          </div>
        ) : (
          /* Empty State when search or favorites have 0 items */
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              {showOnlyFavorites ? <Star className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {showOnlyFavorites
                ? lang === 'fr'
                  ? 'Aucun favori pour le moment'
                  : 'No favorites yet'
                : lang === 'fr'
                ? 'Aucun style trouvé'
                : 'No matching styles'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {showOnlyFavorites
                ? lang === 'fr'
                  ? 'Cliquez sur l’étoile d’un style pour l’ajouter à vos favoris et y accéder rapidement.'
                  : 'Click the star icon on any font card to pin it to your favorites.'
                : lang === 'fr'
                ? 'Essayez avec un autre mot-clé comme "gras", "barré", "gothique" ou "bulles".'
                : 'Try searching with another keyword like "bold", "strike", "gothic", or "bubbles".'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setShowOnlyFavorites(false);
                setSelectedCategory('all');
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              {lang === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
            </button>
          </div>
        )}

        {/* Dedicated Zalgo Glitch Controls Section */}
        <ZalgoControls
          options={zalgoOptions}
          setOptions={setZalgoOptions}
          onReroll={handleRerollZalgo}
          lang={lang}
        />

        {/* Kaomoji & Unicode Symbols Section */}
        <SymbolsAndKaomojiSection
          onInsertToInput={handleInsertToInput}
          lang={lang}
        />

        {/* Usage Guide & FAQ Section */}
        <UsageGuide lang={lang} />
      </main>

      {/* Social Media Preview Modal */}
      <SocialPreviewModal
        isOpen={previewState.isOpen}
        onClose={() => setPreviewState((prev) => ({ ...prev, isOpen: false }))}
        styleName={previewState.styleName}
        transformedText={previewState.transformedText}
        lang={lang}
      />

      {/* Custom Decorator Modal */}
      <CustomDecoratorModal
        isOpen={customDecoratorOpen}
        onClose={() => setCustomDecoratorOpen(false)}
        inputText={inputText}
        lang={lang}
      />

      {/* Quiet, unpretentious Footer */}
      <Footer lang={lang} />
    </div>
  );
}
