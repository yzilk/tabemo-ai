import { useReducer, useCallback } from 'react';
import type { RecipeState, RecipeInput, AdjustmentType } from '../types';
import { generateRecipe, adjustRecipe, adjustStep } from '../services/recipeService';

const DEFAULT_INPUT: RecipeInput = {
  query: '',
  dietStyles: [],
  servings: 2,
  maxMinutes: 30,
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
};

type Action =
  | { type: 'SET_INPUT'; payload: Partial<RecipeInput> }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; payload: RecipeState['recipe'] }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'STEP_ADJUST_START'; stepId: string; adjustType: 'detail' | 'simple' }
  | { type: 'STEP_ADJUST_SUCCESS'; stepId: string; adjustType: 'detail' | 'simple'; content: string }
  | { type: 'STEP_ADJUST_CLEAR'; stepId: string }
  | { type: 'SAVE_RECIPE' }
  | { type: 'RESET' };

function reducer(state: RecipeState, action: Action): RecipeState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: { ...state.input, ...action.payload } };
    case 'GENERATE_START':
      return { ...state, status: 'loading', error: null, stepAdjustments: {} };
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

  const saveRecipe = useCallback(() => dispatch({ type: 'SAVE_RECIPE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return { state, setInput, generate, adjust, adjustStepAction, saveRecipe, reset };
}