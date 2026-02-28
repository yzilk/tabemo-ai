import type { Recipe, RecipeInput, AdjustmentType, RecipeStep } from '../types';
import { MOCK_RECIPE, STEP_ADJUST_MOCK } from '../data/mockRecipe';
import { api } from './api';

const USE_MOCK = true; // Gemini実装後に false に切り替える
const MOCK_DELAY = 1800;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Generate ─────────────────────────────────
export async function generateRecipe(input: RecipeInput): Promise<Recipe> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY);
    return { ...MOCK_RECIPE, id: `recipe-${Date.now()}`, createdAt: new Date() };
  }
  return api.post<Recipe>('/recipe/generate', { input });
}

// ── Adjust（ワンクリック） ────────────────────
export async function adjustRecipe(recipe: Recipe, type: AdjustmentType): Promise<Recipe> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY);
    return { ...MOCK_RECIPE, id: `recipe-${Date.now()}`, createdAt: new Date() };
  }
  return api.post<Recipe>('/recipe/adjust', { recipe, type });
}

// ── Adjust by ingredients（食材変更） ─────────
// Geminiプロンプト方針:
// 「食材リストが変更されました。手順と栄養情報を最小限の変更で更新してください。レシピの全体的なコンセプトは維持してください。」
export async function adjustRecipeByIngredients(recipe: Recipe): Promise<Recipe> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY);
    return {
      ...recipe,
      id: `recipe-${Date.now()}`,
      createdAt: new Date(),
      aiComment: '食材の変更を反映してレシピを微調整しました。手順はほぼそのままで、食材に合わせた細かい調整を加えています。',
    };
  }
  return api.post<Recipe>('/recipe/adjust-ingredients', { recipe });
}

// ── Step adjust ──────────────────────────────
export async function adjustStep(step: RecipeStep, type: 'detail' | 'simple'): Promise<string> {
  if (USE_MOCK) {
    await sleep(1000);
    return type === 'detail' ? STEP_ADJUST_MOCK.moreDetail : STEP_ADJUST_MOCK.simpler;
  }
  const res = await api.post<{ content: string }>('/recipe/adjust-step', { step, type });
  return res.content;
}

// ── Ingredient alternatives ──────────────────
export async function suggestIngredientAlternatives(ingredientName: string): Promise<string[]> {
  if (USE_MOCK) {
    await sleep(800);
    const mockSuggestions: Record<string, string[]> = {
      '鶏もも肉': ['鶏むね肉', '豚こま肉', '豆腐'],
      'トマト（中）': ['トマト缶', 'ミニトマト', 'パプリカ'],
      'にんにく': ['にんにくチューブ', '玉ねぎ', 'しょうが'],
      'バジル': ['パセリ', '大葉', 'オレガノ'],
      'オリーブオイル': ['サラダ油', 'ごま油', 'バター'],
    };
    return mockSuggestions[ingredientName] ?? ['代替食材A', '代替食材B', '代替食材C'];
  }
  const res = await api.post<{ suggestions: string[] }>('/recipe/suggest-ingredients', { ingredientName });
  return res.suggestions;
}