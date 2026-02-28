import { useReducer, useCallback } from 'react';
import type { RecipeState, RecipeInput, AdjustmentType } from '../types';
import { generateRecipe, adjustRecipe, adjustStep, suggestIngredientAlternatives, adjustRecipeByIngredients } from '../services/recipeService';

const DEFAULT_INPUT: RecipeInput = {
  query: '',
  dietStyles: [],
  servings: 1,
  maxMinutes: 10,
  calorieRange: 'under600',
  skillLevel: 'beginner',
  excludeIngredients: [],
};

const initialState: RecipeState = {
  input: DEFAULT_INPUT,
  recipe: null,
  status: 'idle',
  error: null,
  stepAdjustments: {},
  savedRecipes: [],
  ingredientSuggestions: {},
  ingredientEdited: false,
};

type Action =
  | { type: 'SET_INPUT'; payload: Partial<RecipeInput> }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; payload: RecipeState['recipe'] }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'STEP_ADJUST_START'; stepId: string; adjustType: 'detail' | 'simple' }
  | { type: 'STEP_ADJUST_SUCCESS'; stepId: string; adjustType: 'detail' | 'simple'; content: string }
  | { type: 'STEP_ADJUST_CLEAR'; stepId: string }
  | { type: 'INGREDIENT_DELETE'; ingredientId: string }
  | { type: 'INGREDIENT_REPLACE'; ingredientId: string; newName: string; newAmount: string }
  | { type: 'INGREDIENT_SUGGEST_SUCCESS'; ingredientId: string; suggestions: string[] }
  | { type: 'INGREDIENT_SUGGEST_CLEAR'; ingredientId: string }
  | { type: 'INGREDIENT_EDITED_RESET' }
  | { type: 'SAVE_RECIPE' }
  | { type: 'RESET' };

