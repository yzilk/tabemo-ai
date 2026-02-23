# AIタベモ — React + TypeScript

## セットアップ

```bash
npm install
npm run dev
```

---

## ディレクトリ構成

```
src/
├── types/
│   └── index.ts               # ドメイン型定義（Recipe, RecipeInput, etc.）
│
├── data/
│   └── mockRecipe.ts          # モックデータ・ラベルマップ
│
├── services/
│   └── recipeService.ts       # API layer（モック ↔ Gemini 差し替えポイント）
│
├── hooks/
│   └── useRecipe.ts           # useReducer による状態管理（中央ハブ）
│
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── input/
│   │   └── InputPanel.tsx     # 左パネル（入力UI）
│   ├── recipe/
│   │   ├── ResultPanel.tsx    # 右パネル（組み立て）
│   │   ├── RecipeHero.tsx     # ヒーロー + ワンクリック調整
│   │   ├── RecipeCards.tsx    # 食材カード + 栄養カード
│   │   └── StepList.tsx       # 手順 + ステップ単位調整
│   └── ui/
│       └── States.tsx         # Empty / Loading / Error
│
├── App.tsx                    # ルートコンポーネント
├── App.css                    # 全スタイル（CSS変数ベース）
└── main.tsx                   # エントリーポイント
```

---

## Gemini API への差し替え方法

`src/services/recipeService.ts` の以下の関数を実装するだけ：

```ts
// 1. レシピ生成
export async function generateRecipe(input: RecipeInput): Promise<Recipe>

// 2. レシピ全体調整（ワンクリック）
export async function adjustRecipe(recipe: Recipe, type: AdjustmentType): Promise<Recipe>

// 3. ステップ単位調整
export async function adjustStep(step: RecipeStep, type: 'detail' | 'simple'): Promise<string>
```

Geminiへのプロンプト設計例：

```
以下の条件でレシピを1つ生成してください。
レスポンスはJSONのみで返してください。

条件:
- 食材・気分: {query}
- 食事スタイル: {dietStyles}
- 人数: {servings}人
- 調理時間: {maxMinutes}分以内
- カロリー目安: {calorieRange}

JSONスキーマ:
{ name, emoji, description, servings, totalMinutes, difficulty,
  ingredients: [{id, name, amount, ratio}],
  steps: [{id, number, title, description, durationMinutes, tips}],
  nutrition: {calories, protein, carbs, fat},
  aiComment, costLevel }
```

---

## 状態管理フロー

```
InputPanel
  └─ onInputChange → useRecipe.setInput → RecipeState.input

[生成ボタン]
  └─ onGenerate → useRecipe.generate
      └─ recipeService.generateRecipe(input)
          └─ dispatch GENERATE_SUCCESS → RecipeState.recipe

[ステップ調整ボタン]
  └─ onAdjustStep(stepId, type) → useRecipe.adjustStepAction
      └─ recipeService.adjustStep(step, type)
          └─ dispatch STEP_ADJUST_SUCCESS → RecipeState.stepAdjustments[stepId]
```

---

## 今後の拡張ポイント

| フェーズ | 機能 |
|---|---|
| v0.2 | Gemini API 統合・画像生成（Imagen） |
| v0.3 | お気に入り保存（LocalStorage → DynamoDB） |
| v0.4 | 週間献立プランナー |
| v0.5 | 会員登録・パーソナライズ |
