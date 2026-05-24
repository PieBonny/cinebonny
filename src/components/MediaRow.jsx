import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard.jsx";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: MediaRow
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Affiche une RANGÉE de films/séries avec défilement HORIZONTAL.
 *   Style inspiré Netflix: titre + carrousel d'affiches + boutons précédent/suivant.
 *   Utilisé sur l'accueil pour les sections: "Tendances", "Populaires", "À découvrir"...
 *
 * PROPS:
 *   - title (string): Titre de la section (ex: "Films en tendance")
 *   - items (array): Liste des films/séries à afficher
 *   - featured (bool): Si true, les cartes sont 50% plus grandes
 *   - isLoading (bool): Affiche des squelettes pendant le chargement
 *   - showRank (bool): Affiche le numéro (1, 2, 3...) pour les classements
 *   - seeMoreTo (string): Lien optionnel vers une page avec plus de contenu
 *
 * ARCHITECTURE:
 *   1. Titre avec petit trait coloré
 *   2. Bouton "Voir tout" qui apparaît au survol
 *   3. Carrousel horizontal avec scroll smooth
 *   4. Boutons précédent/suivant qui scrollent de 85% de la largeur
 *   5. Gestion du chargement avec squelettes
 *
 * DÉFILEMENT:
 *   - useRef pour garder une référence au conteneur scroll
 *   - Boutons qui calculent dynamiquement la distance à scroller
 *   - scroll behavior smooth pour une animation fluide
 *
 * RESPONSIVE:
 *   - Boutons navigation cachés sur mobile (hidden md:flex)
 *   - Apparaissent seulement au survol desktop (opacity-0 group-hover:opacity-100)
 *   - Sur mobile: défilement tactile natif avec doigt
 *
 * POINTS D'APPRENTISSAGE:
 *   - useRef pour accéder directement au DOM (element.scrollBy)
 *   - Carrousel horizontal: overflow-x-auto + flex
 *   - Squelettes de chargement réutilisables
 *   - Props optionnels avec || pour les valeurs par défaut
 */

const MediaRow = ({
  title,
  items,
  featured = false,
  isLoading = false,
  showRank = false,
  seeMoreTo,
}) => {
  // Référence pour contrôler le défilement horizontal
  const scrollerRef = useRef(null);

  // Fonction pour faire défiler vers la gauche ou la droite
  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;

    // Calcule la distance de défilement (85% de la largeur visible)
    const amount = el.clientWidth * 0.85;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // Pendant le chargement, on affiche des squelettes
  if (isLoading) {
    return (
      <section className="relative py-6">
        <div className="container mx-auto px-4 lg:px-8 mb-3">
          {/* Titre simulé en squelette */}
          <div className="h-8 w-64 skeleton rounded" />
        </div>
        <div className="flex gap-3 md:gap-4 px-4 lg:px-8">
          {/* 8 cartes squelettes */}
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} featured={featured} />
          ))}
        </div>
      </section>
    );
  }

  // Si pas de contenu, on n'affiche rien
  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-6 group/row">
      {/* En-tête de la section */}
      <div className="container mx-auto px-4 lg:px-8 mb-3 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl md:text-3xl tracking-wide flex items-center gap-3">
          {/* Petit trait coloré avant le titre */}
          <span className="inline-block h-7 w-1.5 rounded bg-gradient-red" />
          {title}
        </h2>

        {/* Lien "Voir tout" qui apparaît au survol */}
        {seeMoreTo && (
          <Link
            to={seeMoreTo}
            className="text-sm text-muted-foreground hover:text-primary transition-smooth inline-flex items-center gap-1 opacity-0 group-hover/row:opacity-100"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Zone de défilement avec boutons de navigation */}
      <div className="relative">
        {/* Bouton précédent */}
        <button
          onClick={() => scroll("left")}
          aria-label="Précédent"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover/row:opacity-100 transition-smooth hover:bg-primary hover:text-primary-foreground shadow-card"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Conteneur scrollable des cartes */}
        <div
          ref={scrollerRef}
          className={`no-scrollbar flex gap-3 md:gap-4 overflow-x-auto scroll-smooth px-4 lg:px-8 ${
            showRank ? "pl-10 lg:pl-14 pb-8 pt-2" : "pb-4"
          }`}
        >
          {items.map((m, idx) => (
            <MovieCard
              key={m.id}
              media={m}
              featured={featured}
              rank={showRank ? idx + 1 : undefined}
            />
          ))}
        </div>

        {/* Bouton suivant */}
        <button
          onClick={() => scroll("right")}
          aria-label="Suivant"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover/row:opacity-100 transition-smooth hover:bg-primary hover:text-primary-foreground shadow-card"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

/**
 * Petit composant pour afficher un squelette de carte pendant le chargement.
 */
const CardSkeleton = ({ featured }) => (
  <div
    className={`shrink-0 ${
      featured ? "w-48 sm:w-56 md:w-64" : "w-36 sm:w-40 md:w-44"
    } aspect-[2/3] rounded-xl skeleton`}
  />
);

export default MediaRow;
