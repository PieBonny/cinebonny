/**
 * PAGE: Favorites (Favoris de l'utilisateur)
 *
 * Objectif:
 *   Affiche les films/séries que l'utilisateur a ajoutés à ses favoris.
 *   Chaque utilisateur voit uniquement ses propres favoris.
 */
import { Link, Navigate } from "react-router-dom";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import Layout from "@/components/Layout.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const Favorites = () => {
  const { user, isAuthenticated, removeFavorite } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/favoris" }} replace />;
  }

  const favorites = user.favorites ?? [];

  return (
    <Layout className="container mx-auto px-4 lg:px-8 pt-32 pb-12">
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="font-display text-5xl tracking-wider text-gradient-gold">
            Mes favoris
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Retrouvez ici les films et séries que vous avez ajoutés à vos favoris.
          </p>
        </header>

        {favorites.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-card">
            <Heart className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="font-display text-2xl mb-2">Aucun favori pour l'instant</h2>
            <p className="text-muted-foreground mb-6">
              Parcourez le catalogue et ajoutez des films ou séries à votre liste.
            </p>
            <Link
              to="/films"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition-smooth"
            >
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {favorites.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
                >
                  <div className="h-64 overflow-hidden bg-muted">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground tracking-[0.2em]">
                        {item.type === "movie" ? "Film" : "Série"}
                      </p>
                      <h2 className="font-display text-xl mt-1">{item.title}</h2>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link
                        to={item.type === "movie" ? `/film/${item.id}` : `/serie/${item.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Voir la fiche
                      </Link>
                      <button
                        onClick={() => removeFavorite(item.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-destructive/10 transition-smooth"
                      >
                        <Trash2 className="h-4 w-4" /> Retirer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
