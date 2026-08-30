import React from 'react';
import { Zap } from 'lucide-react';
import { calculateLevel } from '../../../utils/levelingUtils';
import { InjectionEntry } from '../../../types/injection';

interface LevelCardProps {
  injections: InjectionEntry[];
}

export const LevelCard: React.FC<LevelCardProps> = ({ injections }) => {
  const {
    level,
    currentXP,
    xpForNextLevel,
    progressPercent,
    title
  } = calculateLevel(injections);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[#D3C1E5] bg-[#E5D9F2]/50 p-4.5 shadow-xs">
      {/* Badge Flottant Niveau */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5E4B8B] text-amber-300 shadow-sm">
            <Zap className="h-6 w-6 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] font-extrabold tracking-wider text-[#5E4B8B] uppercase">Niveau {level}</span>
              <span
                className="py-0.2 rounded-full bg-white/70 px-2 text-[9px] font-bold text-[#5E4B8B]">{title}</span>
            </div>
            <p className="text-sm font-bold text-[#2D283E]">
              {currentXP} <span
              className="text-xs font-normal text-[#8E8294]">/ {xpForNextLevel} XP</span>
            </p>
          </div>
        </div>

        {/* Cercle d'XP ou pourcentage */}
        <div className="flex flex-col items-end">
          <span
            className="text-xs font-extrabold text-[#5E4B8B]">{progressPercent}%</span>
          <span
            className="text-[9px] font-medium text-[#8E8294]">Complété</span>
        </div>
      </div>

      {/* Barre de progression avec effet pill */}
      <div className="mt-3.5 space-y-1">
        <div
          className="h-2.5 w-full overflow-hidden rounded-full border border-[#D3C1E5]/40 bg-white/80 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8E72C3] to-[#5E4B8B] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
