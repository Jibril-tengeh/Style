import React from 'react';
import { Search, Star, X } from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../utils/textTransformers';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (val: boolean) => void;
  favoritesCount: number;
  totalVisibleCount: number;
  lang: 'fr' | 'en';
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  showOnlyFavorites,
  setShowOnlyFavorites,
  favoritesCount,
  totalVisibleCount,
  lang,
}) => {
  return (
    <div className="space-y-3">
      {/* Search and Favorites Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'fr'
                ? 'Rechercher un style (ex: gras, gothique, barré, bulles, zalgo)...'
                : 'Search style (e.g. bold, gothic, strike, bubbles, zalgo)...'
            }
            className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Favorites and results count */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors border ${
              showOnlyFavorites
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                showOnlyFavorites ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
              }`}
            />
            <span>{lang === 'fr' ? 'Favoris' : 'Favorites'}</span>
            <span className="font-mono tabular-nums text-slate-500">
              ({favoritesCount})
            </span>
          </button>

          <span className="text-xs text-slate-500 hidden sm:inline">
            <span className="font-semibold text-slate-700 font-mono tabular-nums">
              {totalVisibleCount}
            </span>{' '}
            {lang === 'fr' ? 'styles' : 'styles'}
          </span>
        </div>
      </div>

      {/* Segmented Category Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id && !showOnlyFavorites;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setShowOnlyFavorites(false);
                setSelectedCategory(cat.id);
              }}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lang === 'fr' ? cat.labelFr : cat.labelEn}
            </button>
          );
        })}
      </div>
    </div>
  );
};
