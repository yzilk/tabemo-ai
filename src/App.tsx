import { useRecipe } from './hooks/useRecipe';
import { Header } from './components/layout/Header';
import { InputPanel } from './components/input/InputPanel';
import { ResultPanel } from './components/recipe/ResultPanel';
import { EmptyState, LoadingState, ErrorState } from './components/ui/States';

export default function App() {
  const { state, setInput, generate, adjust, adjustStepAction, saveRecipe } = useRecipe();
  const { input, recipe, status, error, stepAdjustments, savedRecipes } = state;
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
          onAdjust={adjust}
          onSave={saveRecipe}
          onAdjustStep={adjustStepAction}
        />
      );
    }
    return <EmptyState />;
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] text-[#2d2016]">
      <Header savedCount={savedRecipes.length} />
      <main className="grid grid-cols-[400px_1fr] min-h-[calc(100vh-60px)]">
        <InputPanel
          input={input}
          loading={status === 'loading'}
          onInputChange={setInput}
          onGenerate={generate}
        />
        <div className="flex flex-col overflow-y-auto">
          {renderResult()}
        </div>
      </main>
    </div>
  );
}