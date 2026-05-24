/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: Search (Résultats de recherche)
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Affiche les résultats de la recherche utilisateur.
 *   L'utilisateur arrive ici après avoir tapé une query dans la barre de recherche de Navbar.
 *
 * FLUX UTILISATEUR:
 *   1. Utilisateur écrit "Avatar" dans la barre de recherche (Navbar.jsx)
 *   2. Clique "Entrée" ou attend l'autocomplet
 *   3. URL devient: /recherche?q=Avatar
 *   4. Le loader searchLoader (router.jsx) appelle searchMedia("Avatar")
 *   5. TMDB API retourne les films/séries correspondant
 *   6. Cette page les affiche dans une grille
 *
 * DONNÉES (du loader):
 *   - q: La query de recherche (ex: "Avatar")
 *   - items: Tableau de films/séries trouvés
 *   Vient du loader searchLoader(request) qui extrait ?q= de l'URL
 *
 * AFFICHAGE:
 *   - En-tête avec le mot recherché en doré/gold
 *   - Compteur: "X résultats"
 *   - Grille responsive de cartes (MediaGrid)
 *
 * CAS EDGE:
 *   - Pas de résultats: MediaGrid affiche "Aucun résultat"
 *   - Query vide: Devrait pas arriver (validation Navbar)
 *   - Résultats multiples: Grille s'adapte (6 colonnes desktop → 2 mobile)
 *
 * POINTS D'APPRENTISSAGE:
 *   - URL Search Params: ?q= est un paramètre de query
 *   - Déconstruction facile: { q, items } = useLoaderData()
 *   - Grammaire française: "1 résultat" vs "2 résultats"
 */
import { useLoaderData } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import MediaGrid from "@/components/MediaGrid.jsx";

const Search = () => {
  const { q, items } = useLoaderData();

  return (
    <Layout className="container mx-auto px-4 lg:px-8 pt-32 pb-16">
      <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-widest mb-4">
        Recherche
      </span>
      <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-2">
        Résultats pour <span className="text-gradient-gold">« {q} »</span>
      </h1>
      <p className="text-muted-foreground mb-8 text-lg">
        {items.length} résultat{items.length > 1 ? "s" : ""}
      </p>
      <MediaGrid items={items} />
    </Layout>
  );
};

export default Search;
