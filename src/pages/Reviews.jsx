/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: Reviews (Liste des avis)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Page /avis — Affiche TOUS les avis publiés + formulaire pour en créer un nouveau.
 *   Démontre le CRUD complet avec React Router v6 Data API.
 *
 * ARCHITECTURE:
 *   1. SECTION GAUCHE (sticky): Formulaire de création d'avis (<Form method="post">)
 *   2. SECTION DROITE: Liste de tous les avis avec liens vers détails (/avis/:id)
 *
 * FORMULAIRE DE CRÉATION:
 *   - Utilise <Form method="post"> (pas <form> HTML)
 *   - React Router intercepte la soumission
 *   - Appelle createReviewAction (router.jsx)
 *   - Re-rend la page avec les nouvelles données (via loader)
 *   - Messages de feedback via useActionData()
 *
 * DONNÉES (du loader):
 *   reviews: [{ id, mediaTitle, rating, author, critique, createdAt }, ...]
 *   Vient du reviewsLoader qui appelle fetchReviews()
 *
 * UTILISATEURS:
 *   - Non connectés: Avis publié en tant que "Anonyme"
 *   - Connectés: Nom d'affichage automatiquement pré-rempli
 *   - useAuth() pour accéder au user courant
 *
 * FEEDBACK:
 *   - actionData?.ok === true après création réussie
 *   - Message temporaire "Avis publié ✨"
 *   - État submitting pendant la soumission (bouton disabled)
 *
 * RESPONSIVE:
 *   Desktop: Deux colonnes (formulaire | liste)
 *   Formulaire sticky en haut sur le côté
 *   Mobile: Une colonne (formulaire puis liste)
 *
 * POINTS D'APPRENTISSAGE:
 *   - React Router Form vs HTML form
 *   - useLoaderData() pour liste initiale
 *   - useActionData() pour feedback POST
 *   - useNavigation() pour suivre état submitting
 *   - navigation.state === "submitting" pour disabler bouton
 *   - Pattern CRUD: créer depuis une liste principale
 */
import {
  useLoaderData,
  useActionData,
  Form,
  Link,
  useNavigation,
} from "react-router-dom";
import { FaStar, FaPenToSquare, FaTrash, FaCommentDots } from "react-icons/fa6";
import Layout from "@/components/Layout.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const Reviews = () => {
  const { reviews } = useLoaderData();
  const actionData = useActionData(); // { ok, message } après POST
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();

  const submitting = navigation.state === "submitting";

  return (
    <Layout className="container mx-auto px-4 lg:px-8 pt-32 pb-16">
      <header className="mb-10 animate-fade-up">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          Communauté
        </span>
        <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-3">
          Avis des cinéphiles
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Partagez vos coups de cœur, lisez les critiques de la communauté.
        </p>
      </header>

      {actionData?.ok && (
        <div className="mb-6 px-4 py-3 rounded-md bg-primary/10 border border-primary/30 text-sm text-primary animate-fade-in">
          {actionData.message}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* ─── Création via <Form method="post"> ─── */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
            <FaCommentDots className="text-primary" /> Publier un avis
          </h2>

          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground mb-3">
              💡 Vous publierez en tant qu'<strong>Anonyme</strong>.
              Connectez-vous pour signer vos avis.
            </p>
          )}

          <Form method="post" className="space-y-4">
            <input
              type="hidden"
              name="author"
              value={user?.displayName ?? "Anonyme"}
            />

            <label className="block">
              <span className="block text-sm font-medium mb-1.5">
                Titre du film / série
              </span>
              <input
                type="text"
                name="mediaTitle"
                required
                placeholder="Ex : Inception"
                className="w-full bg-secondary border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium mb-1.5">
                Note (1-10)
              </span>
              <input
                type="number"
                name="rating"
                min={1}
                max={10}
                defaultValue={8}
                required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium mb-1.5">
                Votre critique
              </span>
              <textarea
                name="comment"
                required
                rows={4}
                placeholder="Qu'avez-vous pensé de ce film ?"
                className="w-full bg-secondary border border-border rounded-md px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
            >
              {submitting ? "Publication…" : "Publier"}
            </button>
          </Form>
        </section>

        {/* ─── Liste ─── */}
        <section>
          <h2 className="font-display text-2xl mb-4">{reviews.length} avis</h2>

          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              Aucun avis pour le moment. Soyez le premier !
            </p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="bg-card border border-border rounded-xl p-5 shadow-card animate-fade-in"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <Link
                        to={`/avis/${r.id}`}
                        className="font-display text-xl hover:text-primary transition-smooth"
                      >
                        {r.mediaTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        par <strong>{r.author}</strong> ·{" "}
                        {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-bold">
                      <FaStar /> {r.rating}/10
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mt-2 line-clamp-3">
                    {r.comment}
                  </p>
                  <div className="flex gap-3 mt-3 text-xs">
                    <Link
                      to={`/avis/${r.id}`}
                      className="text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                      <FaPenToSquare /> Détails / Modifier
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Reviews;
