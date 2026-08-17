import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import {
  InjectionEntry,
  InjectionZone,
  ReactionType,
  ZONES_CONFIG
} from '../../types/injection';

interface AddInjectionProps {
  recommendedZoneId?: InjectionZone;
  onSubmit: (entry: InjectionEntry) => void;
}

export const AddInjection: React.FC<AddInjectionProps> = ({ recommendedZoneId = 'flanc_gauche', onSubmit }) => {
  // 1. État du formulaire
  const [selectedZone, setSelectedZone] = useState<InjectionZone>(recommendedZoneId);
  const [reactionType, setReactionType] = useState<ReactionType>('aucune');
  const [reactionDetails, setReactionDetails] = useState('');

  // Date/Heure par défaut (Maintenant)
  const [injectionDate, setInjectionDate] = useState(new Date().toISOString().slice(0, 16));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      injected_at: new Date(injectionDate).toISOString(),
      zone: selectedZone,
      reaction_type: reactionType,
      reaction_details: reactionType !== 'aucune' ? reactionDetails : undefined
    });
  };

  const selectedZoneData = ZONES_CONFIG.find(z => z.id === selectedZone);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-xl space-y-6 pb-10">
      {/* SECTION 1 : Date & Horodatage */}
      <div className="flex items-center justify-between rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5EFE6] text-[#5E4B8B]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#8E8294]">Date & Heure d'injection</p>
            <input
              type="datetime-local"
              value={injectionDate}
              onChange={e => setInjectionDate(e.target.value)}
              className="cursor-pointer bg-transparent text-sm font-bold text-[#2D283E] focus:outline-none"
            />
          </div>
        </div>
        <Clock className="h-4 w-4 text-[#8E8294]" />
      </div>

      {/* SECTION 2 : Recommandation Automatique */}
      <div className="space-y-3 rounded-3xl border border-[#D3C1E5] bg-[#E5D9F2] p-4.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#5E4B8B]" />
            <span className="text-xs font-bold tracking-wider text-[#5E4B8B] uppercase">Suggestion de zone</span>
          </div>
          <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold text-[#5E4B8B]">
            Optimal (Le + ancien)
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xl font-bold text-[#2D283E]">
              {ZONES_CONFIG.find(z => z.id === recommendedZoneId)?.fullLabel}
            </p>
            <p className="mt-0.5 text-xs font-medium text-[#5E4B8B]/80">
              Dernière piqûre : il y a {ZONES_CONFIG.find(z => z.id === recommendedZoneId)?.daysAgo} jours
            </p>
          </div>

          {selectedZone !== recommendedZoneId && (
            <button
              type="button"
              onClick={() => setSelectedZone(recommendedZoneId)}
              className="rounded-2xl bg-[#5E4B8B] px-3.5 py-2 text-xs font-bold text-white shadow transition-all hover:bg-[#4A3B6E]">
              Utiliser ce site
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3 : Choix de la Zone (Grille 3x3) */}
      <div className="space-y-2.5">
        <label className="px-1 text-xs font-bold tracking-wider text-[#8E8294] uppercase">Sélection de la zone</label>

        <div className="grid grid-cols-3 gap-2.5">
          {ZONES_CONFIG.map(zone => {
            const isSelected = selectedZone === zone.id;

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZone(zone.id)}
                className={`relative flex h-24 flex-col items-center justify-center rounded-2xl p-2 text-center transition-all ${
                  isSelected
                    ? 'font-bold shadow-md ring-2 ring-[#5E4B8B] ring-offset-2 ring-offset-[#F5EFE6]'
                    : 'hover:opacity-95'
                } ${
                  !zone.isRecent
                    ? 'border border-[#D3C1E5] bg-[#E5D9F2] text-[#5E4B8B]' // Lilas
                    : 'border border-[#DFC8A6] bg-[#EFE3C8] text-[#8C6D46]' // Sable
                } `}>
                <span className="mb-0.5 text-xl">{zone.emoji}</span>
                <span className="text-xs leading-tight font-semibold">{zone.shortLabel}</span>
                <span className="mt-0.5 text-[10px] font-medium opacity-75">
                  {zone.daysAgo === null ? 'Jamais' : `il y a ${zone.daysAgo} j`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4 : Reaction à l'injection précédente */}
      <div className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-4.5 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#2D283E]">Injection de la veille</h3>
          <p className="text-xs text-[#8E8294]">Avez-vous eu une réaction sur le dernier site ?</p>
        </div>

        {/* Badges de Réaction */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'aucune', label: 'Aucune', emoji: '✨' },
            { id: 'bleu', label: 'Bleu', emoji: '🫐' },
            { id: 'douleur', label: 'Douleur', emoji: '🩹' },
            { id: 'autre', label: 'Autre', emoji: '💬' }
          ].map(item => {
            const isActive = reactionType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setReactionType(item.id as ReactionType)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'border-[#5E4B8B] bg-[#5E4B8B] text-white shadow-sm'
                    : 'border-[#E8DFD8] bg-[#F5EFE6] text-[#2D283E] hover:bg-[#E8DFD8]'
                } `}>
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Champ détails si réaction spécifique */}
        {reactionType !== 'aucune' && (
          <div className="animate-fadeIn pt-2">
            <textarea
              rows={2}
              value={reactionDetails}
              onChange={e => setReactionDetails(e.target.value)}
              placeholder="Précisez la réaction (ex: zone gonflée, légère rougeur...)"
              className="w-full rounded-2xl border border-[#E8DFD8] bg-[#F5EFE6] p-3 text-xs text-[#2D283E] focus:ring-2 focus:ring-[#5E4B8B] focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* BUTTON : Validation Principale */}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5E4B8B] py-4 text-base font-bold text-white shadow-lg shadow-[#5E4B8B]/20 transition-all hover:bg-[#4A3B6E] active:scale-[0.99]">
        <CheckCircle2 className="h-5 w-5" />
        <span>Enregistrer l'injection ({selectedZoneData?.shortLabel})</span>
      </button>
    </form>
  );
};
