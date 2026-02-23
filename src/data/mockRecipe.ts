import type { Recipe } from '../types';

export const MOCK_RECIPE: Recipe = {
  id: 'mock-001',
  name: '鶏トマトのバジル煮込み',
  emoji: '🍗',
  description: 'トマトの酸味と鶏のうまみが溶け合う、シンプルで奥深い一皿。',
  servings: 2,
  totalMinutes: 28,
  difficulty: 'easy',
  dietStyles: ['western', 'healthy'],
  ingredients: [
    { id: 'i1', name: '鶏もも肉', amount: '300g', ratio: 0.8 },
    { id: 'i2', name: 'トマト（中）', amount: '2個', ratio: 0.6 },
    { id: 'i3', name: 'にんにく', amount: '2かけ', ratio: 0.3 },
    { id: 'i4', name: 'バジル', amount: '適量', ratio: 0.2, optional: true },
    { id: 'i5', name: 'オリーブオイル', amount: '大さじ2', ratio: 0.25 },
    { id: 'i6', name: '塩・こしょう', amount: '少々', ratio: 0.1 },
  ],
  steps: [
    {
      id: 's1', number: 1, title: '下ごしらえ', durationMinutes: 3,
      description: '鶏もも肉を一口大に切り、塩・こしょうで下味をつける。トマトはざく切り、にんにくはみじん切りにする。',
      tips: '鶏肉は常温に戻しておくと火の通りが均一になります。',
    },
    {
      id: 's2', number: 2, title: '鶏肉を焼く', durationMinutes: 8,
      description: 'フライパンにオリーブオイルとにんにくを入れ中火で香りを出す。鶏肉を皮目から入れ、両面こんがり焼き色をつける。',
      tips: '皮をしっかり押し付けて焼くとパリッと仕上がります。',
    },
    {
      id: 's3', number: 3, title: 'トマトで煮込む', durationMinutes: 15,
      description: 'トマトを加えて蓋をし、弱火で15分煮込む。途中で一度混ぜ、水分が飛んできたら塩で味を調える。',
      tips: '煮込み過ぎると鶏肉が硬くなるので注意。',
    },
    {
      id: 's4', number: 4, title: '仕上げ・盛り付け', durationMinutes: 2,
      description: '火を止めてバジルをちぎって散らす。白いご飯やバゲットに乗せて完成。オリーブオイルを少し垂らすと風味UP。',
    },
  ],
  nutrition: {
    calories: 512, calorieMax: 800,
    protein: 34,   proteinMax: 50,
    carbs: 18,     carbsMax: 60,
    fat: 26,       fatMax: 50,
  },
  aiComment: '今回の組み合わせ、実は地中海料理の定番。トマトのリコピンと鶏肉のたんぱく質は相性◎。余熱で少し置くと肉が柔らかくなります。翌日はパスタソースとしても使えるので多めに作るのもおすすめ。',
  costLevel: 1,
  createdAt: new Date(),
};

export const DIET_STYLE_LABELS: Record<string, string> = {
  japanese: '和食',
  western: '洋食',
  chinese: '中華',
  healthy: 'ヘルシー',
  hearty: 'がっつり',
  diet: 'ダイエット',
};

export const CALORIE_LABELS: Record<string, string> = {
  under400: '〜400kcal',
  under600: '〜600kcal',
  under800: '〜800kcal',
  unlimited: '制限なし',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'やさしい',
  medium: '普通',
  hard: '本格',
};

export const STEP_ADJUST_MOCK: Record<string, string> = {
  simpler: '市販のカットトマト缶（400g）を使えばトマトの下処理が不要。開けてそのまま入れるだけでOK。にんにくもチューブで代用できます。',
  moreDetail: '【鶏肉の焼き方詳細】フライパンは中火で1分予熱してからオイルを投入。にんにくは焦げやすいので常に動かしながら30秒。鶏肉は皮目を下にして触らず2分放置することでパリッとした食感が生まれます。裏返してさらに1分焼いたら一旦取り出しておきましょう。',
};