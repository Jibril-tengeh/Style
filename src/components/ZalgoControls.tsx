import React from 'react';
import { Skull, Sliders, RefreshCw } from 'lucide-react';
import { ZalgoOptions } from '../types';

interface ZalgoControlsProps {
  options: ZalgoOptions;
  setOptions: React.Dispatch<React.SetStateAction<ZalgoOptions>>;
  onReroll: () => void;
  lang: 'fr' | 'en';
}

export const ZalgoControls: React.FC<ZalgoControlsProps> = ({
  options,
  setOptions,
  onReroll,
  lang,
}) => {
  return (
    <div
      id="zalgo"
      className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Skull className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{lang === 'fr' ? 'Studio Glitch & Zalgo' : 'Glitch & Zalgo Studio'}</span>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                HE COMES
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'fr'
                ? 'Ajustez la direction et le niveau de folie des diacritiques empilés'
                : 'Fine-tune diacritic overflow direction and glitch chaos level'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReroll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{lang === 'fr' ? 'Régénérer le bruit' : 'Re-roll Glitch'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
        {/* Intensity Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'fr' ? 'Intensité du chaos :' : 'Chaos intensity:'}
            </span>
            <span className="font-mono font-bold text-indigo-400 tabular-nums">
              {options.intensity} / 15
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            value={options.intensity}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, intensity: Number(e.target.value) }))
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{lang === 'fr' ? 'Subtil' : 'Subtle'}</span>
            <span>{lang === 'fr' ? 'Modéré' : 'Moderate'}</span>
            <span>{lang === 'fr' ? 'Apocalyptique' : 'Extreme Chaos'}</span>
          </div>
        </div>

        {/* Direction Checkboxes */}
        <div className="space-y-2">
          <span className="text-xs text-slate-300 font-medium block">
            {lang === 'fr' ? 'Zones de distorsion :' : 'Distortion zones:'}
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.up}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, up: e.target.checked }))
                }
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
              />
              <span>{lang === 'fr' ? 'Vers le haut (↑)' : 'Upward (↑)'}</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.mid}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, mid: e.target.checked }))
                }
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
              />
              <span>{lang === 'fr' ? 'Au milieu (↔)' : 'Middle (↔)'}</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.down}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, down: e.target.checked }))
                }
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
              />
              <span>{lang === 'fr' ? 'Vers le bas (↓)' : 'Downward (↓)'}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
