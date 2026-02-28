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
  ingredientSuggestions: Record<string, string[]>;
  ingredientEdited: boolean;
  onAdjust: (type: AdjustmentType) => void;
  onSave: () => void;
  onAdjustStep: (stepId: string, type: 'detail' | 'simple') => void;
  onDeleteIngredient: (id: string) => void;
  onSuggestIngredient: (id: string, name: string) => void;
  onReplaceIngredient: (id: string, newName: string, newAmount: string) => void;
  onApplyIngredients: () => void;
}

export const ResultPanel: React.FC<Props> = ({
  recipe, loading, savedIds, stepAdjustments, ingredientSuggestions, ingredientEdited,
  onAdjust, onSave, onAdjustStep,
  onDeleteIngredient, onSuggestIngredient, onReplaceIngredient, onApplyIngredients,
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

      <div className="flex flex-col gap-7 p-6 md:p-10 animate-fade-up">
        <RecipeHero
          recipe={recipe}
          loading={loading}
          isSaved={savedIds.includes(recipe.id)}
          onAdjust={onAdjust}
          onSave={onSave}
          onStartCooking={() => setCookingMode(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <IngredientsCard
            ingredients={recipe.ingredients}
            suggestions={ingredientSuggestions}
            ingredientEdited={ingredientEdited}
            onDelete={onDeleteIngredient}
            onSuggest={onSuggestIngredient}
            onReplace={onReplaceIngredient}
            onApplyIngredients={onApplyIngredients}
          />
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