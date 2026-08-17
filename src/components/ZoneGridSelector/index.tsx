import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { InjectionZone, ZONES_CONFIG } from '../../types/injection';

interface Props {
  recommendedZoneId?: InjectionZone;
  onSelectZone: (zoneId: InjectionZone) => void;
}

export const ZoneGridSelector: React.FC<Props> = ({ recommendedZoneId = 'flanc_gauche', onSelectZone }) => {
  const [selectedZone, setSelectedZone] = useState<InjectionZone>(recommendedZoneId);

  const handleSelect = (zoneId: InjectionZone) => {
    setSelectedZone(zoneId);
    onSelectZone(zoneId);
  };

  return (
    <div className="space-y-4">
      {/* 1. Carte de Suggestion Automatique */}
      <div className="flex items-center justify-between rounded-2xl border border-[#D3C1E5] bg-[#E5D9F2] p-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-wider text-[#5E4B8B] uppercase">
            Suggestion de Zone (Le moins récent)
          </p>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#5E4B8B]" />
            <span className="text-lg font-bold text-[#2D283E]">
              {ZONES_CONFIG.find(z => z.id === recommendedZoneId)?.fullLabel}
            </span>
          </div>
        </div>

        {selectedZone !== recommendedZoneId && (
          <button
            type="button"
            onClick={() => handleSelect(recommendedZoneId)}
            className="rounded-xl bg-[#5E4B8B] px-3 py-1.5 text-xs font-semibold text-white shadow transition-all hover:bg-[#4A3B6E]">
            Utiliser ce site
          </button>
        )}
      </div>

      {/* 2. Grille de Tuiles (Maquette) */}
      <div className="space-y-2">
        <h3 className="px-1 text-xs font-bold tracking-wider text-[#8E8294] uppercase">Zones d'Injection</h3>

        <div className="grid grid-cols-3 gap-3">
          {ZONES_CONFIG.map(zone => {
            const isSelected = selectedZone === zone.id;
            const isRecommended = recommendedZoneId === zone.id;

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelect(zone.id)}
                className={`relative flex h-20 flex-col items-center justify-between rounded-2xl p-2 text-center transition-all duration-150 ${/* Style de sélection principale */ ''} ${
                  isSelected
                    ? 'font-bold shadow-md ring-2 ring-[#5E4B8B] ring-offset-2 ring-offset-[#F5EFE6]'
                    : 'opacity-90 hover:opacity-100'
                } ${/* Différenciation des couleurs d'ancienneté */ ''} ${
                  !zone.isRecent
                    ? 'border border-[#D3C1E5] bg-[#E5D9F2] text-[#5E4B8B]' // Lilas (Ancien / À utiliser)
                    : 'border border-[#DFC8A6] bg-[#EFE3C8] text-[#8C6D46]' // Beige (Récent / À éviter)
                } `}>
                {/* Icône de validation discrète si sélectionné */}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#5E4B8B] text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}

                {/* Remplacement de l'icône générique par le SVG dédié */}
                <span className="mb-1 text-xl">{zone.emoji}</span>
                <span className="line-clamp-1 text-[11px] leading-tight font-semibold">{zone.shortLabel}</span>

                {/* Badge IDÉAL pour la zone suggérée */}
                {isRecommended && !isSelected && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-[#5E4B8B] px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
                    IDÉAL
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
