import { useState, useEffect, useCallback } from "react";
import { X, Play, AlertCircle, Loader2 } from "lucide-react";
import { fetchMediaDetails, parseInternalId } from "@/services/tmdb.js";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: VideoPlayer 
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Lecteur vidéo intégré dans une modal (popup).
 *   Affiche la bande-annonce YouTube officielle du film/série.
 *   S'affiche quand l'utilisateur clique sur "Regarder" dans une MovieCard.
 *
 * PROPS:
 *   - media (object): Données du film/série (titre, année, type, ID, etc.)
 *   - isOpen (bool): Si true, la modal s'affiche; si false, elle est cachée
 *   - onClose (function): Fonction appelée pour fermer la modal
 *
 * ÉTAT INTERNE:
 *   - trailerUrl: URL YouTube de la bande-annonce (ex: https://youtube.com/embed/xyz)
 *   - isLoading: true pendant le chargement, false après
 *   - error: Message d'erreur s'il y en a une
 *
 * FONCTIONNEMENT:
 *   1. Quand isOpen devient true, le hook useEffect appelle loadTrailer()
 *   2. loadTrailer() récupère les détails complets du film via TMDB API
 *   3. Si une bande-annonce existe, on affiche l'iframe YouTube
 *   4. Si pas de bande-annonce, on affiche un message sympathique
 *   5. Quand onClose est appelé (clique sur X ou fond), la modal se ferme
 *
 * POINTS D'APPRENTISSAGE:
 *   - Modal pattern: fixed + inset-0 pour remplir l'écran
 *   - Gestion asynchrone avec async/await
 *   - useCallback pour mémoriser la fonction loadTrailer
 *   - États multiples: loading, error, success
 *   - Appels API TMDB pour récupérer les vraies vidéos
 */
const VideoPlayer = ({ media, isOpen, onClose }) => {
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger la bande-annonce
  const loadTrailer = useCallback(async () => {
    if (!media) return;

    setIsLoading(true);
    setError(null);

    try {
      // Si le média a déjà une URL de bande-annonce, l'utiliser directement
      if (media.trailerUrl) {
        setTrailerUrl(media.trailerUrl);
        setIsLoading(false);
        return;
      }

      // Sinon, récupérer les détails complets depuis TMDB pour obtenir la bande-annonce
      const parsed = parseInternalId(media.id);
      if (!parsed) {
        throw new Error("ID du média invalide");
      }

      const fullMediaDetails = await fetchMediaDetails(
        parsed.type,
        parsed.tmdbId,
      );

      if (fullMediaDetails.trailerUrl) {
        setTrailerUrl(fullMediaDetails.trailerUrl);
      } else {
        throw new Error("Aucune bande-annonce disponible");
      }
    } catch (err) {
      setError(err.message || "Impossible de charger la bande-annonce");
    } finally {
      setIsLoading(false);
    }
  }, [media]);

  // Charger la bande-annonce quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && media) {
      loadTrailer();
    } else {
      // Réinitialiser l'état quand la modal se ferme
      setTrailerUrl(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, media, loadTrailer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Fond cliquable pour fermer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Contenu de la modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-card rounded-xl shadow-2xl overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              {media.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {media.type === "movie" ? "Film" : "Série"} · {media.year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Fermer le lecteur"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Zone vidéo */}
        <div className="relative bg-black aspect-video">
          {isLoading ? (
            /* État de chargement */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Chargement de la bande-annonce...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Recherche de "{media.title}"
              </p>
            </div>
          ) : error ? (
            /* Erreur de chargement */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
              <AlertCircle className="h-16 w-16 mb-4 text-red-400" />
              <h4 className="text-xl font-bold mb-2">Erreur de chargement</h4>
              <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={loadTrailer}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : trailerUrl ? (
            /* Lecteur YouTube intégré */
            <iframe
              src={trailerUrl}
              title={`Bande-annonce de ${media.title}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            /* Message quand pas de bande-annonce disponible */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
              <AlertCircle className="h-16 w-16 mb-4 text-muted-foreground" />
              <h4 className="text-xl font-bold mb-2">
                Bande-annonce non disponible
              </h4>
              <p className="text-muted-foreground mb-6 max-w-md">
                La bande-annonce de "{media.title}" n'est pas disponible pour le
                moment. Découvrez plus d'informations sur cette œuvre !
              </p>
              <div className="flex gap-3">
                <button
                  onClick={loadTrailer}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Rechercher
                </button>
                <a
                  href={`/${media.type === "movie" ? "film" : "serie"}/${media.id}`}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  onClick={onClose}
                >
                  Plus d'infos
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Informations supplémentaires */}
        <div className="p-4 bg-card">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              {media.rating.toFixed(1)}/10
            </span>
            {media.genres.length > 0 && (
              <span>{media.genres.slice(0, 2).join(", ")}</span>
            )}
          </div>
          {media.overview && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {media.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
