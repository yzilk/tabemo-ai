import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import type { Recipe, AdjustmentType } from '../../types';
import { DIFFICULTY_LABELS } from '../../data/mockRecipe';

interface Props {
  recipe: Recipe;
  loading: boolean;
  isSaved: boolean;
  onAdjust: (type: AdjustmentType) => void;
  onSave: () => void;
  onStartCooking: () => void;
}

const COST_MARKS = ['¥', '¥¥', '¥¥¥'];

const QUICK_ADJUSTMENTS: { type: AdjustmentType; label: string }[] = [
  { type: 'simpler',   label: '⚡ もっと簡単に' },
  { type: 'healthier', label: '🥗 もっとヘルシーに' },
  { type: 'heartier',  label: '🍖 がっつりに' },
  { type: 'faster',    label: '⏩ 時短バージョン' },
];

export const RecipeHero: React.FC<Props> = ({ recipe, loading, isSaved, onAdjust, onSave, onStartCooking }) => (
  <div className="flex flex-col gap-3">
    <div className="relative bg-gradient-to-br from-[#fdf3eb] to-[#fde8d0] border border-[#e8c4a0]/40 rounded-2xl p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#8a6a50]/70 bg-white/60 px-2.5 py-1 rounded-full border border-[#e8c4a0]/40">
              AIレシピ
            </span>
            <span className="text-[11px] font-mono text-[#8a6a50]/70">{DIFFICULTY_LABELS[recipe.difficulty]}</span>
          </div>
          <h2 className="font-serif text-[36px] leading-tight text-[#2d2016] mb-2">{recipe.name}</h2>
          <p className="text-[14px] text-[#5a3e2b]/70 leading-relaxed mb-5">{recipe.description}</p>

          <div className="flex gap-3 flex-wrap">
            {[
              { icon: '⏱', label: '調理時間', value: `${recipe.totalMinutes}分` },
              { icon: '👥', label: '人数', value: `${recipe.servings}人前` },
              { icon: '🔥', label: 'カロリー', value: `${recipe.nutrition.calories} kcal` },
              { icon: '💰', label: 'コスト', value: COST_MARKS[recipe.costLevel - 1] },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-white/60 rounded-xl px-3 py-2 border border-[#e8c4a0]/30">
                <div className="text-[10px] font-mono text-[#8a6a50]/60 mb-0.5">{icon} {label}</div>
                <div className="text-[14px] font-serif text-[#2d2016]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {/* Cooking mode button */}
          <button
            onClick={onStartCooking}
            title="料理モードで開く"
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all bg-gradient-to-br from-[#f4a56a] to-[#d4845a] border-[#d4845a] text-white shadow-sm shadow-[#d4845a]/30 hover:opacity-90"
          >
            <FontAwesomeIcon icon={faUtensils} className="text-[14px]" />
          </button>

          {/* Save button */}
          <button
            onClick={onSave}
            className={`w-10 h-10 rounded-full border flex items-center justify-center text-[20px] transition-all ${
              isSaved
                ? 'bg-[#f4a56a]/20 border-[#d4845a] text-[#d4845a]'
                : 'bg-white/60 border-[#e8c4a0]/40 text-[#8a6a50]/50 hover:border-[#d4845a] hover:text-[#d4845a]'
            }`}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>

    {/* Quick adjust */}
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest whitespace-nowrap">ワンクリック調整</span>
      <div className="flex gap-2 flex-wrap">
        {QUICK_ADJUSTMENTS.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => onAdjust(type)}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-full text-[12px] font-mono border border-[#e8c4a0]/60 text-[#8a6a50]/70 hover:border-[#d4845a] hover:text-[#d4845a] hover:bg-[#f4a56a]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  </div>
);