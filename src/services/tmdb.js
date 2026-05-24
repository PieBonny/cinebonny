/**
 * Service pour communiquer avec l'API TMDB (The Movie Database).
 *
 * Ce fichier gère toutes les interactions avec TMDB :
 * - Recherche de films et séries
 * - Récupération des détails
 * - Gestion des genres et tendances
 *
 * Les données TMDB sont transformées dans un format simple
 * que notre application peut utiliser facilement.
 *
 * Format de sortie pour un film/série :
 * {
 *   id: "m123" ou "s456",     // Notre identifiant interne
 *   type: "movie" ou "series",
 *   title: "Le titre du film",
 *   year: 2023,               // Année de sortie
 *   rating: 8.5,              // Note sur 10
 *   genres: ["Action", "Aventure"],
 *   overview: "Synopsis du film...",
 *   poster: "url de l'affiche",
 *   backdrop: "url de l'image de fond"
 * }
 */

// --- Configuration ---------------------------------------------------------

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

/**
 * Clé API TMDB v3 (publique côté client — TMDB l'autorise pour les apps front).
 * Pour ce projet pédagogique on l'embarque directement dans le code ; en
 * production on passerait par une variable d'environnement ou une edge function.
 */
const API_KEY = "876c5fc9ecee0ba8b0baa598053c8836";

/** Construit une URL d'image TMDB ou renvoie un placeholder si chemin null. */
export const tmdbImg = (path, size = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";

/** Wrapper fetch avec gestion d'auth (api_key en query) et d'erreurs. */
async function tmdb(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "fr-FR");
  for (const [k, v] of Object.entries(params))
    url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`TMDB ${res.status} ${res.statusText} pour ${path}`);
  }
  return res.json();
}

// --- Cache des genres (1 seule fois par session) ---------------------------

let genreCache = null;

async function loadGenres() {
  if (genreCache) return genreCache;
  const [movies, tv] = await Promise.all([
    tmdb("/genre/movie/list"),
    tmdb("/genre/tv/list"),
  ]);
  const map = {};
  [...movies.genres, ...tv.genres].forEach((g) => (map[g.id] = g.name));
  genreCache = map;
  return map;
}

// --- Mappers : TMDB -> format Media interne -------------------------------

function toMedia(item, type, genreMap) {
  const date = item.release_date ?? item.first_air_date ?? "";
  return {
    id: `${type === "movie" ? "m" : "s"}${item.id}`,
    type,
    title: item.title ?? item.name ?? "Sans titre",
    year: date ? Number(date.slice(0, 4)) : 0,
    rating: Math.round(item.vote_average * 10) / 10,
    genres: (item.genre_ids ?? []).map((id) => genreMap[id]).filter(Boolean),
    overview: item.overview || "Pas de synopsis disponible.",
    poster: tmdbImg(item.poster_path, "w500"),
    backdrop: tmdbImg(item.backdrop_path, "original"),
  };
}

function detailsToMedia(item, type) {
  const date = item.release_date ?? item.first_air_date ?? "";
  const videos = item.videos?.results ?? [];
  const trailer =
    videos.find(
      (v) =>
        v.site === "YouTube" &&
        [
          "Trailer",
          "Teaser",
          "Featurette",
          "Clip",
          "Behind the Scenes",
        ].includes(v.type),
    ) || videos.find((v) => v.site === "YouTube");

  return {
    id: `${type === "movie" ? "m" : "s"}${item.id}`,
    type,
    title: item.title ?? item.name ?? "Sans titre",
    year: date ? Number(date.slice(0, 4)) : 0,
    rating: Math.round(item.vote_average * 10) / 10,
    genres: item.genres.map((g) => g.name),
    overview: item.overview || "Pas de synopsis disponible.",
    poster: tmdbImg(item.poster_path, "w500"),
    backdrop: tmdbImg(item.backdrop_path, "original"),
    trailerUrl: trailer
      ? `https://www.youtube.com/embed/${trailer.key}`
      : undefined,
    cast: item.credits?.cast.slice(0, 8).map((c) => c.name),
  };
}

// --- API publique du module ------------------------------------------------

