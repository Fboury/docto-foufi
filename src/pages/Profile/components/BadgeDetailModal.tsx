import React from 'react';
import { Award, Calendar, X } from 'lucide-react';
import { BadgeConfig } from '../../../constants/badges';
import { formatDate } from '../../../utils/dateUtils';

interface BadgeDetailModalProps {
  badge: BadgeConfig | null;
  unlockedDates?: string[]; // Tableau de toutes les dates d'obtention
  onClose: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
                                                                    badge,
                                                                    unlockedDates = [],
                                                                    onClose
                                                                  }) => {
  if (!badge) return null;

  const count = unlockedDates.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-all">
      <div
        className="relative w-full max-w-sm space-y-4 rounded-3xl border border-[#E8DFD8] bg-white p-6 text-center shadow-2xl">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-[#F5EFE6] p-1.5 text-[#8E8294] transition-colors hover:text-[#2D283E]">
          <X className="h-5 w-5" />
        </button>

        {/* Visuel du Badge avec son Emoji */}
        <div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#E5D9F2] text-5xl shadow-inner">
          {badge.emoji}
        </div>

        {/* Titre & Description */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[#F5EFE6] px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-[#5E4B8B] uppercase">
              <Award className="h-3 w-3" /> Badge Débloqué
            </span>
            {count > 1 && (
              <span
                className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                Obtenu {count} fois !
              </span>
            )}
          </div>

          <h3
            className="font-serif text-xl font-bold text-[#2D283E]">{badge.title}</h3>
          <p
            className="px-2 text-xs leading-relaxed text-[#8E8294]">{badge.description}</p>
        </div>

        {/* Historique des dates d'obtention */}
        {unlockedDates.length > 0 && (
          <div className="space-y-2 border-t border-[#F5EFE6] pt-3 text-xs">
            <div
              className="flex items-center justify-center gap-1 font-bold text-[#5E4B8B]">
              <Calendar className="h-3.5 w-3.5" />
              <span>{count > 1 ? 'Historique des obtentions :' : 'Obtenu le :'}</span>
            </div>

            <div
              className="no-scrollbar max-h-32 space-y-1.5 overflow-y-auto px-2">
              {unlockedDates.map((dateIso, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-[#F5EFE6]/60 px-3 py-1.5 text-[11px] font-medium text-[#2D283E]">
                  <span
                    className="text-[#8E8294]">{count > 1 ? `Obtention n°${index + 1}` : 'Date'}</span>
                  <span className="font-bold">{formatDate(dateIso)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
