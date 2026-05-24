/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * PAGE: NotFound (404)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Affichée quand l'utilisateur accède à une URL qui n'existe pas.
 *   Page d'erreur simple mais élégante style Netflix.
 *
 * CAS D'USAGE:
 *   1. Utilisateur tape une URL invalide dans la barre (ex: /films/xyz/edit)
 *   2. React Router ne trouve pas de route correspondante
 *   3. La dernière route { path: "*" } catch-all la affiche
 *   4. Message 404 avec lien retour accueil
 *
 * DÉTAILS:
 *   - useLocation() pour logger l'URL tentée (debug)
 *   - useEffect pour tracer les erreurs 404 en console
 *   - Design simple: grand 404 + message + bouton retour
 *   - Fallback gracieux (pas de crash, UX friendly)
 *
 * RESPONSIVE:
 *   - Titre: 7xl mobile → 9xl desktop
 *   - Centré verticalement avec flexbox min-h-screen
 *   - Padding px-4 pour mobile
 *
 * ROUTE:
 *   La route catch-all est définie dans router.jsx:
 *   { path: "*", element: <NotFound /> }
 *
 * POINTS D'APPRENTISSAGE:
 *   - Catch-all routes: { path: "*" }
 *   - ErrorElement vs page 404 (cette page c'est la simple 404)
 *   - useLocation() pour accéder à la route courante
 *   - Logging des erreurs pour debug en prod
 */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="font-display text-7xl md:text-9xl tracking-wider text-gradient-gold mb-4">
          404
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Cette page n'existe pas… ou plus.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-glow hover:shadow-glow transition-smooth"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
