import MovieCard from "./MovieCard.jsx";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SOUS-COMPOSANT: GridSkeleton
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Affiche des "squelettes" (skeleton screens) lors du chargement des films.
 *   C'est un UX pattern moderne pour donner l'impression que le contenu se charge.
 *
 * PROPS:
 *   - count: nombre de squelettes à afficher (par défaut 12)
 *
 * POINTS D'APPRENTISSAGE:
 *   - Skeleton loading: meilleure expérience que "Chargement..."
 *   - Responsive grid: s'adapte du mobile (2 colonnes) au desktop (6 colonnes)
 */
const GridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
    ))}
  </div>
);

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: MediaGrid
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Affiche les films/séries dans une grille responsive.
 *   Utilisé sur les pages: Films, Séries, Recherche, Classiques.
 *   Gère 3 états: chargement, contenu, ou "aucun résultat".
 *
 * PROPS:
 *   - items (array): Tableau d'objets Media à afficher
 *   - isLoading (bool): Si true, affiche des squelettes pendant le chargement
 *
 * ÉTATS POSSIBLES:
 *   1. isLoading = true → Affiche 12 squelettes de cartes
 *   2. items vide → Message "Aucun résultat"
 *   3. items rempli → Grille de cartes MovieCard
 *
 * RESPONSIVE DESIGN:
 *   - Mobile (< 640px): 2 colonnes
 *   - Tablette (640-1024px): 3-4 colonnes
 *   - Desktop (1024px+): 5-6 colonnes
 *   Les espaces s'ajustent aussi (gap-4 sur mobile, md:gap-6 sur desktop)
 *
 * POINTS D'APPRENTISSAGE:
 *   - Pattern conditionnel: if isLoading, else if empty, else render
 *   - Grid classes Tailwind: grid-cols-2 sm:grid-cols-3 md:grid-cols-4...
 *   - Composants réutilisables: MovieCard est utilisée en boucle avec .map()
 */
const MediaGrid = ({ items, isLoading = false }) => {
  if (isLoading) return <GridSkeleton />;

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-3xl text-muted-foreground mb-2">
          Aucun résultat
        </p>
        <p className="text-sm text-muted-foreground">
          Essayez d'ajuster vos filtres pour découvrir plus de contenus.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-in">
      {items.map((m) => (
        <MovieCard key={m.id} media={m} />
      ))}
    </div>
  );
};

export default MediaGrid;
