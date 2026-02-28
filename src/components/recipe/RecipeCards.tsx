import React from 'react';
import type { Ingredient, NutritionInfo } from '../../types';

interface IngredientsProps {
  ingredients: Ingredient[];
  suggestions: Record<string, string[]>;
  ingredientEdited: boolean;
  onDelete: (id: string) => void;
  onSuggest: (id: string, name: string) => void;
  onReplace: (id: string, newName: string, newAmount: string) => void;
  onApplyIngredients: () => void;
}

export const IngredientsCard: React.FC<IngredientsProps> = ({
  ingredients, suggestions, ingredientEdited,
  onDelete, onSuggest, onReplace, onApplyIngredients,
}) => (
  <div className="bg-white border border-[#e8c4a0]/40 rounded-2xl p-5 shadow-sm">
    <div className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase mb-1">食材リスト</div>
    <p className="text-[11px] text-[#8a6a50]/50 font-mono leading-relaxed mb-4">
      ない食材は × で削除、食材名タップで代替提案ができます
    </p>
    <ul className="flex flex-col gap-2">
      {ingredients.map((ing) => (
        <li key={ing.id} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[14px]">
            <button
              onClick={() => onSuggest(ing.id, ing.name)}
              className="min-w-[100px] text-left text-[#2d2016] hover:text-[#d4845a] transition-colors"
            >
              {ing.name}
              {ing.optional && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#f4e8dc] text-[#8a6a50]/70">任意</span>
              )}
            </button>
            <div className="flex-1 h-[4px] bg-[#f4e8dc] rounded overflow-hidden">
              <div
                className="h-full rounded bg-gradient-to-r from-[#f4a56a] to-[#d4845a] transition-all duration-700"
                style={{ width: `${ing.ratio * 100}%` }}
              />
            </div>
            <span className="text-[#d4845a] font-mono text-[13px] min-w-[52px] text-right">{ing.amount}</span>
            <button
              onClick={() => onDelete(ing.id)}
              className="text-[#8a6a50]/30 hover:text-[#e07070] transition-colors text-[16px] ml-1 leading-none"
            >
              ×
            </button>
          </div>

          {suggestions[ing.id] && (
            <div className="flex flex-wrap gap-1.5 pl-2 animate-fade-up">
              <span className="text-[10px] font-mono text-[#8a6a50]/50 self-center">代替：</span>
              {suggestions[ing.id].map((alt) => (
                <button
                  key={alt}
                  onClick={() => onReplace(ing.id, alt, ing.amount)}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#fdf3eb] border border-[#e8c4a0]/60 text-[#d4845a] hover:bg-[#f4a56a]/20 transition-all"
                >
                  {alt}
                </button>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>

    {/* 決定ボタン */}
    {ingredientEdited && (
      <div className="mt-5 pt-4 border-t border-[#e8c4a0]/40 animate-fade-up">
        <p className="text-[11px] text-[#8a6a50]/60 font-mono mb-3">
          食材の変更を反映してレシピを更新します
        </p>
        <button
          onClick={onApplyIngredients}
          className="w-full py-3 rounded-xl bg-gradient-to-br from-[#f4a56a] to-[#d4845a] text-white font-serif text-[15px] tracking-wider shadow-sm shadow-[#d4845a]/20 hover:opacity-90 transition-all"
        >
          ✦ この食材でレシピを更新する
        </button>
      </div>
    )}
  </div>
);

interface NutritionProps { nutrition: NutritionInfo }

export const NutritionCard: React.FC<NutritionProps> = ({ nutrition }) => {
  const rows = [
    { label: 'カロリー',   value: nutrition.calories, unit: 'kcal', max: nutrition.calorieMax ?? 800, color: 'bg-[#f4a56a]' },
    { label: 'たんぱく質', value: nutrition.protein,  unit: 'g',    max: nutrition.proteinMax ?? 50,  color: 'bg-[#7ec98e]' },
    { label: '炭水化物',   value: nutrition.carbs,    unit: 'g',    max: nutrition.carbsMax ?? 60,    color: 'bg-[#7ab0e8]' },
    { label: '脂質',       value: nutrition.fat,      unit: 'g',    max: nutrition.fatMax ?? 50,      color: 'bg-[#e07070]' },
  ];

  return (
    <div className="bg-white border border-[#e8c4a0]/40 rounded-2xl p-5 shadow-sm col-span-2">
      <div className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase mb-5">栄養バランス（1人前）</div>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4">
            <div className="w-20 text-[13px] text-[#5a3e2b]/80 font-mono">{row.label}</div>
            <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#f4e8dc]">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${row.color}`}
                style={{ width: `${Math.min((row.value / row.max) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[15px] font-serif text-[#2d2016] min-w-[72px] text-right">
              {row.value}<small className="text-[11px] text-[#8a6a50]/70 ml-0.5">{row.unit}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};