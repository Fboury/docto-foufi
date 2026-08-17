module.exports = {
    theme: {
        extend: {
            colors: {
                // Fond général de l'application (Beige crème très doux)
                app: {
                    bg: '#F5EFE6',
                    card: '#FFFFFF',
                    text: '#2D283E',
                    muted: '#8E8294',
                    border: '#E8DFD8'
                },
                // Lilas (Zone recommandée / Actions principales / Graphiques)
                lilas: {
                    bg: '#E5D9F2', // Fond tuiles recommandées (Lilas clair)
                    primary: '#9575CD', // Boutons principaux / Titres
                    dark: '#5E4B8B' // Texte sur lilas clair
                },
                // Beige / Sable (Zones récentes à éviter)
                sable: {
                    bg: '#EFE3C8', // Fond tuiles récents
                    border: '#DFC8A6',
                    dark: '#8C6D46'
                }
            }
        }
    }
};