function reducer(state: RecipeState, action: Action): RecipeState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: { ...state.input, ...action.payload } };
    case 'GENERATE_START':
      return { ...state, status: 'loading', error: null, stepAdjustments: {}, ingredientSuggestions: {}, ingredientEdited: false };
    case 'GENERATE_SUCCESS':
      return { ...state, status: 'success', recipe: action.payload };
    case 'GENERATE_ERROR':
      return { ...state, status: 'error', error: action.payload };

    case 'STEP_ADJUST_START':
      return {
        ...state,
        stepAdjustments: {
          ...state.stepAdjustments,
          [action.stepId]: { stepId: action.stepId, type: action.adjustType, content: '', loading: true },
        },
      };
    case 'STEP_ADJUST_SUCCESS':
      return {
        ...state,
        stepAdjustments: {
          ...state.stepAdjustments,
          [action.stepId]: { stepId: action.stepId, type: action.adjustType, content: action.content, loading: false },
        },
      };
    case 'STEP_ADJUST_CLEAR': {
      const next = { ...state.stepAdjustments };
      delete next[action.stepId];
      return { ...state, stepAdjustments: next };
    }

    case 'INGREDIENT_DELETE':
      if (!state.recipe) return state;
      return {
        ...state,
        ingredientEdited: true,
        recipe: {
          ...state.recipe,
          ingredients: state.recipe.ingredients.filter((i) => i.id !== action.ingredientId),
        },
      };

    case 'INGREDIENT_REPLACE':
      if (!state.recipe) return state;
      return {
        ...state,
        ingredientEdited: true,
        recipe: {
          ...state.recipe,
          ingredients: state.recipe.ingredients.map((i) =>
            i.id === action.ingredientId
              ? { ...i, name: action.newName, amount: action.newAmount }
              : i
          ),
        },
        ingredientSuggestions: (() => {
          const next = { ...state.ingredientSuggestions };
          delete next[action.ingredientId];
          return next;
        })(),
      };

    case 'INGREDIENT_SUGGEST_SUCCESS':
      return {
        ...state,
        ingredientSuggestions: {
          ...state.ingredientSuggestions,
          [action.ingredientId]: action.suggestions,
        },
      };

    case 'INGREDIENT_SUGGEST_CLEAR': {
      const next = { ...state.ingredientSuggestions };
      delete next[action.ingredientId];
      return { ...state, ingredientSuggestions: next };
    }

    case 'INGREDIENT_EDITED_RESET':
      return { ...state, ingredientEdited: false };

    case 'SAVE_RECIPE':
      if (!state.recipe) return state;
      return {
        ...state,
        savedRecipes: [state.recipe, ...state.savedRecipes.filter((r) => r.id !== state.recipe!.id)],
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function useRecipe() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInput = useCallback((payload: Partial<RecipeInput>) => {
    dispatch({ type: 'SET_INPUT', payload });
  }, []);

  const generate = useCallback(async () => {
    dispatch({ type: 'GENERATE_START' });
    try {
      const recipe = await generateRecipe(state.input);
      dispatch({ type: 'GENERATE_SUCCESS', payload: recipe });
    } catch (e) {
      dispatch({ type: 'GENERATE_ERROR', payload: String(e) });
    }
  }, [state.input]);

  const adjust = useCallback(async (type: AdjustmentType) => {
    if (!state.recipe) return;
    dispatch({ type: 'GENERATE_START' });
    try {
      const recipe = await adjustRecipe(state.recipe, type);
      dispatch({ type: 'GENERATE_SUCCESS', payload: recipe });
    } catch (e) {
      dispatch({ type: 'GENERATE_ERROR', payload: String(e) });
    }
  }, [state.recipe]);

  const adjustByIngredients = useCallback(async () => {
    if (!state.recipe) return;
    dispatch({ type: 'GENERATE_START' });
    try {
      const recipe = await adjustRecipeByIngredients(state.recipe);
      dispatch({ type: 'GENERATE_SUCCESS', payload: recipe });
    } catch (e) {
      dispatch({ type: 'GENERATE_ERROR', payload: String(e) });
    }
  }, [state.recipe]);

  const adjustStepAction = useCallback(async (stepId: string, adjustType: 'detail' | 'simple') => {
    const step = state.recipe?.steps.find((s) => s.id === stepId);
    if (!step) return;
    const existing = state.stepAdjustments[stepId];
    if (existing && existing.type === adjustType && !existing.loading) {
      dispatch({ type: 'STEP_ADJUST_CLEAR', stepId });
      return;
    }
    dispatch({ type: 'STEP_ADJUST_START', stepId, adjustType });
    try {
      const content = await adjustStep(step, adjustType);
      dispatch({ type: 'STEP_ADJUST_SUCCESS', stepId, adjustType, content });
    } catch (e) {
      dispatch({ type: 'STEP_ADJUST_CLEAR', stepId });
    }
  }, [state.recipe, state.stepAdjustments]);

  const deleteIngredient = useCallback((ingredientId: string) => {
    dispatch({ type: 'INGREDIENT_DELETE', ingredientId });
  }, []);

  const replaceIngredient = useCallback((ingredientId: string, newName: string, newAmount: string) => {
    dispatch({ type: 'INGREDIENT_REPLACE', ingredientId, newName, newAmount });
  }, []);

  const suggestAlternatives = useCallback(async (ingredientId: string, ingredientName: string) => {
    const existing = state.ingredientSuggestions[ingredientId];
    if (existing) {
      dispatch({ type: 'INGREDIENT_SUGGEST_CLEAR', ingredientId });
      return;
    }
    try {
      const suggestions = await suggestIngredientAlternatives(ingredientName);
      dispatch({ type: 'INGREDIENT_SUGGEST_SUCCESS', ingredientId, suggestions });
    } catch (e) {
      console.error(e);
    }
  }, [state.ingredientSuggestions]);

  const saveRecipe = useCallback(() => dispatch({ type: 'SAVE_RECIPE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    state, setInput, generate, adjust, adjustByIngredients, adjustStepAction,
    deleteIngredient, replaceIngredient, suggestAlternatives,
    saveRecipe, reset,
  };
}