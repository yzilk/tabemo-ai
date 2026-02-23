import React from 'react';

interface Props {
  savedCount: number;
}

export const Header: React.FC<Props> = ({ savedCount }) => (
  <header className="sticky top-0 z-50 flex items-center justify-between px-8 h-[60px] bg-[#fdf8f3]/90 backdrop-blur-md border-b border-[#e8c4a0]/40">
    <div className="font-serif text-[22px] tracking-wider text-[#d4845a]">
      AI<span className="text-[#2d2016]">タベモ</span>
    </div>
    <nav className="flex gap-6 items-center">
      {['レシピ', 'お気に入り', '履歴'].map((label, i) => (
        <a key={label} href="#" className="relative text-[#8a6a50]/70 text-[13px] font-mono tracking-widest hover:text-[#d4845a] transition-colors">
          {label}
          {i === 1 && savedCount > 0 && (
            <span className="absolute -top-1.5 -right-3 bg-[#f4a56a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </a>
      ))}
    </nav>
  </header>
);