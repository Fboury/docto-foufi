// Fonction à placer dans un fichier utils ou en haut de ta page
// On précise ici que la fonction renvoie un objet de type ParsedZwo
export const parseZwoToSegments = (xmlString: string): ParsedZwo => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Récupération de la description
  const descriptionNode = xmlDoc.getElementsByTagName('description')[0];
  const description = descriptionNode?.textContent || '';

  // Récupération du nom (optionnel, mais utile)
  const nameNode = xmlDoc.getElementsByTagName('name')[0];
  const name = nameNode?.textContent || '';

  const workoutNode = xmlDoc.getElementsByTagName('workout')[0];

  // Si pas de workout, on renvoie quand même la structure attendue
  if (!workoutNode) return { segments: [], description: '', name: '' };

  const parsedSegments: any[] = [];
  const children = Array.from(workoutNode.children);

  children.forEach(node => {
    const type = node.nodeName;

    if (type === 'IntervalsT') {
      parsedSegments.push({
        tempId: crypto.randomUUID(),
        type: 'IntervalsT',
        repeat: parseInt(node.getAttribute('Repeat') || '1'),
        onDuration: parseInt(node.getAttribute('OnDuration') || '0'),
        offDuration: parseInt(node.getAttribute('OffDuration') || '0'),
        onPower: parseFloat(node.getAttribute('OnPower') || '0'),
        offPower: parseFloat(node.getAttribute('OffPower') || '0'),
        cadence: parseInt(node.getAttribute('Cadence') || '90')
      });
    } else {
      parsedSegments.push({
        tempId: crypto.randomUUID(),
        type: type,
        duration: parseInt(node.getAttribute('Duration') || '0'),
        powerLow: parseFloat(node.getAttribute('PowerLow') || node.getAttribute('Power') || '0'),
        powerHigh: parseFloat(node.getAttribute('PowerHigh') || node.getAttribute('Power') || '0'),
        cadence: parseInt(node.getAttribute('Cadence') || '90')
      });
    }
  });

  return { segments: parsedSegments, description, name };
};
export interface ParsedZwo {
  segments: any[];
  description: string;
  name?: string; // Optionnel : si tu veux aussi récupérer le nom
}
