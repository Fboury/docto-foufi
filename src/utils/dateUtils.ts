// Formatage de l'heure locale (ex: 21h56)
export const formatTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}h${minutes}`;
};

// Formatage de la date locale (ex: 24 août 2026)
export const formatDate = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Formatage combiné Date + Heure (ex: 24 août à 21h56)
export const formatDateWithTime = (isoString: string): string => {
  if (!isoString) return '';
  return `${formatDate(isoString)} à ${formatTime(isoString)}`;
};
