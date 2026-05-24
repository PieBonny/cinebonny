import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Play, Info } from "lucide-react";
import VideoPlayer from "./VideoPlayer.jsx";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: MovieCard
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Affiche une CARTE représentant un film ou une série.
 *   C'est le composant le plus réutilisé du projet — partout où on voit des affiches!
 *   Utilisé dans: MediaGrid, MediaRow, pages Accueil, Recherche, etc.
 *
 * PROPS:
 *   - media (object): Données du film/série
 *   - featured (bool): Si true, la carte est 50% plus grande (pour les vedettes)
 *   - rank (number): Numéro de classement (1, 2, 3...) pour les "Top 10" par exemple
 *
 * ÉLÉMENTS AFFICHÉS:
 *   1. Affiche du film (image)
 *   2. Badge avec la note (étoile dorée + chiffre)
 *   3. Badge Type (Film/Série)
 *   4. Boutons d'action au survol:
 *      - Bouton Play = ouvre le VideoPlayer
 *      - Bouton Info = va à la page détails
 *   5. Titre + année + genre en bas (apparaît au survol)
 *   6. Numéro de rang en très gros (si rank fourni)
 *
 * INTERACTION:
 *   - Au survol (hover) sur desktop: boutons et infos apparaissent
 *   - Clic sur Play: ouvre la modal VideoPlayer
 *   - Clic sur Info: navigue vers la page détails du film
 *   - Sur mobile: les boutons restent visibles (pas de hover)
 *
 * RESPONSIVE:
 *   - Taille: w-36 (non-featured), w-48 (featured) sur mobile
 *   - Sur desktop: s'agrandit jusqu'à w-64
 *   - L'aspect-ratio 2/3 est toujours maintenu (format affiche cinema)
 *
 * POINTS D'APPRENTISSAGE:
 *   - Utilisation de group/card pour coordonner les styles au hover
 *   - State management simple: showVideoPlayer pour ouvrir/fermer la modal
 *   - Composition: MovieCard contient un VideoPlayer enfant
 *   - event.preventDefault/stopPropagation pour éviter la navigation accidentelle
 *   - Classes Tailwind avancées: group-hover/, line-clamp, aspect-ratio
 */
const MovieCard = ({ media, featured = false, rank }) => {
  // État pour contrôler l'ouverture du lecteur vidéo
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Taille de la carte selon si c'est un élément vedette ou non
  const widthClass = featured ? "w-48 sm:w-56 md:w-64" : "w-36 sm:w-40 md:w-44";

  return (
    <>
      <div className={`group/card relative shrink-0 ${widthClass}`}>
        {/* Numéro de classement pour les tops (style Netflix) */}
        {rank !== undefined && (
          <span
            aria-hidden
            className="absolute -left-3 -top-2 z-0 font-display text-[7rem] leading-none text-transparent select-none pointer-events-none"
            style={{
              WebkitTextStroke: "2px hsl(var(--primary))",
            }}
          >
            {rank}
          </span>
        )}

        {/* Conteneur principal de la carte */}
        <div className="relative z-10 block overflow-hidden rounded-xl bg-card shadow-card card-lift hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary">
          <div className="relative aspect-[2/3]">
            {/* Image de l'affiche */}
            <img
              src={media.poster}
              alt={`Affiche de ${media.title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-smooth group-hover/card:brightness-110"
            />

            {/* Fond dégradé qui apparaît au survol */}
            <div className="absolute inset-0 bg-gradient-card opacity-70 group-hover/card:opacity-100 transition-smooth" />

            {/* Badge avec la note (étoile dorée) */}
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2 py-0.5 text-xs font-bold">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span>{media.rating.toFixed(1)}</span>
            </div>

            {/* Badge indiquant si c'est un film ou une série */}
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary/90 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
              {media.type === "movie" ? "Film" : "Série"}
            </span>

            {/* Boutons d'action qui apparaissent au survol */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-smooth">
              <div className="flex gap-2">
                {/* Bouton Regarder - ouvre le lecteur vidéo intégré */}
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 backdrop-blur shadow-glow hover:bg-primary transition-colors"
                  aria-label={`Regarder ${media.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowVideoPlayer(true);
                  }}
                >
                  <Play className="h-5 w-5 fill-current text-primary-foreground translate-x-0.5" />
                </button>

                {/* Bouton Plus d'infos - vers la page détaillée */}
                <Link
                  to={`/${media.type === "movie" ? "film" : "serie"}/${media.id}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 backdrop-blur shadow-glow hover:bg-secondary transition-colors"
                  aria-label={`Plus d'infos sur ${media.title}`}
                >
                  <Info className="h-5 w-5 text-secondary-foreground" />
                </Link>
              </div>
            </div>

            {/* Informations en bas de la carte */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover/card:translate-y-0 transition-smooth">
              <h3 className="font-display text-lg leading-tight text-foreground line-clamp-2">
                {media.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {media.year || "—"}
                {media.genres[0] ? ` · ${media.genres[0]}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lecteur vidéo intégré */}
      <VideoPlayer
        media={media}
        isOpen={showVideoPlayer}
        onClose={() => setShowVideoPlayer(false)}
      />
    </>
  );
};

export default MovieCard;
