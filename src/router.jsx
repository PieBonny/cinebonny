/**
 * Configuration des routes de l'application CineBonny.
 *
 * Ce fichier définit toutes les pages de l'application et comment
 * charger leurs données. On utilise React Router v6 avec le système
 * de "loaders" qui permet de charger les données avant d'afficher
 * la page (pas besoin de useEffect pour récupérer les données).
 *
 * Chaque route peut avoir :
 * - element : le composant React à afficher
 * - loader : fonction qui charge les données nécessaires
 * - action : fonction qui traite les formulaires
 */
import { createBrowserRouter, redirect } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import MediaDetails from "./pages/MediaDetails.jsx";
import Search from "./pages/Search.jsx";
import TmdbJson from "./pages/TmdbJson.jsx";
import Reviews from "./pages/Reviews.jsx";
import ReviewDetail from "./pages/ReviewDetail.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Favorites from "./pages/Favorites.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularSeries,
  fetchTopRatedMovies,
  fetchTopRatedSeries,
  searchMedia,
  discoverMedia,
  fetchMediaDetails,
  fetchRecommendations,
  fetchGenres,
  getGenreId,
  parseInternalId,
} from "@/services/tmdb.js";
import {
  fetchReviews,
  fetchReview,
  createReview,
  updateReview,
  deleteReview,
} from "@/services/reviews.js";

// ─── FONCTIONS DE CHARGEMENT DES DONNÉES ──────────────────────────────────────

/**
 * Charge les données pour la page d'accueil :
 * tendances, films populaires, séries populaires, etc.
 */
async function homeLoader() {
  const [trending, popularMovies, popularSeries, topMovies, topSeries] =
    await Promise.all([
      fetchTrending("all"),
      fetchPopularMovies(),
      fetchPopularSeries(),
      fetchTopRatedMovies(),
      fetchTopRatedSeries(),
    ]);
  return { trending, popularMovies, popularSeries, topMovies, topSeries };
}

/**
 * Charge les données pour une page de catalogue (films/séries/classiques).
 * Gère les filtres depuis l'URL : genre, année, note minimale, page.
 */
function makeCatalogLoader({ forcedType, forcedYear }) {
  return async ({ request }) => {
    // Lecture des paramètres depuis l'URL
    const url = new URL(request.url);
    const type = forcedType ?? url.searchParams.get("type") ?? "movie";
    const year = forcedYear ?? url.searchParams.get("year") ?? "all";
    const genre = url.searchParams.get("genre") ?? "all";
    const minRating = Number(url.searchParams.get("minRating") ?? 0);
    const page = Number(url.searchParams.get("page") ?? 1);

    // Récupération de l'ID du genre sélectionné
    const genreId = genre !== "all" ? await getGenreId(genre) : undefined;
    const allGenres = await fetchGenres();

    // Pour la pagination "Voir plus" : on charge plusieurs pages d'un coup
    const pages = await Promise.all(
      Array.from({ length: page }, (_, i) =>
        discoverMedia(type, {
          yearMode: year,
          genreId,
          minRating: minRating || undefined,
          page: i + 1,
        }),
      ),
    );
    const items = pages.flatMap((p) => p.items);
    const totalPages = pages[0]?.totalPages ?? 1;

    return {
      items,
      filters: { type, year, genre, minRating },
      page,
      hasMore: page < totalPages,
      genres: allGenres,
    };
  };
}

/**
 * Charge les détails d'un film/série + recommandations.
 */
async function mediaDetailsLoader({ params }) {
  // Conversion de l'ID interne vers l'ID TMDB
  const parsed = parseInternalId(params.id);
  if (!parsed) {
    throw new Response("Film ou série introuvable", { status: 404 });
  }

  // Chargement en parallèle des détails et recommandations
  const [media, recommendations] = await Promise.all([
    fetchMediaDetails(parsed.type, parsed.tmdbId),
    fetchRecommendations(parsed.type, parsed.tmdbId).catch(() => []),
  ]);
  return { media, recommendations };
}

