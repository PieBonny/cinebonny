/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: ReviewDetail (Détail d'un avis)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Page /avis/:id — Affiche UN avis en détail + permet l'édition et suppression.
 *   Démontre les opérations UPDATE et DELETE du CRUD.
 *
 * DONNÉES (du loader):
 *   review: { id, mediaTitle, rating, author, critique, createdAt }
 *   Chargée par reviewLoader qui appelle fetchReview(id)
 *
 * TROIS MODES:
 *   1. LECTURE: Affichage en lecture seule de l'avis
 *   2. ÉDITION: Formulaire pour modifier la critique
 *   3. SUPPRESSION: Confirmation puis appel de deleteReviewAction
 *
 * ÉDITION:
 *   - Bouton "Modifier" déclenche editing = true
 *   - Affiche <Form method="post" action="/avis/:id/edit">
 *   - React Router appelle updateReviewAction
 *   - La page se re-rend avec les données mises à jour
 *   - Après: editing = false, retour au mode lecture
 *
 * SUPPRESSION:
 *   - Bouton "Supprimer" déclenche confirmation
 *   - Si confirmé: <Form method="post" action="/avis/:id/delete">
 *   - React Router appelle deleteReviewAction
 *   - Redirige vers /avis
 *   - Message "Avis supprimé"
 *
 * REACT ROUTER V6 ET MÉTHODES HTTP:
 *   Note: React Router v6 utilise POST pour tout via <Form>.
 *   Les vrais DELETE/PATCH HTTP ne sont pas utilisés côté client ici.
 *   C'est une limitation de react-router-dom v6 côté Form.
 *   Le vrai HTTP DELETE est appelé par l'action dans le loader.
 *
 * RESPONSIVE:
 *   Desktop: 2 colonnes (avis | sidebar)
 *   Mobile: 1 colonne (tout en haut en bas)
 *
 * POINTS D'APPRENTISSAGE:
 *   - useLoaderData() pour charger UN avis (vs liste)
 *   - useState local pour gérer l'état editing
 *   - Conditional rendering: vue lecture vs édition
 *   - Form method="post" vers différentes actions
 *   - Pattern Detail with Edit/Delete (très courant)
 */
import { useState } from "react";
import { useLoaderData, Link, Form, useNavigation } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaTrash,
  FaFloppyDisk,
  FaPenToSquare,
} from "react-icons/fa6";
import Layout from "@/components/Layout.jsx";

const ReviewDetail = () => {
  const review = useLoaderData();
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const submitting = navigation.state === "submitting";

  return (
    <Layout>
      <section>
        <div className="container mx-auto py-6 px-6 pt-28">
          <Link
            to="/avis"
            className="text-primary hover:text-primary-glow flex items-center transition-smooth"
          >
            <FaArrowLeft className="mr-2" /> Revenir à la liste des avis
          </Link>
        </div>
      </section>

      <section className="bg-card/40">
        <div className="container mx-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            {/* ─── Contenu principal ─── */}
            <main>
              <div className="bg-card border border-border p-6 rounded-lg shadow-card">
                <div className="text-muted-foreground mb-2 text-sm uppercase tracking-wider">
                  Critique de cinéphile
                </div>
                <h1 className="font-display text-4xl mb-4">
                  {review.mediaTitle}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-primary font-semibold text-base">
                    <FaStar /> {review.rating}/10
                  </span>
                  <span>
                    par <strong>{review.author}</strong>
                  </span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-lg shadow-card mt-6">
                <h3 className="text-primary text-lg font-bold mb-4">
                  Critique
                </h3>

                {editing ? (
                  <Form
                    method="post"
                    action={`/avis/${review.id}/edit`}
                    className="space-y-4"
                    onSubmit={() => setEditing(false)}
                  >
                    <label className="block">
                      <span className="block text-sm font-medium mb-1.5">
                        Note (1-10)
                      </span>
                      <input
                        type="number"
                        name="rating"
                        min={1}
                        max={10}
                        defaultValue={review.rating}
                        required
                        className="w-32 bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium mb-1.5">
                        Commentaire
                      </span>
                      <textarea
                        name="comment"
                        defaultValue={review.comment}
                        rows={6}
                        required
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
                      >
                        <FaFloppyDisk />{" "}
                        {submitting ? "Enregistrement…" : "Enregistrer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="rounded-md bg-secondary px-4 py-2 text-sm hover:bg-muted"
                      >
                        Annuler
                      </button>
                    </div>
                  </Form>
                ) : (
                  <p className="leading-relaxed text-foreground/90 whitespace-pre-line">
                    {review.comment}
                  </p>
                )}
              </div>
            </main>

            {/* ─── Sidebar : gestion ─── */}
            <aside>
              <div className="bg-card border border-border p-6 rounded-lg shadow-card">
                <h3 className="text-xl font-bold mb-4">Gestion</h3>

                <button
                  onClick={() => setEditing((v) => !v)}
                  className="bg-secondary hover:bg-muted text-foreground text-center font-bold py-2 px-4 rounded-full w-full mt-2 inline-flex items-center justify-center gap-2"
                >
                  <FaPenToSquare />{" "}
                  {editing ? "Fermer l'édition" : "Modifier l'avis"}
                </button>

                {/*
                  Suppression — exactement comme dans JobDetailPage :
                  <Form method="post" action="/avis/:id/delete"> + confirm()
                */}
                <Form
                  method="post"
                  action={`/avis/${review.id}/delete`}
                  onSubmit={(e) => {
                    if (
                      !window.confirm(
                        "Êtes-vous sûr de vouloir supprimer cet avis ?",
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-2 px-4 rounded-full w-full mt-4 inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <FaTrash />{" "}
                    {submitting ? "Suppression…" : "Supprimer l'avis"}
                  </button>
                </Form>
              </div>

              <div className="bg-card border border-border p-6 rounded-lg shadow-card mt-6 text-sm text-muted-foreground">
                <p>
                  💡 Cette page utilise <code>useLoaderData</code> et{" "}
                  <code>&lt;Form&gt;</code> — exactement comme l'exemple{" "}
                  <code>JobDetailPage</code> du cours.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReviewDetail;
