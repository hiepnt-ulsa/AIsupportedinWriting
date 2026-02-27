import React from 'react';
import { HEADSHOT_STYLES, HeadshotStyle } from '../services/gemini';
import { Check } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onStyleSelect: (style: HeadshotStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onStyleSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {HEADSHOT_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleSelect(style)}
          className={`
            relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all
            ${selectedStyleId === style.id 
              ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' 
              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
            }
          `}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className={`w-8 h-8 rounded-lg ${style.previewColor} border border-black/5`} />
            {selectedStyleId === style.id && (
              <div className="bg-indigo-600 rounded-full p-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-sm">{style.name}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {style.description}
          </p>
        </button>
      ))}
    </div>
  );
};
