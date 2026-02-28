import { useRecipe } from './hooks/useRecipe';
import { Header } from './components/layout/Header';
import { InputPanel } from './components/input/InputPanel';
import { ResultPanel } from './components/recipe/ResultPanel';
import { EmptyState, LoadingState, ErrorState } from './components/ui/States';

export default function App() {
  const {
    state, setInput, generate, adjust, adjustByIngredients, adjustStepAction,
    deleteIngredient, replaceIngredient, suggestAlternatives,
    saveRecipe,
  } = useRecipe();

  const { input, recipe, status, error, stepAdjustments, savedRecipes, ingredientSuggestions, ingredientEdited } = state;
  const savedIds = savedRecipes.map((r) => r.id);

  const renderResult = () => {
    if (status === 'loading' && !recipe) return <LoadingState />;
    if (status === 'error' && error) return <ErrorState message={error} onRetry={generate} />;
    if (recipe) {
      return (
        <ResultPanel
          recipe={recipe}
          loading={status === 'loading'}
          savedIds={savedIds}
          stepAdjustments={stepAdjustments}
          ingredientSuggestions={ingredientSuggestions}
          ingredientEdited={ingredientEdited}
          onAdjust={adjust}
          onSave={saveRecipe}
          onAdjustStep={adjustStepAction}
          onDeleteIngredient={deleteIngredient}
          onSuggestIngredient={suggestAlternatives}
          onReplaceIngredient={replaceIngredient}
          onApplyIngredients={adjustByIngredients}
        />
      );
    }
    return <EmptyState />;
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] text-[#2d2016]">
      <Header savedCount={savedRecipes.length} />
      <main className="flex flex-col md:grid md:grid-cols-[400px_1fr] min-h-[calc(100vh-60px)]">
        <InputPanel
          input={input}
          loading={status === 'loading'}
          onInputChange={setInput}
          onGenerate={generate}
        />
        <div className="flex flex-col">
          {renderResult()}
        </div>
      </main>
    </div>
  );
}