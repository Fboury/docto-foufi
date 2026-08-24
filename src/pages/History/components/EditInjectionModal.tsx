import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, FileText, MapPin, X } from 'lucide-react';
import {
  InjectionEntry,
  ReactionType,
  ZONES_CONFIG
} from '../../../types/injection';

interface EditInjectionModalProps {
  injection: InjectionEntry;
  onClose: () => void;
  onSave: (
    id: string,
    updatedData: {
      zone: any;
      injected_at: string;
      notes?: string;
      reaction_types?: ReactionType[];
      reaction_details?: string;
    }
  ) => Promise<{ error: any } | void>;
  onDelete?: (id: string) => Promise<any>;
}

export const EditInjectionModal: React.FC<EditInjectionModalProps> = ({
                                                                        injection,
                                                                        onClose,
                                                                        onSave,
                                                                        onDelete
                                                                      }) => {
  // Bloque le défilement du fond de page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Conversion ISO UTC vers input local ("YYYY-MM-DDTHH:mm")
  const [dateValue, setDateValue] = useState(() => {
    const d = new Date(injection.injected_at);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const [selectedZone, setSelectedZone] = useState(injection.zone);

  // ✅ PRÉREMPLISSAGE DES NOTES DEPUIS REACTION_DETAILS
  const [notes, setNotes] = useState(injection.notes || injection.reaction_details || '');

  // Récupération des réactions avec rétrocompatibilité
  const [selectedReactions, setSelectedReactions] = useState<ReactionType[]>(() => {
    if (injection.reaction_types && Array.isArray(injection.reaction_types) && injection.reaction_types.length > 0) {
      return injection.reaction_types;
    }
    if (injection.reaction_type && injection.reaction_type !== 'aucune') {
      return [injection.reaction_type as ReactionType];
    }
    return ['aucune'];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle d'une réaction
  const toggleReaction = (type: ReactionType) => {
    if (type === 'aucune') {
      setSelectedReactions(['aucune']);
      return;
    }

    setSelectedReactions(prev => {
      const filtered = prev.filter(r => r !== 'aucune');
      if (filtered.includes(type)) {
        const updated = filtered.filter(r => r !== type);
        return updated.length === 0 ? ['aucune'] : updated;
      } else {
        return [...filtered, type];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const exactIsoString = new Date(dateValue).toISOString();

    // ✅ ENVOI SYNCHRONISÉ SUR REACTION_DETAILS POUR SUPABASE
    await onSave(injection.id, {
      zone: selectedZone,
      injected_at: exactIsoString,
      reaction_types: selectedReactions,
      reaction_details: notes.trim() || undefined
    });

    setIsSubmitting(false);
    onClose();
  };

  const availableReactions: {
    id: ReactionType;
    label: string;
    emoji: string
  }[] = [
    { id: 'aucune', label: 'Aucune', emoji: '✨' },
    { id: 'bleu', label: 'Bleu', emoji: '🫐' },
    { id: 'douleur', label: 'Douleur', emoji: '🩹' },
    { id: 'sang', label: 'Sang', emoji: '🩸' },
    { id: 'autre', label: 'Autre', emoji: '💬' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-xl transition-all"
        onClick={e => e.stopPropagation()}>
        {/* En-tête fixe */}
        <div
          className="flex shrink-0 items-center justify-between border-b border-[#F5EFE6] px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-[#5E4B8B]">Modifier
            l'injection</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8E8294] transition-colors hover:bg-[#F5EFE6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulaire défilant */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto p-6">
            {/* 1. Date et heure */}
            <div>
              <label
                className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5E4B8B]">
                <Calendar className="h-4 w-4" />
                <span>Date et heure</span>
              </label>
              <input
                type="datetime-local"
                value={dateValue}
                onChange={e => setDateValue(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#E8DFD8] bg-[#F5EFE6]/50 p-3 text-sm font-semibold text-[#2D283E] focus:border-[#5E4B8B] focus:outline-none"
              />
            </div>

            {/* 2. Zone d'injection */}
            <div>
              <label
                className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5E4B8B]">
                <MapPin className="h-4 w-4" />
                <span>Zone d'injection</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ZONES_CONFIG.map(zone => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <button
                      type="button"
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-[#5E4B8B] bg-[#5E4B8B] text-white shadow-sm'
                          : 'border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]'
                      }`}>
                      <span className="text-base">{zone.emoji}</span>
                      <span className="truncate">{zone.fullLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Réactions observées */}
            <div>
              <label
                className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5E4B8B]">
                <AlertCircle className="h-4 w-4" />
                <span>Réaction(s) observée(s)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableReactions.map(item => {
                  const isSelected = selectedReactions.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleReaction(item.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-[#5E4B8B] bg-[#5E4B8B] text-white shadow-sm'
                          : 'border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]'
                      }`}>
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Notes & Remarques (liées directement à reaction_details) */}
            <div>
              <label
                className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5E4B8B]">
                <FileText className="h-4 w-4" />
                <span>Notes / Remarques</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: Petit hématome, côté droit..."
                rows={3}
                className="w-full rounded-2xl border border-[#E8DFD8] bg-[#F5EFE6]/50 p-3 text-xs text-[#2D283E] focus:border-[#5E4B8B] focus:outline-none"
              />
            </div>
          </div>

          {/* Pied de page fixe */}
          <div
            className="flex shrink-0 gap-3 border-t border-[#F5EFE6] bg-white p-4">
            {onDelete && (
              <button
                type="button"
                onClick={async () => {
                  if (confirm('Supprimer cette injection ?')) {
                    await onDelete(injection.id);
                    onClose();
                  }
                }}
                className="rounded-2xl border border-rose-200 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50">
                Supprimer
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-[#5E4B8B] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#4A3B6E] disabled:opacity-50">
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
