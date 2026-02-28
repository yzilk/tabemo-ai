import React from 'react';
import type { RecipeInput, DietStyle, CalorieRange } from '../../types';
import { DIET_STYLE_LABELS, CALORIE_LABELS } from '../../data/mockRecipe';

interface Props {
  input: RecipeInput;
  loading: boolean;
  onInputChange: (patch: Partial<RecipeInput>) => void;
  onGenerate: () => void;
}

const DIET_STYLES: DietStyle[] = ['japanese', 'western', 'chinese', 'healthy', 'hearty', 'diet'];
const CALORIE_RANGES: CalorieRange[] = ['under400', 'under600', 'under800', 'unlimited'];

export const InputPanel: React.FC<Props> = ({ input, loading, onInputChange, onGenerate }) => {
  const toggleDietStyle = (style: DietStyle) => {
    const next = input.dietStyles.includes(style)
      ? input.dietStyles.filter((s) => s !== style)
      : [...input.dietStyles, style];
    onInputChange({ dietStyles: next });
  };

  return (
    <aside className="flex flex-col gap-6 p-6 bg-[#fff9f4] border-b md:border-b-0 md:border-r border-[#e8c4a0]/40 md:h-[calc(100vh-60px)] md:sticky md:top-[60px] md:overflow-y-auto">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#2d2016]">
          今日は何を<br />
          <em className="text-[#d4845a] not-italic">食べたい？</em>
        </h1>
      </div>

      <p className="text-[13px] text-[#8a6a50]/70 leading-relaxed font-mono">
        食材・気分・料理名をなんでも入力。<br />
        AIがレシピを生成します。
      </p>

      {/* Query */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase">食材・料理名・気分</label>
        <textarea
          className="bg-[#fdf3eb] border border-[#e8c4a0]/60 rounded-xl text-[#2d2016] font-serif text-[14px] p-3 resize-none outline-none leading-relaxed focus:border-[#d4845a]/60 transition-colors placeholder:text-[#8a6a50]/40"
          placeholder="例：鶏もも肉とトマトが余ってる。サクッと作れる夕食を"
          value={input.query}
          onChange={(e) => onInputChange({ query: e.target.value })}
          rows={3}
        />
      </div>

      {/* Diet style */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase">食事スタイル</label>
        <div className="flex flex-wrap gap-2">
          {DIET_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => toggleDietStyle(style)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-mono border transition-all ${input.dietStyles.includes(style)
                  ? 'bg-[#f4a56a]/20 border-[#d4845a] text-[#d4845a]'
                  : 'border-[#e8c4a0]/60 text-[#8a6a50]/70 hover:border-[#d4845a] hover:text-[#d4845a]'
                }`}
            >
              {DIET_STYLE_LABELS[style]}
            </button>
          ))}
        </div>
      </div>

      {/* Servings + Time */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase">人数 / 調理時間</label>
        <div className="flex flex-col gap-3">
          {[
            { label: '人数', min: 1, max: 6, step: 1, value: input.servings, unit: '人', key: 'servings' as const },
            { label: '時間', min: 10, max: 90, step: 5, value: input.maxMinutes, unit: '分', key: 'maxMinutes' as const },
          ].map(({ label, min, max, step, value, unit, key }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-[12px] text-[#8a6a50]/70 font-mono w-8">{label}</span>
              <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => onInputChange({ [key]: Number(e.target.value) })}
                className="flex-1 h-[3px] accent-[#d4845a] bg-[#e8c4a0]/30 rounded cursor-pointer"
              />
              <span className="text-[12px] text-[#d4845a] font-mono w-10 text-right">{value}{unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calorie */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase">カロリー目安</label>
        <div className="flex flex-wrap gap-2">
          {CALORIE_RANGES.map((cal) => (
            <button
              key={cal}
              onClick={() => onInputChange({ calorieRange: cal })}
              className={`px-3 py-1.5 rounded-full text-[12px] font-mono border transition-all ${input.calorieRange === cal
                  ? 'bg-[#f4a56a]/20 border-[#d4845a] text-[#d4845a]'
                  : 'border-[#e8c4a0]/60 text-[#8a6a50]/70 hover:border-[#d4845a] hover:text-[#d4845a]'
                }`}
            >
              {CALORIE_LABELS[cal]}
            </button>
          ))}
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={loading}
        className="mt-auto py-3.5 rounded-xl bg-gradient-to-br from-[#f4a56a] to-[#d4845a] text-white font-serif text-[17px] tracking-wider shadow-md shadow-[#d4845a]/20 transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed sticky bottom-4"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            生成中…
          </span>
        ) : '✦ レシピを生成する'}
      </button>
    </aside>
  );
};