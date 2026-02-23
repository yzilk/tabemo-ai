import React from 'react';
import type { Ingredient, NutritionInfo } from '../../types';

interface IngredientsProps { ingredients: Ingredient[] }

export const IngredientsCard: React.FC<IngredientsProps> = ({ ingredients }) => (
  <div className="bg-white border border-[#e8c4a0]/40 rounded-2xl p-5 shadow-sm">
    <div className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase mb-4">食材リスト</div>
    <ul className="flex flex-col gap-2.5">
      {ingredients.map((ing) => (
        <li key={ing.id} className="flex items-center gap-2.5 text-[14px]">
          <span className="min-w-[100px] text-[#2d2016]">
            {ing.name}
            {ing.optional && (
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#f4e8dc] text-[#8a6a50]/70">任意</span>
            )}
          </span>
          <div className="flex-1 h-[3px] bg-[#f4e8dc] rounded overflow-hidden">
            <div
              className="h-full rounded bg-gradient-to-r from-[#f4a56a] to-[#d4845a] transition-all duration-700"
              style={{ width: `${ing.ratio * 100}%` }}
            />
          </div>
          <span className="text-[#d4845a] font-mono text-[13px] min-w-[52px] text-right">{ing.amount}</span>
        </li>
      ))}
    </ul>
  </div>
);

interface NutritionProps { nutrition: NutritionInfo }

export const NutritionCard: React.FC<NutritionProps> = ({ nutrition }) => {
  const rows = [
    { label: 'カロリー', value: nutrition.calories, unit: 'kcal', max: nutrition.calorieMax ?? 800,  color: 'bg-[#f4a56a]' },
    { label: 'たんぱく質', value: nutrition.protein,  unit: 'g',    max: nutrition.proteinMax ?? 50,   color: 'bg-[#7ec98e]' },
    { label: '炭水化物',   value: nutrition.carbs,    unit: 'g',    max: nutrition.carbsMax ?? 60,    color: 'bg-[#7ab0e8]' },
    { label: '脂質',       value: nutrition.fat,      unit: 'g',    max: nutrition.fatMax ?? 50,      color: 'bg-[#e07070]' },
  ];

  return (
    <div className="bg-white border border-[#e8c4a0]/40 rounded-2xl p-5 shadow-sm">
      <div className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase mb-4">栄養バランス（1人前）</div>
      <div className="grid grid-cols-2 gap-3">
        {rows.map((row) => (
          <div key={row.label} className="bg-[#fdf8f3] rounded-xl p-3">
            <div className="text-[11px] text-[#8a6a50]/70 font-mono mb-1">{row.label}</div>
            <div className="text-[20px] font-serif text-[#2d2016] mb-2">
              {row.value}<small className="text-[12px] text-[#8a6a50]/70 ml-0.5">{row.unit}</small>
            </div>
            <div className="h-1 bg-[#f4e8dc] rounded overflow-hidden">
              <div
                className={`h-full rounded transition-all duration-1000 ${row.color}`}
                style={{ width: `${Math.min((row.value / row.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};