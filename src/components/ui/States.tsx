import React from 'react';

export const EmptyState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 p-16 text-center">
    <div className="text-[48px] mb-1">🍽️</div>
    <div className="font-serif text-[22px]">レシピを生成しよう</div>
    <p className="text-[13px] text-[#f0ede6]/45 leading-relaxed font-mono">
      左のパネルに食材や気分を入力して<br />
      「レシピを生成する」を押してください。
    </p>
  </div>
);

export const LoadingState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 p-16 text-center">
    <div className="text-[#e8c97a] text-[36px] animate-pulse">✦</div>
    <div className="font-serif text-[22px]">レシピを考えています…</div>
    <p className="text-[13px] text-[#f0ede6]/45 font-mono">食材の組み合わせと栄養バランスを分析中</p>
    <div className="flex flex-col gap-2 mt-2">
      {['食材を解析中', 'レシピを設計中', '栄養バランスを計算中'].map((step, i) => (
        <div
          key={step}
          className="flex items-center gap-2.5 text-[12px] font-mono text-[#f0ede6]/45 opacity-0 animate-fade-up"
          style={{ animationDelay: `${i * 0.3}s`, animationFillMode: 'forwards' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8c97a] animate-pulse" />
          {step}
        </div>
      ))}
    </div>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 p-16 text-center">
    <div className="text-[#e07070] text-[36px]">⚠</div>
    <div className="font-serif text-[22px]">生成に失敗しました</div>
    <p className="text-[13px] text-[#f0ede6]/45 font-mono">{message}</p>
    <button
      onClick={onRetry}
      className="mt-2 px-6 py-2.5 rounded-lg bg-[#1e1e1a] border border-white/[0.07] text-[#f0ede6] font-mono text-[13px] hover:border-[#e8c97a] hover:text-[#e8c97a] transition-all"
    >
      もう一度試す
    </button>
  </div>
);