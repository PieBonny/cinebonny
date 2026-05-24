/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: Login (Connexion / Inscription)
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Permet à l'utilisateur de se connecter OU de créer un compte.
 *   Mode unique avec onglets pour basculer login ↔️ register.
 *
 * ⚠️ IMPORTANT - SÉCURITÉ:
 *   Cette page est EN DÉMONSTRATION - utilise localStorage (TRÈS INSÉCURISÉ).
 *   En production, il faudrait:
 *   - Backend Node.js/Express avec authentification JWT
 *   - Hasher les mots de passe (bcrypt)
 *   - HTTPS obligatoire
 *   - Pas stocker les creds en localStorage
 *   Pour ce projet éducatif, on simule avec localStorage.
 *
 * FLUX UTILISATEUR (Login):
 *   1. Entre son email + password
 *   2. Clique "Se connecter"
 *   3. AuthContext vérifie les creds stockées
 *   4. Si OK: redirige vers /profil ou la page d'origine
 *   5. Si KO: affiche erreur
 *
 * FLUX UTILISATEUR (Register):
 *   1. Entre son nom + email + password
 *   2. Clique "S'inscrire"
 *   3. AuthContext sauvegarde le nouvel utilisateur
 *   4. Redirige automatiquement vers /profil
 *
 * REDIRECTION INTELLIGENTE:
 *   Après connexion réussie, vas à location.state?.from (la page d'avant)
 *   ou par défaut /profil. Exemple: tu essayais d'accéder /avis mais pas connecté
 *   → redirect Login → après login → retour à /avis (location.state.from)
 *
 * ÉTAT INTERNE:
 *   - mode: "login" ou "register" (basculé par onglets)
 *   - email, password, displayName: Valeurs des inputs
 *   - error: Message d'erreur si login échoue
 *   - loading: true pendant la tentative (bouton disabled)
 *
 * POINTS D'APPRENTISSAGE:
 *   - useLocation().state pour récupérer l'état passé par navigate()
 *   - Formulaires contrôlés: value={state}, onChange={(e) => setState(e.target.value)}
 *   - Try/catch pour la gestion d'erreur simple
 *   - Bascule UI simple: mode === "login" ? ... : ...
 */
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Film, Mail, Lock, User } from "lucide-react";
import Layout from "@/components/Layout.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from ?? "/profil";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        login({ email, password });
      } else {
        register({ email, password, displayName });
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <Layout className="flex items-center justify-center px-4 pt-32 pb-12">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-card p-8 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Film className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl tracking-wider text-gradient-gold">
            CINEBONNY
          </span>
        </div>

        <h1 className="font-display text-3xl text-center tracking-wider mb-2">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-6">
          {isLogin
            ? "Heureux de vous revoir."
            : "Rejoignez la communauté CineBonny."}
        </p>

        {/* Onglets */}
        <div className="flex bg-secondary rounded-lg p-1 mb-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-md transition-smooth ${
              isLogin
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-md transition-smooth ${
              !isLogin
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Field
              icon={User}
              label="Pseudo"
              type="text"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Cinéphile42"
              required
            />
          )}
          <Field
            icon={Mail}
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="vous@exemple.com"
            required
          />
          <Field
            icon={Lock}
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
            minLength={4}
          />

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-smooth hover:bg-primary-glow hover:shadow-glow disabled:opacity-60"
          >
            {loading
              ? "Patientez…"
              : isLogin
                ? "Se connecter"
                : "Créer mon compte"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          ⚠️ Démo locale : les comptes sont stockés dans votre navigateur.
          <br />
          Compte admin de démonstration : <strong>admin@cinebonny.local</strong> / <strong>admin123</strong>
          <br />
          <Link to="/" className="text-primary hover:underline">
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </Layout>
  );
};

/**
 * Petit composant interne pour un champ avec icône.
 * Évite la duplication de markup dans le formulaire.
 */
const Field = ({ icon: Icon, label, value, onChange, ...props }) => (
  <label className="block">
    <span className="block text-sm font-medium text-foreground/80 mb-1.5">
      {label}
    </span>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary border border-border rounded-md pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  </label>
);

export default Login;
