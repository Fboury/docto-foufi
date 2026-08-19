import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X } from 'lucide-react';
import { BadgeConfig } from '../../constants/badges';

interface BadgeUnlockModalProps {
  unlockedBadges: BadgeConfig[];
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
                                                                    unlockedBadges,
                                                                    onClose
                                                                  }) => {
  useEffect(() => {
    if (unlockedBadges.length > 0) {
      // Déclenchement de la pluie de confettis
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5E4B8B', '#F5EFE6', '#F59E0B', '#10B981']
      });
    }
  }, [unlockedBadges]);

  if (unlockedBadges.length === 0) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs duration-200">
      <div
        className="relative w-full max-w-sm space-y-5 rounded-3xl border border-[#E8DFD8] bg-white p-6 text-center shadow-xl">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-[#8E8294] hover:bg-[#F5EFE6]">
          <X className="h-4 w-4" />
        </button>

        {/* En-tête */}
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl text-amber-800 shadow-inner">
          <Sparkles className="h-8 w-8 animate-bounce text-amber-600" />
        </div>

        <div className="space-y-1">
          <span
            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-700 uppercase">
            {unlockedBadges.length > 1 ? 'Nouveaux trophées !' : 'Nouveau trophée débloqué !'}
          </span>
          <h2
            className="pt-2 font-serif text-xl font-bold text-[#5E4B8B]">Félicitations
            Bahia !</h2>
        </div>

        {/* Liste des badges débloqués lors de cette saisie */}
        <div className="no-scrollbar max-h-60 space-y-2 overflow-y-auto">
          {unlockedBadges.map(badge => (
            <div
              key={badge.key}
              className="flex items-center gap-3 rounded-2xl border border-[#E8DFD8] bg-[#F5EFE6]/50 p-3 text-left">
              <span className="text-3xl">{badge.emoji}</span>
              <div>
                <h3
                  className="text-xs font-bold text-[#2D283E]">{badge.title}</h3>
                <p
                  className="text-[10px] text-[#8E8294]">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de confirmation */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-[#5E4B8B] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#4A3B70]">
          Continuer
        </button>
      </div>
    </div>
  );
};
