import React from 'react';
import type { Recipe, AdjustmentType } from '../../types';
import { DIFFICULTY_LABELS } from '../../data/mockRecipe';

interface Props {
  recipe: Recipe;
  loading: boolean;
  isSaved: boolean;
  onAdjust: (type: AdjustmentType) => void;
  onSave: () => void;
}

const COST_MARKS = ['¥', '¥¥', '¥¥¥'];

const QUICK_ADJUSTMENTS: { type: AdjustmentType; label: string }[] = [
  { type: 'simpler',   label: '⚡ もっと簡単に' },
  { type: 'healthier', label: '🥗 もっとヘルシーに' },
  { type: 'heartier',  label: '🍖 がっつりに' },
  { type: 'faster',    label: '⏩ 時短バージョン' },
];

export const RecipeHero: React.FC<Props> = ({ recipe, loading, isSaved, onAdjust, onSave }) => (
  <div className="flex flex-col gap-3">
    <div className="relative rounded-2xl overflow-hidden h-[280px] flex items-end shadow-lg shadow-[#d4845a]/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fde8d0] via-[#fad4b0] to-[#f4b488] flex items-center justify-center">
        <span className="text-[96px] drop-shadow-lg">{recipe.emoji}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2d2016]/70 to-transparent" />

      <div className="relative p-7 w-full">
        <div className="font-serif text-[34px] leading-tight mb-1.5 text-white">{recipe.name}</div>
        <p className="text-[13px] text-white/70 mb-2.5">{recipe.description}</p>
        <div className="flex gap-4 flex-wrap text-[12px] text-white/70 font-mono">
          <span>⏱ {recipe.totalMinutes}分</span>
          <span>👥 {recipe.servings}人前</span>
          <span>🔥 {recipe.nutrition.calories} kcal</span>
          <span>⭐ {DIFFICULTY_LABELS[recipe.difficulty]}</span>
          <span>{COST_MARKS[recipe.costLevel - 1]}</span>
        </div>
      </div>

      <button
        onClick={onSave}
        className={`absolute top-4 right-4 w-9 h-9 rounded-full border backdrop-blur-sm flex items-center justify-center text-[18px] transition-all ${
          isSaved
            ? 'bg-[#f4a56a]/30 border-[#f4a56a] text-[#f4a56a]'
            : 'bg-white/20 border-white/30 text-white/70 hover:border-[#f4a56a] hover:text-[#f4a56a]'
        }`}
      >
        {isSaved ? '♥' : '♡'}
      </button>
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