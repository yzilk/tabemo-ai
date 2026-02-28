import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface Props {
  savedCount: number;
  onMenuOpen: () => void;
}

export const Header: React.FC<Props> = ({ savedCount, onMenuOpen }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-[60px] bg-[#fdf8f3]/90 backdrop-blur-md border-b border-[#e8c4a0]/40">
    <div className="flex items-center gap-3">
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8a6a50]/70 hover:text-[#d4845a] hover:bg-[#f4e8dc] transition-all"
      >
        <FontAwesomeIcon icon={faBars} className="text-[16px]" />
      </button>
      <div className="font-serif text-[22px] tracking-wider text-[#d4845a]">
        AI<span className="text-[#2d2016]">タベモ</span>
      </div>
    </div>

    {savedCount > 0 && (
      <div className="flex items-center gap-1.5 text-[12px] font-mono text-[#8a6a50]/60">
        <span className="text-[#d4845a]">♥</span>
        {savedCount}件保存中
      </div>
    )}
  </header>
);