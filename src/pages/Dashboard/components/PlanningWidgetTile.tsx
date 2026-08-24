import React, { useState } from 'react';
import { Calendar, Minus, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { usePlannedInjections } from '../../../hooks/usePlannedInjections';
import { useInjections } from '../../../hooks/useInjections';
import { InjectionZone, ZONES_CONFIG } from '../../../types/injection';

export const PlanningWidgetTile: React.FC = () => {
  const {
    plannedInjections,
    reservedZoneIds,
    addPlannedInjection,
    deletePlannedInjection,
    loading: loadingPlanned
  } =
    usePlannedInjections();
  const { zonesWithStats, loading: loadingInjections } = useInjections();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Sélectionne par défaut la première zone qui n'est pas encore réservée
  const defaultAvailableZone = ZONES_CONFIG.find(z => !reservedZoneIds.includes(z.id))?.id || 'ventre_hg';
  const [selectedZone, setSelectedZone] = useState<InjectionZone>(defaultAvailableZone);
  const [note, setNote] = useState('');

  if (loadingPlanned || loadingInjections) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPlannedInjection(selectedDate, selectedZone, note);
    setIsAdding(false);
    setNote('');
  };

  return (
    <div
      className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-xs">
      {/* En-tête avec bouton conditionnel Plus / Minus */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5EFE6] text-[#5E4B8B]">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-[#2D283E]">
            Planning & Réservations
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 text-xs font-bold text-[#5E4B8B] transition-colors hover:text-[#4A3B70]">
          {isAdding ? (
            <>
              <Minus className="h-4 w-4" />
              <span>Fermer</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Réserver</span>
            </>
          )}
        </button>
      </div>

      {/* Formulaire de réservation intelligente */}
      {isAdding && (
        <form onSubmit={handleSave}
              className="space-y-3 border-t border-[#F5EFE6] pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-[#8E8294]">Date
                :</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border border-[#E8DFD8] bg-[#F5EFE6] p-2 text-xs font-bold text-[#2D283E]"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#8E8294]">Zone à
                bloquer :</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value as InjectionZone)}
                className="w-full rounded-xl border border-[#E8DFD8] bg-[#F5EFE6] p-2 text-xs font-bold text-[#2D283E]">
                {ZONES_CONFIG.map((z) => {
                  const stat = zonesWithStats.find((s) => s.id === z.id);
                  const isReserved = reservedZoneIds.includes(z.id);

                  // Texte de l'historique de repos
                  const daysAgoText =
                    stat?.daysAgo === null || stat?.daysAgo === undefined
                      ? 'Jamais'
                      : `il y a ${stat.daysAgo}j`;

                  return (
                    <option key={z.id} value={z.id} disabled={isReserved}>
                      {z.emoji} {z.shortLabel} — {daysAgoText} {isReserved ? '🔒 (Déjà réservée)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Motif (ex: Séance d'équitation, Course...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-[#E8DFD8] bg-[#F5EFE6] p-2 text-xs text-[#2D283E]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#5E4B8B] py-2 text-xs font-bold text-white shadow-xs hover:bg-[#4A3B70]">
            Bloquer cette zone
          </button>
        </form>
      )}

      {/* Liste des réservations actives */}
      <div className="space-y-2 pt-1">
        {plannedInjections.length === 0 ? (
          <p className="text-center text-xs text-[#8E8294] py-1">
            Aucune zone réservée à venir.
          </p>
        ) : (
          plannedInjections.map((p) => {
            const zoneInfo = ZONES_CONFIG.find((z) => z.id === p.zone);
            const stat = zonesWithStats.find((s) => s.id === p.zone);

            const formattedDate = new Date(p.planned_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            });

            const daysAgoText =
              stat?.daysAgo === null || stat?.daysAgo === undefined
                ? 'Jamais utilisée'
                : `Dernière piqûre : il y a ${stat.daysAgo} j`;

            return (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2D283E]">
                      {formattedDate} — {zoneInfo?.emoji} {zoneInfo?.fullLabel}
                    </span>
                    <p className="text-[10px] font-medium text-[#5E4B8B]">
                      {daysAgoText} {p.note ? `• « ${p.note} »` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deletePlannedInjection(p.id)}
                  className="text-[#8E8294] hover:text-rose-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};