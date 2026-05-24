import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import Logo from "./Logo.jsx";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: Navbar
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Barre de navigation fixe en haut de page.
 *   Composant PRINCIPAL qui reste visible sur toutes les pages.
 *
 * FONCTIONNALITÉS:
 *   1. Logo cliquable qui ramène à l'accueil
 *   2. Liens de navigation: Accueil, Films, Séries, Classiques, Avis
 *   3. Champ de recherche avec autocomplete
 *   4. Authentification: bouton Connexion ou profil utilisateur
 *   5. Effet "glassmorphisme" au scroll (devient opaque, inspiré Netflix)
 *
 * HOOKS UTILISÉS:
 *   - useState: scrolled (pour détecter si l'user a scrollé), query (pour le search)
 *   - useEffect: event listener sur le scroll
 *   - useNavigate: pour rediriger vers la page recherche
 *   - useAuth: pour récupérer l'utilisateur connecté
 *
 * RESPONSIVE:
 *   - Menu principal caché sur mobile (hidden md:flex)
 *   - Champ recherche qui s'agrandit au focus
 *   - Tout s'ajuste avec Tailwind breakpoints
 *
 * POINTS D'APPRENTISSAGE:
 *   - Event listeners avec cleanup (retirer le listener en unmount)
 *   - NavLink de react-router qui style automatiquement le lien actif
 *   - Utilisation de context pour l'authentification (useAuth)
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Bascule le fond de la navbar au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim())
      navigate(`/recherche?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Style commun pour les liens (actif = ambre)
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-smooth hover:text-primary ${
      isActive ? "text-primary" : "text-foreground/80"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-card"
          : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between gap-6 px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Navigation principale */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <NavLink to="/" end className={linkClass}>
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/films" className={linkClass}>
              Films
            </NavLink>
          </li>
          <li>
            <NavLink to="/series" className={linkClass}>
              Séries
            </NavLink>
          </li>
          <li>
            <NavLink to="/classiques" className={linkClass}>
              Classiques
            </NavLink>
          </li>
          <li>
            <NavLink to="/avis" className={linkClass}>
              Avis
            </NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink to="/favoris" className={linkClass}>
                Favoris
              </NavLink>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3">
          {/* Recherche */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-32 sm:w-44 bg-secondary/80 border border-border rounded-full pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:w-56 transition-all"
              aria-label="Rechercher un film ou une série"
            />
          </form>

          {/* Bloc utilisateur */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Link
                  to="/profil"
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/80 hover:bg-secondary transition-smooth text-sm"
                  aria-label="Voir mon profil"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">{user.displayName}</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-secondary transition-smooth"
                  >
                    Admin
                  </Link>
                )}
              </div>
              <button
                onClick={handleLogout}
                aria-label="Se déconnecter"
                className="p-2 rounded-full hover:bg-secondary transition-smooth"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow hover:shadow-glow transition-smooth"
            >
              Connexion
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
