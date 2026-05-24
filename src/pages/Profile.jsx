/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: Profile (Profil utilisateur)
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Affiche et permet d'éditer le profil de l'utilisateur connecté.
 *   C'est une "page protégée" : seuls les users connectés peuvent y accéder.
 *
 * ⚓️ GARDE DE ROUTE (Protected Route):
 *   Si pas isAuthenticated → redirige immédiatement vers /login.
 *   Avec state.from = "/profil" pour revenir après connexion.
 *   Technique: <Navigate replace /> returné dans le rendu.
 *
 * CONTENU:
 *   1. Affichage de l'email (lecture seule)
 *   2. Champ éditable pour le nom d'affichage (displayName)
 *   3. Date de création du compte
 *   4. Bouton "Enregistrer" pour sauvegarder le pseudo
 *   5. Bouton "Se déconnecter" qui efface la session
 *
 * INTERACTION:
 *   - L'utilisateur tape un nouveau pseudo
 *   - Clique "Enregistrer"
 *   - AuthContext sauvegarde dans localStorage
 *   - Message de confirmation "Pseudo mis à jour ✨" s'affiche 2.5s
 *   - Au clic "Se déconnecter": session clearée, redirige /
 *
 * HOOKS UTILISÉS:
 *   - useAuth(): Accès au user, logout, updateProfile
 *   - useState: Champ displayName en local (sync avec user via useEffect)
 *   - useEffect: Met à jour displayName quand user change
 *   - useNavigate: Redirige après logout
 *   - Navigate: Redirige si pas connecté (composant, pas hook)
 *
 * PATTERN: Formulaire contrôlé
 *   value={displayName} lié à l'état React
 *   onChange={(e) => setDisplayName(...)} met à jour en temps réel
 *   Soumission via <form onSubmit={handleSave}>
 *
 * POINTS D'APPRENTISSAGE:
 *   - Navigate() composant pour gardes de route simples
 *   - state.from pour mémoriser l'URL d'origine
 *   - useEffect pour synchroniser les champs avec le contexte
 *   - Boutons submit dans une form pour soumettre avec Entrée
 *   - Messages tempéraires avec setTimeout()
 */
import { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { User, Mail, Calendar, LogOut, Save } from "lucide-react";
import Layout from "@/components/Layout.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const Profile = () => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // Synchronise le champ avec l'utilisateur courant
  useEffect(() => {
    if (user) setDisplayName(user.displayName);
  }, [user]);

  // Garde de route : pas connecté → /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/profil" }} replace />;
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ displayName: displayName.trim() || user.email });
    setSavedMessage("Pseudo mis à jour ✨");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Format de date français
  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Layout className="container mx-auto px-4 lg:px-8 pt-32 pb-12">
      <div>
        <header className="mb-10 animate-fade-in">
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-gradient-gold">
            Mon profil
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos informations personnelles.
          </p>
        </header>

        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          {/* Avatar (initiale) + infos rapides */}
          <aside className="bg-card border border-border rounded-2xl p-6 text-center shadow-card">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-display text-4xl text-primary-foreground mb-4">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <p className="font-display text-2xl tracking-wider mb-1">
              {user.displayName}
            </p>
            <p className="text-sm text-muted-foreground break-all">
              {user.email}
            </p>

            <button
              onClick={handleLogout}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2.5 text-sm font-semibold hover:bg-destructive hover:text-destructive-foreground transition-smooth"
            >
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </aside>

          {/* Édition du profil */}
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
            <h2 className="font-display text-2xl mb-6">Informations</h2>

            <form onSubmit={handleSave} className="space-y-5 max-w-lg">
              <Row icon={Mail} label="Email" value={user.email} readOnly />
              <Row
                icon={Calendar}
                label="Membre depuis"
                value={memberSince}
                readOnly
              />

              <label className="block">
                <span className="block text-sm font-medium text-foreground/80 mb-1.5">
                  Pseudo
                </span>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </label>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow hover:shadow-glow transition-smooth"
                >
                  <Save className="h-4 w-4" /> Enregistrer
                </button>
                {savedMessage && (
                  <span className="text-sm text-primary animate-fade-in">
                    {savedMessage}
                  </span>
                )}
              </div>
            </form>

            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                Vous avez {user.favorites?.length ?? 0} favoris.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/favoris"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/90 transition-smooth"
                >
                  Voir mes favoris
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary transition-smooth"
                  >
                    Espace admin
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

/** Ligne d'information en lecture seule (label + valeur + icône). */
const Row = ({ icon: Icon, label, value, ...props }) => (
  <label className="block">
    <span className="block text-sm font-medium text-foreground/80 mb-1.5">
      {label}
    </span>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        {...props}
        value={value}
        readOnly
        className="w-full bg-muted/50 border border-border rounded-md pl-10 pr-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
      />
    </div>
  </label>
);

export default Profile;