/** Tendances de la semaine (mix films + séries). */
export async function fetchTrending(type = "all") {
  const genres = await loadGenres();
  const data = await tmdb(`/trending/${type}/week`);
  return data.results
    .filter(
      (r) => !r.media_type || r.media_type === "movie" || r.media_type === "tv",
    )
    .map((r) => {
      const t =
        r.media_type === "tv" ? "series" : type === "tv" ? "series" : "movie";
      return toMedia(r, t, genres);
    });
}

export async function fetchPopularMovies(page = 1) {
  const genres = await loadGenres();
  const data = await tmdb("/movie/popular", { page });
  return data.results.map((r) => toMedia(r, "movie", genres));
}

export async function fetchPopularSeries(page = 1) {
  const genres = await loadGenres();
  const data = await tmdb("/tv/popular", { page });
  return data.results.map((r) => toMedia(r, "series", genres));
}

export async function fetchTopRatedMovies(page = 1) {
  const genres = await loadGenres();
  const data = await tmdb("/movie/top_rated", { page });
  return data.results.map((r) => toMedia(r, "movie", genres));
}

export async function fetchTopRatedSeries(page = 1) {
  const genres = await loadGenres();
  const data = await tmdb("/tv/top_rated", { page });
  return data.results.map((r) => toMedia(r, "series", genres));
}

/** Récupère les données brutes d'un endpoint TMDB sans transformation. */
export async function fetchRawTmdb(path, params = {}) {
  return tmdb(path, params);
}

/** Recherche multi (films + séries). */
export async function searchMedia(query) {
  if (!query.trim()) return [];
  const genres = await loadGenres();
  const data = await tmdb("/search/multi", { query, include_adult: "false" });
  return data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => toMedia(r, r.media_type === "tv" ? "series" : "movie", genres));
}

/**
 * Découverte avec filtres (genre / époque / note).
 * @param {"movie"|"series"} type
 * @param {{ genreId?: number, yearMode?: "recent"|"classic"|"all", minRating?: number, page?: number }} opts
 * @returns {Promise<{ items: Media[], page: number, totalPages: number }>}
 */
export async function discoverMedia(type, opts = {}) {
  const genres = await loadGenres();
  const params = {
    sort_by: "popularity.desc",
    include_adult: "false",
    page: opts.page ?? 1,
  };
  if (opts.genreId) params.with_genres = opts.genreId;
  if (opts.minRating) params["vote_average.gte"] = opts.minRating;

  const dateKey = type === "movie" ? "primary_release_date" : "first_air_date";
  if (opts.yearMode === "recent") params[`${dateKey}.gte`] = "2015-01-01";
  if (opts.yearMode === "classic") params[`${dateKey}.lte`] = "2014-12-31";

  const path = type === "movie" ? "/discover/movie" : "/discover/tv";
  const data = await tmdb(path, params);
  return {
    items: data.results.map((r) => toMedia(r, type, genres)),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500), // TMDB limite à 500 pages
  };
}

/** Détails complets (avec vidéos + casting). */
export async function fetchMediaDetails(type, tmdbId) {
  const path = type === "movie" ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;
  const data = await tmdb(path, { append_to_response: "videos,credits" });
  return detailsToMedia(data, type);
}

/** Recommandations liées à un média donné. */
export async function fetchRecommendations(type, tmdbId) {
  const genres = await loadGenres();
  const path =
    type === "movie"
      ? `/movie/${tmdbId}/recommendations`
      : `/tv/${tmdbId}/recommendations`;
  const data = await tmdb(path);
  return data.results.map((r) => toMedia(r, type, genres));
}

/** Liste des genres pour les filtres (films + séries fusionnés). */
export async function fetchGenres() {
  const map = await loadGenres();
  return Array.from(new Set(Object.values(map))).sort();
}

/** Décode "m1234" / "s5678" vers { type, tmdbId }. */
export function parseInternalId(id) {
  const m = id.match(/^([ms])(\d+)$/);
  if (!m) return null;
  return { type: m[1] === "m" ? "movie" : "series", tmdbId: Number(m[2]) };
}

/** Retourne l'id TMDB d'un genre depuis son nom (utile pour discoverMedia). */
export async function getGenreId(name) {
  const map = await loadGenres();
  const entry = Object.entries(map).find(([, n]) => n === name);
  return entry ? Number(entry[0]) : undefined;
}
