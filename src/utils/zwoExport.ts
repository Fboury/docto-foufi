import { WorkoutInterval } from './ProgramGenerator';

/**
 * Nettoie le texte pour éviter les erreurs de parsing XML (MyWhoosh)
 */
const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&"']/g, m => {
    switch (m) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return m;
    }
  });
};

export const generateZWO = (title: string, description: string, intervals: WorkoutInterval[]) => {
  if (!intervals || !Array.isArray(intervals)) return '';

  // On nettoie les textes pour le XML
  const cleanTitle = escapeXml(title || 'Séance Gemini');
  const cleanDescription = escapeXml(description || 'Bonne séance !');

  const xmlHeader = `<workout_file>
    <author>Gemini-Equipier</author>
    <name>${cleanTitle}</name>
    <description>${cleanDescription}</description>
    <sportType>bike</sportType>
    <workout>`;

  const xmlFooter = `
    </workout>
</workout_file>`;

  const xmlBody = intervals
    .map(interval => {
      const duration = interval.duration || 60;

      // Utilisation des clés powerLow et powerHigh alignées sur le ProgramGenerator
      const pLow = typeof interval.powerLow === 'number' ? interval.powerLow.toFixed(2) : '0.50';
      const pHigh = typeof interval.powerHigh === 'number' ? interval.powerHigh.toFixed(2) : '0.50';
      const cadence = interval.cadence ? ` Cadence="${interval.cadence}"` : '';

      switch (interval.type) {
        case 'Warmup':
          return `\n        <Warmup Duration="${duration}" PowerLow="${pLow}" PowerHigh="${pHigh}"${cadence} />`;

        case 'Cooldown':
          return `\n        <Cooldown Duration="${duration}" PowerLow="${pLow}" PowerHigh="${pHigh}"${cadence} />`;

        case 'SteadyState':
        default:
          // Pour un intervalle de travail stable, MyWhoosh utilise la balise Power
          return `\n        <SteadyState Duration="${duration}" Power="${pHigh}"${cadence} />`;
      }
    })
    .join('');

  return `${xmlHeader}${xmlBody}${xmlFooter}`;
};

export const copyZWOToClipboard = async (title: string, description: string, intervals: WorkoutInterval[]) => {
  const zwoContent = generateZWO(title, description, intervals);

  if (!zwoContent) return false;

  try {
    await navigator.clipboard.writeText(zwoContent);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie :', err);
    return false;
  }
};
