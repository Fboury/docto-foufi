// Formatage de l'heure (ex: 19h30)
export const formatTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}h${minutes}`;
};

// Formatage de la date (ex: 19 août 2026)
export const formatDate = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC' // Force la lecture UTC sans décalage
  });
};
