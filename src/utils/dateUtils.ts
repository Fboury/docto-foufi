import {endOfWeek, startOfWeek} from 'date-fns';

// Exemple d'utilisation pour obtenir la plage de dates
export const getWeekRange = (date: Date) => {
    const start = startOfWeek(date, {weekStartsOn: 1}); // 1 = Lundi
    const end = endOfWeek(date, {weekStartsOn: 1});
    return {start, end};
};