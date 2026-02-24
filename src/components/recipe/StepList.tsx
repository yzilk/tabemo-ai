import React from 'react';
import type { RecipeStep, StepAdjustment } from '../../types';

interface Props {
  steps: RecipeStep[];
  adjustments: Record<string, StepAdjustment>;
  onAdjustStep: (stepId: string, type: 'detail' | 'simple') => void;
}

export const StepList: React.FC<Props> = ({ steps, adjustments, onAdjustStep }) => (
  <div>
    <div className="flex items-center gap-3 text-[11px] text-[#8a6a50]/70 font-mono tracking-widest uppercase mb-5">
      調理手順
      <div className="flex-1 h-px bg-[#e8c4a0]/40" />
    </div>

    <div className="flex flex-col">
      {steps.map((step, index) => {
        const adj = adjustments[step.id];
        const isLast = index === steps.length - 1;
        return (
          <div key={step.id} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f4a56a] to-[#d4845a] flex items-center justify-center text-white text-[12px] font-mono font-bold flex-shrink-0 shadow-sm shadow-[#d4845a]/20">
                {step.number}
              </div>
              {!isLast && <div className="w-[2px] flex-1 bg-gradient-to-b from-[#e8c4a0]/60 to-[#e8c4a0]/20 my-1" />}
            </div>

            {/* Content */}
            <div className={`flex-1 flex flex-col gap-1.5 ${isLast ? 'pb-0' : 'pb-6'}`}>
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="text-[15px] font-medium text-[#2d2016]">{step.title}</div>
                <div className="text-[11px] font-mono px-2.5 py-1 border border-[#e8c4a0]/60 text-[#8a6a50]/70 rounded-lg whitespace-nowrap">
                  {step.durationMinutes} min
                </div>
              </div>

              <p className="text-[14px] text-[#5a3e2b]/75 leading-relaxed">{step.description}</p>

              {step.tips && (
                <div className="flex gap-1.5 text-[12px] text-[#8a6a50]/70 font-mono bg-[#fdf3eb] rounded-lg px-3 py-2 leading-relaxed">
                  <span>💡</span>
                  {step.tips}
                </div>
              )}

              {adj && (
                <div className={`rounded-xl p-3.5 border text-[13px] leading-relaxed mt-1 animate-fade-up ${
                  adj.type === 'detail'
                    ? 'bg-[#e8f4fd] border-[#7ab0e8]/30'
                    : 'bg-[#fdf3eb] border-[#f4a56a]/30'
                }`}>
                  {adj.loading ? (
                    <div className="flex items-center gap-2 text-[#8a6a50]/70 font-mono text-[12px]">
                      <span className="w-3 h-3 border-2 border-[#d4845a]/20 border-t-[#d4845a] rounded-full animate-spin" />
                      AIが調整中…
                    </div>
                  ) : (
                    <>
                      <div className="text-[11px] font-mono text-[#8a6a50]/70 mb-1.5">
                        {adj.type === 'detail' ? '📖 詳しく' : '⚡ 簡単に'}
                      </div>
                      <p className="text-[#2d2016]/85">{adj.content}</p>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-1">
                {[
                  { type: 'detail' as const, label: '📖 もっと詳しく' },
                  { type: 'simple' as const, label: '⚡ 簡単にする' },
                ].map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => onAdjustStep(step.id, type)}
                    disabled={adj?.loading}
                    className={`px-3 py-1 rounded-lg text-[12px] font-mono border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      adj?.type === type && !adj.loading
                        ? 'border-[#d4845a] text-[#d4845a] bg-[#f4a56a]/10'
                        : 'border-[#e8c4a0]/60 text-[#8a6a50]/70 hover:border-[#d4845a] hover:text-[#d4845a]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);