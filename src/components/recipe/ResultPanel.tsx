import React, { useState } from 'react';
import type { Recipe, StepAdjustment, AdjustmentType } from '../../types';
import { RecipeHero } from './RecipeHero';
import { IngredientsCard, NutritionCard } from './RecipeCards';
import { StepList } from './StepList';
import { CookingMode } from './CookingMode';

interface Props {
  recipe: Recipe;
  loading: boolean;
  savedIds: string[];
  stepAdjustments: Record<string, StepAdjustment>;
  onAdjust: (type: AdjustmentType) => void;
  onSave: () => void;
  onAdjustStep: (stepId: string, type: 'detail' | 'simple') => void;
}

export const ResultPanel: React.FC<Props> = ({
  recipe, loading, savedIds, stepAdjustments, onAdjust, onSave, onAdjustStep,
}) => {
  const [cookingMode, setCookingMode] = useState(false);

  return (
    <>
      {cookingMode && (
        <CookingMode
          steps={recipe.steps}
          recipeName={recipe.name}
          onClose={() => setCookingMode(false)}
        />
      )}

      <div className="flex flex-col gap-7 p-10 animate-fade-up">
        <RecipeHero
          recipe={recipe}
          loading={loading}
          isSaved={savedIds.includes(recipe.id)}
          onAdjust={onAdjust}
          onSave={onSave}
          onStartCooking={() => setCookingMode(true)}
        />

        <div className="grid grid-cols-2 gap-5">
          <IngredientsCard ingredients={recipe.ingredients} />
          <NutritionCard nutrition={recipe.nutrition} />
        </div>

        <StepList
          steps={recipe.steps}
          adjustments={stepAdjustments}
          onAdjustStep={onAdjustStep}
        />

        <div className="flex gap-3.5 items-start bg-gradient-to-br from-[#fdf3eb] to-[#fde8d0] border border-[#e8c4a0]/40 rounded-2xl p-5 shadow-sm">
          <span className="text-[18px] pt-0.5">✦</span>
          <div className="text-[13px] leading-relaxed text-[#5a3e2b]/80">
            <strong className="text-[#d4845a] block mb-1">AIのひとこと</strong>
            {recipe.aiComment}
          </div>
        </div>
      </div>
    </>
  );
};