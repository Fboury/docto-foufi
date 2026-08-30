import React from 'react';
import { Sparkles, Trophy, Zap } from 'lucide-react';
import { LevelInfo } from '../../utils/levelingUtils';

interface LevelUpModalProps {
  levelInfo: LevelInfo | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ levelInfo, onClose }) => {
  if (!levelInfo) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in-95 relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#D3C1E5] bg-gradient-to-b from-[#2D283E] via-[#4A3B6E] to-[#5E4B8B] p-6 text-center text-white shadow-2xl duration-300">
        {/* Glow de fond */}
        <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-[#8E72C3]/30 blur-3xl" />

        {/* Icône animée */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-amber-300/50 bg-white/10 shadow-lg backdrop-blur-md">
          <Zap className="h-10 w-10 animate-bounce fill-amber-300 text-amber-300" />
        </div>

        {/* Titre */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-300/20 px-3 py-1 text-[10px] font-extrabold tracking-widest text-amber-200 uppercase">
            <Sparkles className="h-3 w-3" /> Level Up !
          </div>
          <h2 className="font-serif text-2xl font-black text-white">Niveau {levelInfo.level} Atteint !</h2>
          <p className="text-sm font-bold text-amber-300">{levelInfo.title}</p>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-white/80">
          Félicitations pour ta régularité ! Continue sur cette lancée.
        </p>

        {/* Bouton de confirmation */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 py-3.5 text-sm font-black text-amber-950 shadow-lg transition-transform hover:brightness-105 active:scale-95">
          <Trophy className="h-4 w-4" />
          <span>Génial !</span>
        </button>
      </div>
    </div>
  );
};
