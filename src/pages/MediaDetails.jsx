/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: MediaDetails (Détails d'un film/série)
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Affiche la fiche complète d'un film ou d'une série.
 *   Utilisateur arrive ici en cliquant sur une MovieCard.
 *   URL: /film/:id ou /serie/:id
 *
 * DONNÉES (du loader):
 *   Le loader mediaDetailsLoader extrait l'ID de l'URL (:id)
 *   et récupère depuis TMDB:
 *   { media, recommendations }
 *   - media: Toutes les infos du film/série (titre, synopsis, casting, vidéo...)
 *   - recommendations: Films/séries similaires pour "À découvrir aussi"
 *
 * CONTENU AFFICHÉ:
 *   1. HEADER: Image de fond grande + dégradé
 *   2. AFFICHE: Poster 280px sur la gauche (col 1)
 *   3. DÉTAILS: Titre, note, année, genres, synopsis (col 2)
 *   4. CASTING: Acteurs avec leurs noms
 *   5. VIDÉO: Iframe YouTube de la bande-annonce (si existe)
 *   6. ACTIONS: Boutons "Regarder" et "Ajouter aux favoris"
 *   7. RECOMMANDATIONS: MediaRow avec films similaires
 *   8. LIEN RETOUR: Flèche pour revenir à la page précédente
 *
 * RESPONSIVE:
 *   Desktop: 2 colonnes (affiche | détails côte à côte)
 *   Mobile: 1 colonne (affiche en haut, détails en bas)
 *   Image backdrop: h-[60vh] responsive
 *
 * GESTION D'ERREUR:
 *   Si l'ID n'existe pas ou TMDB retourne 404 → le loader throw Response 404
 *   → React Router affiche l'errorElement (NotFound.jsx)
 *
 * POINTS D'APPRENTISSAGE:
 *   - Loader pattern: données chargées AVANT le composant
 *   - Error boundary: Try/catch au niveau du loader
 *   - Route params: useParams() extrairait l'ID (mais ici le loader le fait)
 *   - Image responsive: Affiche aspect 2/3 constant
 *   - Composition: Plein de petits éléments assemblés
 */
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaCalendar, FaTag } from "react-icons/fa6";
import Layout from "@/components/Layout.jsx";
import MediaRow from "@/components/MediaRow.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const MediaDetails = () => {
  const { media, recommendations } = useLoaderData();
  const navigate = useNavigate();
  const { isAuthenticated, toggleFavorite, isFavorite } = useAuth();

  const favorite = isFavorite(media.id);
  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/film/${media.id}` } });
      return;
    }
    toggleFavorite(media);
  };

  return (
    <Layout>
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={media.backdrop}
          alt={`Image de ${media.title}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-48 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <FaArrowLeft /> Retour
        </Link>

        <div className="grid md:grid-cols-[280px_1fr] gap-8 animate-fade-in">
          <img
            src={media.poster}
            alt={`Affiche de ${media.title}`}
            className="w-full max-w-[280px] mx-auto md:mx-0 rounded-lg shadow-card"
          />

          <div>
            <span className="inline-block px-3 py-1 rounded bg-primary/20 text-primary font-semibold uppercase text-xs mb-3">
              {media.type === "movie" ? "Film" : "Série"}
            </span>
            <h1 className="font-display text-4xl md:text-6xl tracking-wider mb-4">
              {media.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                <FaStar /> {media.rating.toFixed(1)} / 10
              </span>
              {media.year > 0 && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FaCalendar /> {media.year}
                </span>
              )}
              {media.genres.length > 0 && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FaTag /> {media.genres.join(", ")}
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl mb-2">Synopsis</h2>
            <p className="text-foreground/85 leading-relaxed mb-6 max-w-3xl">
              {media.overview}
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              <button
                onClick={handleFavorite}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition-smooth"
              >
                {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
              <Link
                to="/favoris"
                className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-5 py-3 text-sm font-semibold hover:bg-secondary/90 transition-smooth"
              >
                Voir mes favoris
              </Link>
            </div>

            {media.cast?.length > 0 && (
              <>
                <h2 className="font-display text-2xl mb-2">
                  Casting principal
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {media.cast.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full bg-secondary text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </>
            )}

            {media.trailerUrl && (
              <>
                <h2 className="font-display text-2xl mb-3">Bande-annonce</h2>
                <div className="aspect-video w-full max-w-3xl rounded-lg overflow-hidden shadow-card">
                  <iframe
                    src={media.trailerUrl}
                    title={`Bande-annonce de ${media.title}`}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-16">
            <MediaRow title="Vous aimerez aussi" items={recommendations} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MediaDetails;
