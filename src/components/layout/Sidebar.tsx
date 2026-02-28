import React from 'react';
import type { Recipe } from '../../types';

interface Props {
  isOpen: boolean;
  savedRecipes: Recipe[];
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const Sidebar: React.FC<Props> = ({ isOpen, savedRecipes, onClose, onSelectRecipe }) => (
  <>
    {/* オーバーレイ */}
    {isOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
    )}

    {/* ドロワー */}
    <div
      className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-[#fff9f4] border-r border-[#e8c4a0]/40 shadow-xl transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-[60px] border-b border-[#e8c4a0]/40">
        <div className="font-serif text-[18px] text-[#d4845a]">
          AI<span className="text-[#2d2016]">タベモ</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a6a50]/50 hover:text-[#d4845a] hover:bg-[#f4e8dc] transition-all"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-4 border-b border-[#e8c4a0]/40">
        {[
          { icon: '🍽️', label: 'レシピ生成' },
          { icon: '📅', label: '週間献立' },
          { icon: '🛒', label: '買い物リスト' },
          { icon: '⚙️', label: '設定' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-[#5a3e2b]/70 hover:bg-[#f4e8dc] hover:text-[#d4845a] transition-all text-left font-mono"
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* お気に入り */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-[11px] text-[#8a6a50]/60 font-mono tracking-widest uppercase mb-3">
          お気に入り ({savedRecipes.length})
        </div>
        {savedRecipes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-[32px] mb-2">♡</div>
            <p className="text-[12px] text-[#8a6a50]/50 font-mono">
              お気に入りはまだありません
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {savedRecipes.map((recipe) => (
              <li key={recipe.id}>
                <button
                  onClick={() => { onSelectRecipe(recipe); onClose(); }}
                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-[#f4e8dc] transition-all"
                >
                  <div className="text-[14px] font-serif text-[#2d2016] mb-0.5">{recipe.name}</div>
                  <div className="text-[11px] font-mono text-[#8a6a50]/50">
                    ⏱ {recipe.totalMinutes}分　🔥 {recipe.nutrition.calories}kcal
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#e8c4a0]/40">
        <p className="text-[10px] text-[#8a6a50]/40 font-mono text-center">
          AIタベモ v0.1.0
        </p>
      </div>
    </div>
  </>
);