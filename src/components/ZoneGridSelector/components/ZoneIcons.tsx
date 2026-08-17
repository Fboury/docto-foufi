export const ArmIcon = () => (
  <svg
    className="h-5 w-5 fill-current"
    viewBox="0 0 24 24">
    {/* Silhouette simplifiée de bras / biceps */}
    <path d="M18 15c-1.1 0-2-.9-2-2 0-1.5 1.5-2.5 2-4 .5 1.5 2 2.5 2 4 0 1.1-.9 2-2 2zm-8-3c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0 2c3 0 6 1.5 6 4.5V20H4v-1.5c0-3 3-4.5 6-4.5z" />
  </svg>
);

export const AbdomenIcon = ({ position }: { position?: 'hd' | 'hg' | 'bd' | 'bg' }) => (
  <svg
    className="h-5 w-5 fill-current"
    viewBox="0 0 24 24">
    {/* Quadrillage / Abdomen avec point localisé */}
    <rect
      x="5"
      y="4"
      width="14"
      height="16"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="12"
      y1="4"
      x2="12"
      y2="20"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    {/* Marqueur selon le quadrant */}
    {position === 'hd' && (
      <circle
        cx="8.5"
        cy="8"
        r="2"
        fill="currentColor"
      />
    )}
    {position === 'hg' && (
      <circle
        cx="15.5"
        cy="8"
        r="2"
        fill="currentColor"
      />
    )}
    {position === 'bd' && (
      <circle
        cx="8.5"
        cy="16"
        r="2"
        fill="currentColor"
      />
    )}
    {position === 'bg' && (
      <circle
        cx="15.5"
        cy="16"
        r="2"
        fill="currentColor"
      />
    )}
  </svg>
);

export const ThighIcon = () => (
  <svg
    className="h-5 w-5 fill-current"
    viewBox="0 0 24 24">
    {/* Silhouette de jambe / cuisse */}
    <path d="M9 2h6v8c0 3.31-2.69 6-6 6H7V2h2zm0 16h2v4H9v-4z" />
  </svg>
);

export const FlankIcon = () => (
  <svg
    className="h-5 w-5 fill-current"
    viewBox="0 0 24 24">
    {/* Silhouette des hanches / flanc */}
    <path d="M12 2C8 2 5 6 5 12s2 10 7 10 7-4 7-10-3-10-7-10zm-3 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
  </svg>
);
