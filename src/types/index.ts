// ──────────────────────────────────────────────
// Domain Types
// ──────────────────────────────────────────────

export type DietStyle = 'japanese' | 'western' | 'chinese' | 'healthy' | 'hearty' | 'diet';
export type CalorieRange = 'under400' | 'under600' | 'under800' | 'unlimited';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type AdjustmentType =
  | 'simpler'
  | 'moreDetail'
  | 'healthier'
  | 'heartier'
  | 'faster'
  | 'alternative';

// ──────────────────────────────────────────────
// Input
// ──────────────────────────────────────────────

export interface RecipeInput {
  query: string;
  dietStyles: DietStyle[];
  servings: number;
  maxMinutes: number;
  calorieRange: CalorieRange;
  skillLevel: SkillLevel;
  excludeIngredients: string[];
}

// ──────────────────────────────────────────────
// Recipe Output
// ──────────────────────────────────────────────

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  ratio: number; // 0–1 for visual bar
  optional?: boolean;
  substitutes?: string[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;   // g
  carbs: number;     // g
  fat: number;       // g
  calorieMax?: number;
  proteinMax?: number;
  carbsMax?: number;
  fatMax?: number;
}

export interface RecipeStep {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  tips?: string;
  // ステップ調整状態
  expanded?: boolean;
  simplifiedVersion?: string;
  detailedVersion?: string;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  servings: number;
  totalMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  dietStyles: DietStyle[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutrition: NutritionInfo;
  aiComment: string;
  costLevel: 1 | 2 | 3;
  imageUrl?: string;
  createdAt: Date;
}

// ──────────────────────────────────────────────
// UI State
// ──────────────────────────────────────────────

export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error';

export interface StepAdjustment {
  stepId: string;
  type: 'detail' | 'simple';
  content: string;
  loading: boolean;
}

export interface RecipeState {
  input: RecipeInput;
  recipe: Recipe | null;
  status: GenerateStatus;
  error: string | null;
  stepAdjustments: Record<string, StepAdjustment>;
  savedRecipes: Recipe[];
  ingredientSuggestions: Record<string, string[]>; // 追加
}

export interface RecipeState {
  input: RecipeInput;
  recipe: Recipe | null;
  status: GenerateStatus;
  error: string | null;
  stepAdjustments: Record<string, StepAdjustment>;
  savedRecipes: Recipe[];
  ingredientSuggestions: Record<string, string[]>;
  ingredientEdited: boolean; // 追加
}