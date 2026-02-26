import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { RecipeStep } from '../../types';

interface Props {
  steps: RecipeStep[];
  recipeName: string;
  onClose: () => void;
}

// ── Timer Hook ──────────────────────────────
function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(initialSeconds);
    setRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) { setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const toggle = () => setRunning((r) => !r);
  const reset = () => { setRunning(false); setSeconds(initialSeconds); };

  return { seconds, running, toggle, reset };
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ── Main Component ───────────────────────────
export const CookingMode: React.FC<Props> = ({ steps, recipeName, onClose }) => {
  const [current, setCurrent] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(steps.length - 1, c + 1)), [steps.length]);

  const step = steps[current];
  const initialSeconds = step.durationMinutes * 60;
  const { seconds, running, toggle, reset } = useTimer(initialSeconds);
  const progress = 1 - seconds / initialSeconds;

  // タップで上下移動
  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const y = e.clientY;
    const h = window.innerHeight;
    if (y < h * 0.45) prev();
    else if (y > h * 0.55) next();
  }, [prev, next]);

  // スワイプ
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(dx) > Math.abs(dy)) {
      // 横スワイプ → 閉じる
      if (dx < -60) onClose();
    } else {
      // 縦スワイプ
      if (dy > 50) next();
      else if (dy < -50) prev();
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none"
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d1a0e] via-[#3d2410] to-[#1a1a0e]" />
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(244,165,106,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(212,132,90,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        ✕
      </button>

      {/* Progress dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {steps.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? '24px' : '6px',
              height: '6px',
              background: i === current ? '#f4a56a' : i < current ? 'rgba(244,165,106,0.5)' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Step counter */}
      <div className="absolute top-16 right-6 z-10 text-right">
        <div className="text-[11px] font-mono text-white/40 tracking-widest">STEP</div>
        <div className="font-serif text-[28px] text-white/80 leading-none">
          {String(current + 1).padStart(2, '0')}
          <span className="text-[16px] text-white/30">/{String(steps.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Prev step hint */}
      {current > 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none"
          style={{ opacity: 0.3 }}>
          <div className="text-white/60 text-[11px] font-mono mb-1">▲</div>
          <div className="text-white/40 text-[12px] font-mono truncate max-w-[200px]">{steps[current - 1].title}</div>
        </div>
      )}

      {/* Main card - glassmorphism */}
      <div
        className="absolute left-4 right-4 z-10"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '28px',
          padding: '36px 28px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Step title */}
        <div className="text-[13px] font-mono text-[#f4a56a]/80 tracking-widest uppercase mb-3">
          {step.title}
        </div>

        {/* Main description */}
        <div className="font-serif text-white leading-snug mb-6"
          style={{ fontSize: 'clamp(22px, 5vw, 32px)' }}>
          {step.description}
        </div>

        {/* Tips */}
        {step.tips && (
          <div className="flex gap-2 text-[13px] text-white/50 font-mono leading-relaxed mb-6 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span>💡</span>
            <span>{step.tips}</span>
          </div>
        )}

        {/* Timer */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-mono text-white/40 tracking-widest">タイマー</div>
            <div className="flex gap-2">
              <button
                onClick={toggle}
                className="px-4 py-1.5 rounded-full text-[13px] font-mono transition-all"
                style={{
                  background: running ? 'rgba(244,165,106,0.2)' : 'rgba(244,165,106,0.3)',
                  border: '1px solid rgba(244,165,106,0.4)',
                  color: '#f4a56a',
                }}
              >
                {running ? '⏸ 一時停止' : seconds === initialSeconds ? '▶ スタート' : '▶ 再開'}
              </button>
              <button
                onClick={reset}
                className="px-3 py-1.5 rounded-full text-[12px] font-mono text-white/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                リセット
              </button>
            </div>
          </div>

          {/* Time display */}
          <div className="text-center mb-3">
            <span className="font-serif text-white/90"
              style={{ fontSize: 'clamp(36px, 10vw, 52px)' }}>
              {formatTime(seconds)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress * 100}%`,
                background: seconds === 0
                  ? '#e07070'
                  : 'linear-gradient(90deg, #f4a56a, #d4845a)',
              }}
            />
          </div>

          {seconds === 0 && (
            <div className="text-center mt-2 text-[#f4a56a] font-mono text-[13px] animate-pulse">
              ✓ 完了！
            </div>
          )}
        </div>
      </div>

      {/* Next step hint */}
      {current < steps.length - 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <div className="text-white/40 text-[12px] font-mono truncate max-w-[200px]">{steps[current + 1].title}</div>
          <div className="text-white/60 text-[11px] font-mono mt-1">▼</div>
        </div>
      )}

      {/* Last step */}
      {current === steps.length - 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <div className="text-[#f4a56a]/60 text-[13px] font-mono">🎉 最後のステップ</div>
        </div>
      )}

      {/* Tap zones hint (初回のみ) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="text-white/20 text-[10px] font-mono tracking-widest text-center">
          上タップ：前へ　下タップ：次へ　←スワイプ：終了
        </div>
      </div>
    </div>
  );
};