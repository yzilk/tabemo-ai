/**
 * recipeService.ts
 *
 * 現在はモックデータを返す。
 * Gemini API 統合時は generateRecipe / adjustStep の実装を差し替えるだけでOK。
 *
 * Gemini 実装例（コメントアウト）:
 *   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
 *   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
 */

import type { Recipe, RecipeInput, AdjustmentType, RecipeStep } from '../types';
import { MOCK_RECIPE, STEP_ADJUST_MOCK } from '../data/mockRecipe';

const MOCK_DELAY = 1800; // ms — ローディングUXを体感できるよう意図的に遅延

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ──────────────────────────────────────────────
// レシピ生成
// ──────────────────────────────────────────────

export async function generateRecipe(_input: RecipeInput): Promise<Recipe> {
  await sleep(MOCK_DELAY);

  // TODO: Gemini API 実装
  // const prompt = buildRecipePrompt(input);
  // const result = await model.generateContent(prompt);
  // return parseRecipeResponse(result.response.text());

  return {
    ...MOCK_RECIPE,
    id: `recipe-${Date.now()}`,
    createdAt: new Date(),
  };
}

// ──────────────────────────────────────────────
// レシピ全体調整（ワンクリック）
// ──────────────────────────────────────────────

export async function adjustRecipe(
  _recipe: Recipe,
  _type: AdjustmentType,
): Promise<Recipe> {
  await sleep(MOCK_DELAY);

  // TODO: Gemini API 実装
  // const prompt = buildAdjustPrompt(recipe, type);
  // const result = await model.generateContent(prompt);
  // return parseRecipeResponse(result.response.text());

  return {
    ...MOCK_RECIPE,
    id: `recipe-${Date.now()}`,
    createdAt: new Date(),
  };
}

// ──────────────────────────────────────────────
// ステップ単位の調整
// ──────────────────────────────────────────────

export async function adjustStep(
  step: RecipeStep,
  type: 'detail' | 'simple',
): Promise<string> {
  await sleep(1000);

  // TODO: Gemini API 実装
  // const prompt = type === 'detail'
  //   ? `次の調理手順をより詳しく説明してください: ${step.description}`
  //   : `次の調理手順を初心者向けに簡単にしてください: ${step.description}`;
  // const result = await model.generateContent(prompt);
  // return result.response.text();

  return type === 'detail'
    ? STEP_ADJUST_MOCK.moreDetail
    : STEP_ADJUST_MOCK.simpler;
}
