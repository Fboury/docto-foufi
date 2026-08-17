// Type pour stocker les PRs de manière optimisée
export type PRMap = Record<string, { value: number; unit: string }>;

export const calculatePRs = (allWorkouts: any[]): PRMap => {
  const prs: PRMap = {};
  allWorkouts.forEach(w => {
    if (w.type === 'Strength' && Array.isArray(w.intervals)) {
      w.intervals.forEach((ex: any) => {
        const val = ex.mode === 'weight' ? ex.weight : ex.duration;
        const unit = ex.mode === 'weight' ? 'kg' : 's';
        if (!prs[ex.name] || val > prs[ex.name].value) {
          prs[ex.name] = { value: val, unit };
        }
      });
    }
  });
  return prs;
};
