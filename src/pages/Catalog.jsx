/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: Catalog (Catalogue de films/séries)
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Affiche un catalogue filtrable de films, séries, ou classiques.
 *   Props title/subtitle changent selon la route:
 *   - /films → "Films", "Découvrez notre sélection..."
 *   - /series → "Séries", "Les meilleures séries..."
 *   - /classiques → "Classiques", "Les films qui ont marqué..."
 *
 * SYSTÈME DE FILTRES:
 *   Les filtres sont SYNCHRONISÉS AVEC L'URL (?genre=&year=&minRating=&page=).
 *   Changer un filtre = URL change = loader relancé = données revalidées.
 *   C'est un pattern puissant: "URL = single source of truth".
 *
 * FILTRES DISPONIBLES:
 *   - Genre: Drama, Action, Comédie, etc. (options de la vraie TMDB)
 *   - Année: 2024, 2023, 2022, etc.
 *   - Note min: 5.0+, 6.0+, 7.0+, 8.0+
 *   - Pagination: Load more ou Next page
 *
 * FONCTION setParam():
 *   Mise à jour intelligente de l'URL. Par exemple:
 *   - setParam("genre", "action") → URL devient ?genre=action
 *   - setParam("genre", "all") → Supprime le paramètre
 *   - Tout changement → Reset page à 1 (logique: on revient au début)
 *
 * DONNÉES (du loader):
 *   { items, filters, page, hasMore, genres }
 *   - items: Films/séries de la page actuelle
 *   - filters: Filtres appliqués actuellement
 *   - page: Numéro de la page actuelle
 *   - hasMore: Boolean pour "Load more"
 *   - genres: Liste des genres pour le dropdown
 *
 * UX INTELLIGENT:
 *   - "Aucun résultat" si MediaGrid est vide
 *   - Bouton "Réinitialiser" si filtres actifs
 *   - "Load more" au lieu de pagination classique (UX modernes: scroll)
 *   - Squelettes pendant le chargement
 *
 * POINTS D'APPRENTISSAGE:
 *   - URL Search Params: useSearchParams() et setSearchParams()
 *   - URLSearchParams API: URLSearchParams(searchParams) pour manipulation facile
 *   - Navigation state: navigation.state === "loading" pour détecter les chargements
 *   - Pagination avec page query param
 *   - Controlled inputs: value={filters.genre} onChange={(e) => setParam(...)}
 */
import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useNavigation,
} from "react-router-dom";
import { FaSliders } from "react-icons/fa6";
import Layout from "@/components/Layout.jsx";
import MediaGrid from "@/components/MediaGrid.jsx";

const Catalog = ({ title, subtitle }) => {
  const { items, filters, page, hasMore, genres } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const isLoading = navigation.state === "loading";

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all" || value === "0") next.delete(key);
    else next.set(key, value);
    next.delete("page"); // tout changement de filtre → reset pagination
    setSearchParams(next);
  };

  const loadMore = () => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page + 1));
    setSearchParams(next);
  };

  const reset = () => navigate({ search: "" });

  const selectClass =
    "bg-secondary/60 backdrop-blur border border-border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer min-w-[140px]";

  const hasActiveFilter =
    filters.genre !== "all" ||
    (filters.year !== "all" && !title.includes("Classiques")) ||
    filters.minRating > 0;

  return (
    <Layout className="container mx-auto px-4 lg:px-8 pt-32 pb-16">
      <header className="mb-10 animate-fade-up">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          Catalogue
        </span>
        <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
      </header>

      {/* Barre de filtres — composant inline (état dans l'URL, pas de useState) */}
      <div className="flex flex-wrap gap-3 items-center mb-8 p-4 rounded-xl bg-card/40 border border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground pr-2 border-r border-border">
          <FaSliders className="h-4 w-4" />
          <span className="font-semibold uppercase tracking-wider text-xs">
            Filtres
          </span>
        </div>

        <select
          aria-label="Filtrer par genre"
          value={filters.genre}
          onChange={(e) => setParam("genre", e.target.value)}
          className={selectClass}
        >
          <option value="all">Tous les genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          aria-label="Note minimale"
          value={filters.minRating}
          onChange={(e) => setParam("minRating", e.target.value)}
          className={selectClass}
        >
          <option value={0}>Toutes les notes</option>
          <option value={7}>★ 7+</option>
          <option value={8}>★ 8+</option>
          <option value={9}>★ 9+</option>
        </select>

        {hasActiveFilter && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-smooth"
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {isLoading
          ? "Chargement…"
          : `${items.length} résultat${items.length > 1 ? "s" : ""}`}
      </p>

      <MediaGrid items={items} isLoading={isLoading && items.length === 0} />

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-bold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
          >
            {isLoading ? "Chargement…" : "Voir plus"}
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Catalog;