/**
 * Charge les résultats de recherche depuis le paramètre ?q=...
 */
async function searchLoader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const items = q.trim() ? await searchMedia(q) : [];
  return { q, items };
}

/**
 * Charge la liste des avis, triés du plus récent au plus ancien.
 */
async function reviewsLoader() {
  const reviews = await fetchReviews();
  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return { reviews };
}

/**
 * Charge un avis spécifique pour la page de détail.
 */
async function reviewLoader({ params }) {
  const review = await fetchReview(params.id);
  if (!review) throw new Response("Avis introuvable", { status: 404 });
  return review;
}

// ─── FONCTIONS DE TRAITEMENT DES FORMULAIRES ──────────────────────────────────

/**
 * Traite la soumission du formulaire de création d'avis.
 * Après création, redirige automatiquement vers la liste.
 */
async function createReviewAction({ request }) {
  const formData = await request.formData();
  await createReview({
    mediaId: `custom-${Date.now()}`, // ID temporaire
    mediaTitle: String(formData.get("mediaTitle") ?? "").trim(),
    author: String(formData.get("author") ?? "Anonyme"),
    rating: Number(formData.get("rating") ?? 8),
    comment: String(formData.get("comment") ?? "").trim(),
  });
  return { ok: true, message: "Avis publié avec succès ! ✨" };
}

/**
 * Traite la modification d'un avis existant.
 */
async function updateReviewAction({ request, params }) {
  const formData = await request.formData();
  await updateReview(params.id, {
    rating: Number(formData.get("rating")),
    comment: String(formData.get("comment") ?? "").trim(),
  });
  return redirect(`/avis/${params.id}`);
}

/**
 * Traite la suppression d'un avis puis redirige vers la liste.
 */
async function deleteReviewAction({ params }) {
  await deleteReview(params.id);
  return redirect("/avis");
}

// ─── DÉFINITION DES ROUTES ────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: homeLoader,
    errorElement: <NotFound />,
  },
  {
    path: "/films",
    element: (
      <Catalog
        title="Films"
        subtitle="Découvrez notre sélection de films du moment."
      />
    ),
    loader: makeCatalogLoader({ forcedType: "movie" }),
  },
  {
    path: "/series",
    element: (
      <Catalog
        title="Séries"
        subtitle="Les meilleures séries TV à ne pas manquer."
      />
    ),
    loader: makeCatalogLoader({ forcedType: "series" }),
  },
  {
    path: "/classiques",
    element: (
      <Catalog
        title="Classiques"
        subtitle="Les films qui ont marqué l'histoire du cinéma."
      />
    ),
    loader: makeCatalogLoader({ forcedYear: "classic" }),
  },
  { path: "/film/:id", element: <MediaDetails />, loader: mediaDetailsLoader },
  { path: "/serie/:id", element: <MediaDetails />, loader: mediaDetailsLoader },
  { path: "/recherche", element: <Search />, loader: searchLoader },
  { path: "/tmdb-json", element: <TmdbJson /> },

  // Routes pour les avis (CRUD complet)
  {
    path: "/avis",
    element: <Reviews />,
    loader: reviewsLoader,
    action: createReviewAction, // POST → création
  },
  {
    path: "/avis/:id",
    element: <ReviewDetail />,
    loader: reviewLoader,
  },
  {
    path: "/avis/:id/edit",
    action: updateReviewAction, // PATCH → modification
  },
  {
    path: "/avis/:id/delete",
    action: deleteReviewAction, // DELETE → suppression + redirection
  },

  { path: "/login", element: <Login /> },
  { path: "/profil", element: <Profile /> },
  { path: "/favoris", element: <Favorites /> },
  { path: "/admin", element: <Admin /> },
  { path: "*", element: <NotFound /> },
]);
