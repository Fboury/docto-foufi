import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Check, Filter, Trash2 } from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import {
  InjectionEntry,
  ReactionType,
  ZONES_CONFIG
} from '../../types/injection';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { EditInjectionModal } from './components/EditInjectionModal';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const {
    injections,
    deleteInjection,
    updateInjection,
    loading
  } = useInjections();

  // État pour stocker l'injection en cours d'édition
  const [editingInjection, setEditingInjection] = useState<InjectionEntry | null>(null);

  // Tableau pour stocker les filtres sélectionnés en multi-sélection
  const [selectedFilters, setSelectedFilters] = useState<ReactionType[]>([]);

  // Helper pour extraire la liste des réactions d'un item (avec rétrocompatibilité)
  const getItemReactions = (item: any): ReactionType[] => {
    if (item.reaction_types && Array.isArray(item.reaction_types) && item.reaction_types.length > 0) {
      return item.reaction_types;
    }
    if (item.reaction_type && item.reaction_type !== 'aucune') {
      return [item.reaction_type as ReactionType];
    }
    return ['aucune'];
  };

  // Toggle d'un filtre de réaction
  const toggleFilter = (type: ReactionType | 'toutes') => {
    if (type === 'toutes') {
      setSelectedFilters([]);
      return;
    }

    setSelectedFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Filtrage
  const filteredInjections = injections.filter(item => {
    if (selectedFilters.length === 0) return true;
    const itemReactions = getItemReactions(item);
    return selectedFilters.some(filter => itemReactions.includes(filter));
  });

  const getReactionBadgeConfig = (type: ReactionType) => {
    switch (type) {
      case 'bleu':
        return {
          label: 'Bleu',
          emoji: '🫐',
          bg: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'douleur':
        return {
          label: 'Douleur',
          emoji: '🩹',
          bg: 'bg-rose-100 text-rose-800 border-rose-200'
        };
      case 'sang':
        return {
          label: 'Sang',
          emoji: '🩸',
          bg: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'autre':
        return {
          label: 'Autre',
          emoji: '💬',
          bg: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      default:
        return {
          label: 'Aucune',
          emoji: '✨',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
      {/* En-tête */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-[#8E8294] transition-colors hover:text-[#5E4B8B]">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au tableau de bord</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-serif text-2xl font-bold text-[#5E4B8B]">Historique</h1>
            <p className="text-xs text-[#8E8294]">
              {filteredInjections.length} sur {injections.length} injection{injections.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filtres par Réaction */}
      <div className="space-y-2">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtrer par réaction(s)</span>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'toutes', label: 'Toutes', emoji: '📋' },
            { id: 'aucune', label: 'Aucune', emoji: '✨' },
            { id: 'bleu', label: 'Bleu', emoji: '🫐' },
            { id: 'douleur', label: 'Douleur', emoji: '🩹' },
            { id: 'sang', label: 'Sang', emoji: '🩸' },
            { id: 'autre', label: 'Autre', emoji: '💬' }
          ].map(tab => {
            const isToutes = tab.id === 'toutes';
            const isActive = isToutes ? selectedFilters.length === 0 : selectedFilters.includes(tab.id as ReactionType);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => toggleFilter(tab.id as ReactionType | 'toutes')}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#5E4B8B] bg-[#5E4B8B] text-white shadow-sm'
                    : 'border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]'
                }`}>
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {isActive && !isToutes && <Check className="ml-0.5 h-3 w-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des Injections */}
      {loading ? (
        <div
          className="py-10 text-center text-xs font-medium text-[#8E8294]">Chargement
          de l'historique...</div>
      ) : filteredInjections.length === 0 ? (
        <div
          className="space-y-2 rounded-3xl border border-[#E8DFD8] bg-white p-8 text-center">
          <Calendar className="mx-auto h-8 w-8 text-[#8E8294] opacity-50" />
          <p className="text-sm font-bold text-[#2D283E]">Aucune injection
            trouvée</p>
          <p className="text-xs text-[#8E8294]">
            {selectedFilters.length === 0
              ? 'Vous n\'avez pas encore enregistré de saisie.'
              : 'Aucune injection ne correspond aux filtres sélectionnés.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInjections.map(item => {
            const zoneInfo = ZONES_CONFIG.find(z => z.id === item.zone);
            const itemReactions = getItemReactions(item);

            return (
              <div
                key={item.id}
                onClick={() => setEditingInjection(item)}
                className="cursor-pointer space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm transition-all hover:border-[#5E4B8B] hover:shadow-md">
                {/* Ligne Supérieure : Date & Zone */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5D9F2] text-xl font-bold text-[#5E4B8B]">
                      {zoneInfo?.emoji || '💉'}
                    </div>
                    <div>
                      <h3
                        className="text-sm font-bold text-[#2D283E]">{zoneInfo?.fullLabel || item.zone}</h3>
                      <div>
                        <p
                          className="font-semibold text-[#2D283E] capitalize">{formatDate(item.injected_at)}</p>
                        <p
                          className="text-xs text-[#8E8294]">{formatTime(item.injected_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de suppression directe (stopPropagation empêche d'ouvrir la modale) */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (item.id && confirm('Supprimer cette entrée ?')) {
                        deleteInjection(item.id);
                      }
                    }}
                    className="rounded-lg p-1 text-[#8E8294] transition-colors hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Badges de Réactions Multiples & Détails */}
                <div
                  className="flex items-center justify-between gap-2 border-t border-[#F5EFE6] pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {itemReactions.map(rType => {
                      const badge = getReactionBadgeConfig(rType);
                      return (
                        <span
                          key={rType}
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.bg}`}>
                          <span>{badge.emoji}</span>
                          <span>{badge.label}</span>
                        </span>
                      );
                    })}
                  </div>

                  {item.reaction_details && (
                    <span
                      className="max-w-[200px] truncate text-[11px] font-normal text-[#8E8294] italic">
                      « {item.reaction_details} »
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale d'Édition */}
      {editingInjection && (
        <EditInjectionModal
          injection={editingInjection}
          onClose={() => setEditingInjection(null)}
          onSave={updateInjection}
          onDelete={deleteInjection}
        />
      )}
    </div>
  );
};
