/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: Home (Accueil)
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Affiche la page d'accueil du site CineBonny avec les contenus en tendance et populaires.
 *   C'est la PREMIÈRE PAGE que l'utilisateur voit — critique pour engager l'intérêt!
 *
 * DONNÉES (du loader):
 *   Les données viennent du loader homeLoader (router.jsx), qui est appelé AVANT que le
 *   composant ne s'affiche. C'est une feature de React Router Data API.
 *   - trending: Films/séries en tendance (cette semaine)
 *   - popularMovies: Films populaires
 *   - popularSeries: Séries populaires
 *   - topMovies: Meilleurs films (par note)
 *   - topSeries: Meilleures séries (par note)
 *
 * ARCHITECTURE:
 *   1. Hero: Bandeau principal immersif avec le film vedette
 *   2. MediaRow × N: Plusieurs rangées horizontal (tendances, populaires, top-notés)
 *   3. Chaque MediaRow est un carrousel défilable
 *
 * UTILISATEUR EXPERIENCE:
 *   1. L'utilisateur ouvre le site
 *   2. Voit un super film en grand en hero section
 *   3. Peut scroller pour voir les rangées de films
 *   4. Peut cliquer sur une affiche pour voir détails
 *   5. Ou cliquer "Voir tout" pour aller au catalogue complet
 *
 * RESPONSIVE:
 *   - Hero: 92vh height, image grande
 *   - Titre: scale up sur desktop (grande police)
 *   - Espaces: space-y-8 entre les rangées
 *   - Sur mobile: tout s'adapte en colonnes
 *
 * POINTS D'APPRENTISSAGE:
 *   - React Router Data API: useLoaderData() récupère automatiquement les données
 *   - Composition: Hero + N × MediaRow
 *   - Sélection du featured: .find() pour trouver le premier avec backdrop
 *   - ?? opérateur: fallback [0] si pas d'image de fond trouvée
 */
import { useLoaderData, Link } from "react-router-dom";
import { FaFilm, FaArrowRight } from "react-icons/fa6";
import Hero from "@/components/Hero.jsx";
import MediaRow from "@/components/MediaRow.jsx";
import Layout from "@/components/Layout.jsx";

const Home = () => {
  // Récupération des données chargées par le routeur
  const { trending, popularMovies, popularSeries, topMovies, topSeries } =
    useLoaderData();

  // Sélection du film vedette pour la bannière (celui qui a une belle image de fond)
  const featured = trending.find((m) => !!m.backdrop) ?? trending[0];

  return (
    <Layout>
      {/* Bannière principale avec le film vedette */}
      <Hero featured={featured} />

      {/* Contenu principal - listes de films et séries */}
      <div className="-mt-32 relative z-10 pb-16">
        {/* Espace entre les rangées pour une meilleure lisibilité */}
        <div className="space-y-8">
          {/* Tendances actuelles */}
          <MediaRow
            title="Tendances de la semaine"
            items={trending}
            featured
            showRank
          />

          {/* Films populaires */}
          <MediaRow
            title="Films populaires"
            items={popularMovies}
            seeMoreTo="/films"
          />

          {/* Séries populaires */}
          <MediaRow
            title="Séries populaires"
            items={popularSeries}
            seeMoreTo="/series"
          />

          {/* Meilleurs films */}
          <MediaRow
            title="Films les mieux notés"
            items={topMovies}
            seeMoreTo="/films"
          />

          {/* Meilleures séries */}
          <MediaRow
            title="Séries cultes"
            items={topSeries}
            seeMoreTo="/series"
          />
        </div>

        {/* Bouton vers les avis communautaires */}
        <div className="container mx-auto px-4 lg:px-8 mt-16 text-center">
          <Link
            to="/avis"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition-smooth"
          >
            <FaFilm /> Lire les avis de la communauté <FaArrowRight />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
