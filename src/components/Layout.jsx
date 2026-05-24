import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: Layout
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Enveloppe TOUTES les pages avec la structure commune: Navbar + contenu + Footer.
 *   Évite la duplication de code et centralise le layout global.
 *   C'est un pattern React appelé "Layout Pattern" — très utile dans les apps.
 *
 * POURQUOI C'EST UTILE:
 *   Imagine copier <Navbar /> et <Footer /> dans 10 pages différentes...
 *   Puis tu dois changer le style du Footer — tu dois modifier 10 fichiers!
 *   Avec Layout, tu changes une fois et c'est appliqué partout.
 *
 * FONCTIONNEMENT:
 *   1. Reçoit les props enfants via children (technique React classique)
 *   2. Crée une structure min-h-screen (au moins la hauteur du viewport)
 *   3. Le flex flex-col fait que Footer reste en bas même avec peu de contenu
 *   4. flex-1 sur <main> fait que le contenu prend l'espace disponible
 *
 * Props :
 *  - children : contenu spécifique de la page (passé via les props !)
 *  - className : classes Tailwind additionnelles pour le <main>
 */
const Layout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
