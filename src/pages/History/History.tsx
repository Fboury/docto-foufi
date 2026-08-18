import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Filter, Trash2 } from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import { ReactionType, ZONES_CONFIG } from '../../types/injection';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { injections, deleteInjection, loading } = useInjections();
  const [filterReaction, setFilterReaction] = useState<ReactionType | 'toutes'>('toutes');

  const filteredInjections = injections.filter(item => {
    if (filterReaction === 'toutes') return true;
    return item.reaction_type === filterReaction;
  });

  const getReactionBadge = (type: ReactionType) => {
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
              {injections.length} injection{injections.length > 1 ? 's' : ''} enregistrée
              {injections.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filtres par Réaction */}
      <div className="space-y-2">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtrer par réaction</span>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'toutes', label: 'Toutes', emoji: '📋' },
            { id: 'aucune', label: 'Aucune', emoji: '✨' },
            { id: 'bleu', label: 'Bleu', emoji: '🫐' },
            { id: 'douleur', label: 'Douleur', emoji: '🩹' },
            { id: 'autre', label: 'Autre', emoji: '💬' }
          ].map(tab => {
            const isActive = filterReaction === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterReaction(tab.id as ReactionType | 'toutes')}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#5E4B8B] bg-[#5E4B8B] text-white shadow-sm'
                    : 'border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]'
                } `}>
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
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
            {filterReaction === 'toutes'
              ? 'Vous n\'avez pas encore enregistré de saisie.'
              : 'Aucune injection avec ce type de réaction.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInjections.map(item => {
            const zoneInfo = ZONES_CONFIG.find(z => z.id === item.zone);
            const reaction = getReactionBadge(item.reaction_type);
            const dateObj = new Date(item.injected_at);

            return (
              <div
                key={item.id}
                className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm transition-all hover:border-[#D3C1E5]">
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
                      <p
                        className="text-[11px] font-medium text-[#8E8294] capitalize">
                        {dateObj.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Bouton de suppression */}
                  <button
                    type="button"
                    onClick={() => {
                      if (item.id && confirm('Supprimer cette entrée ?')) {
                        deleteInjection(item.id);
                      }
                    }}
                    className="rounded-lg p-1 text-[#8E8294] transition-colors hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Badge de Réaction & Détails */}
                <div
                  className="flex items-center justify-between gap-2 border-t border-[#F5EFE6] pt-2">
                  <span
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${reaction.bg}`}>
                    <span>{reaction.emoji}</span>
                    <span>Réaction : {reaction.label}</span>
                  </span>

                  {item.reaction_details && (
                    <span
                      className="max-w-[200px] truncate text-[11px] text-[#8E8294] italic">
                      « {item.reaction_details} »
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
