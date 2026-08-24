import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { InjectionEntry, ZONES_CONFIG } from '../../../types/injection';

export interface PlannedInjectionItem {
  id: string;
  planned_date?: string;
  date?: string;
  zone: string;
  note?: string;
}

interface InjectionCalendarProps {
  injections: InjectionEntry[];
  plannedInjections?: PlannedInjectionItem[];
  onSelectDate?: (dateStr: string) => void;
}

export const InjectionCalendar: React.FC<InjectionCalendarProps> = ({
                                                                      injections = [],
                                                                      plannedInjections = [],
                                                                      onSelectDate
                                                                    }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startingDayIndex = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const monthName = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  // Formatage garanti YYYY-MM-DD
  const toLocalYMD = (dateInput?: string | Date): string => {
    if (!dateInput) return '';

    if (typeof dateInput === 'string') {
      const cleanStr = dateInput.trim();
      if (/^\d{4}-\d{2}-\d{2}/.test(cleanStr)) {
        return cleanStr.slice(0, 10);
      }
    }

    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Indexation des faites
  const doneByDate: Record<string, InjectionEntry[]> = {};
  injections.forEach(item => {
    const key = toLocalYMD(item.injected_at);
    if (key) {
      if (!doneByDate[key]) doneByDate[key] = [];
      doneByDate[key].push(item);
    }
  });

  // Indexation des planifiées
  const plannedByDate: Record<string, PlannedInjectionItem[]> = {};
  plannedInjections.forEach(item => {
    const rawDate = item.planned_date || item.date;
    const key = toLocalYMD(rawDate);
    if (key) {
      if (!plannedByDate[key]) plannedByDate[key] = [];
      plannedByDate[key].push(item);
    }
  });

  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div
      className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-[#5E4B8B]" />
          <h3
            className="font-serif text-sm font-bold text-[#2D283E] capitalize">{monthName}</h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-full p-1 text-[#8E8294] transition-colors hover:bg-[#F5EFE6] hover:text-[#5E4B8B]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-full p-1 text-[#8E8294] transition-colors hover:bg-[#F5EFE6] hover:text-[#5E4B8B]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((day, idx) => (
          <div
            key={`${day}-${idx}`}
            className="py-0.5 text-[10px] font-bold text-[#8E8294]">
            {day}
          </div>
        ))}

        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-10"
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

          const doneList = doneByDate[dateKey] || [];
          const plannedList = plannedByDate[dateKey] || [];

          const isToday = toLocalYMD(new Date()) === dateKey;
          const hasDone = doneList.length > 0;
          const hasPlanned = plannedList.length > 0;

          // Styles dynamique
          let tileBgClass = 'bg-[#F5EFE6]/30 text-[#2D283E] hover:bg-[#F5EFE6]';
          if (isToday) {
            tileBgClass = 'bg-[#5E4B8B] text-white font-bold shadow-xs';
            if (hasPlanned && !hasDone) {
              tileBgClass += ' border-2 border-dashed border-white';
            }
          } else if (hasPlanned && !hasDone) {
            tileBgClass = 'border border-dashed border-[#5E4B8B] bg-[#F5EFE6]/80 text-[#2D283E] font-semibold';
          }

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => onSelectDate?.(dateKey)}
              className={`relative flex h-10 flex-col items-center justify-between rounded-xl p-1 transition-all ${tileBgClass}`}>
              <span className="text-[11px] leading-none">{dayNum}</span>

              {/* Indicators */}
              <div className="flex items-center gap-0.5 leading-none">
                {hasDone
                  ? doneList.map(inj => {
                    const zone = ZONES_CONFIG.find(z => z.id === inj.zone);
                    return (
                      <span
                        key={inj.id}
                        className="text-[10px]">
                          {zone?.emoji || '💉'}
                        </span>
                    );
                  })
                  : hasPlanned
                    ? plannedList.map(pInj => {
                      const zone = ZONES_CONFIG.find(z => z.id === pInj.zone);
                      return (
                        <span
                          key={pInj.id}
                          className={`text-[9px] ${isToday ? 'opacity-90' : ''}`}
                          title="Planifiée">
                            {zone?.emoji || '📍'}
                          </span>
                      );
                    })
                    : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div
        className="flex items-center justify-around border-t border-[#F5EFE6] pt-2 text-[10px] text-[#8E8294]">
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#5E4B8B]" />
          <span>Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="h-2.5 w-2.5 rounded-md border border-dashed border-[#5E4B8B] bg-[#F5EFE6]" />
          <span>Planifiée</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💉</span>
          <span>Faite</span>
        </div>
      </div>
    </div>
  );
};
