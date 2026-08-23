import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, ChevronRight, Sparkles, Trophy } from 'lucide-react';
import { BadgeConfig } from '../../constants/badges';

interface BadgeUnlockModalProps {
  unlockedBadges: BadgeConfig[];
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
                                                                    unlockedBadges,
                                                                    onClose
                                                                  }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (!unlockedBadges || unlockedBadges.length === 0) return null;

  const currentBadge = unlockedBadges[currentIndex];
  const isMultiple = unlockedBadges.length > 1;
  const isLast = currentIndex === unlockedBadges.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      // Petit effet de confettis discret lors du passage au badge suivant
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#5E4B8B', '#F59E0B']
      });
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200">
      <div
        className="animate-in zoom-in-95 relative w-full max-w-sm space-y-5 rounded-3xl border border-[#E8DFD8] bg-white p-6 text-center shadow-xl duration-200">
        {/* En-tête avec Icône */}
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl text-amber-800 shadow-inner">
          <Sparkles className="h-8 w-8 animate-bounce text-amber-600" />
        </div>

        {/* Titre & Compteur d'étape si multiples */}
        <div className="space-y-1.5">
          {isMultiple ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-700 uppercase">
              <Trophy className="h-3 w-3" />
              Trophée {currentIndex + 1} sur {unlockedBadges.length}
            </span>
          ) : (
            <span
              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-700 uppercase">
              Nouveau trophée débloqué !
            </span>
          )}

          <h2
            className="pt-1 font-serif text-xl font-bold text-[#5E4B8B]">Félicitations
            Bahia !</h2>
        </div>

        {/* Carte du Badge Actuel */}
        <div
          className="space-y-3 rounded-2xl border border-[#E8DFD8] bg-[#F5EFE6]/50 p-4 text-center">
          <span
            className="inline-block text-5xl transition-transform duration-200 hover:scale-110">
            {currentBadge.emoji}
          </span>
          <div>
            <h3
              className="text-sm font-bold text-[#2D283E]">{currentBadge.title}</h3>
            <p
              className="mt-1 text-xs leading-relaxed text-[#8E8294]">{currentBadge.description}</p>
          </div>
        </div>

        {/* Puces de progression (si plusieurs badges) */}
        {isMultiple && (
          <div className="flex justify-center gap-1.5 pt-1">
            {unlockedBadges.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-[#5E4B8B]' : 'w-1.5 bg-[#E8DFD8]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bouton Suivant / Continuer */}
        <button
          type="button"
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5E4B8B] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#4A3B70] active:scale-95">
          {isLast ? (
            <>
              <Check className="h-4 w-4" />
              <span>Continuer</span>
            </>
          ) : (
            <>
              <span>Trophée suivant</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
