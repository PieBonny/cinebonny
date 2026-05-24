import { Film } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: Footer
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Affiche le pied de page du site avec logo, copyright et crédits.
 *   C'est un composant SIMPLE et SANS PROPS — il est identique sur toutes les pages.
 *
 * CONTENU:
 *   - Logo CineBonny avec icône Film (lucide-react)
 *   - Texte copyright avec année dynamique (new Date().getFullYear())
 *   - Crédit "Données : TMDB API"
 *
 * ARCHITECTURE:
 *   Structure 3 colonnes (flex) qui se réorganise en colonne sur mobile:
 *   - Gauche: Logo
 *   - Centre: Copyright
 *   - Droite: Attribution API
 *
 * STYLE:
 *   - Bordure grise en haut (border-border)
 *   - Fond semi-transparent et glassmorphisme
 *   - Texte muted-foreground (couleur secondaire)
 *
 * POINTS D'APPRENTISSAGE:
 *   - Composant pur sans état (stateless component)
 *   - Responsive design avec classes md: (mobile-first)
 *   - Utilisation de lucide-react pour les icônes
 */
const Footer = () => (
  <footer className="border-t border-border mt-20 py-10 bg-card/30">
    <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Film className="h-5 w-5 text-primary" />
        <span className="font-display text-xl tracking-wider text-gradient-gold">
          CINEBONNY
        </span>
      </div>
      <p>
        © {new Date().getFullYear()} CineBonny — Catalogue de démonstration.
      </p>
      <p className="text-xs">Données : TMDB API</p>
    </div>
  </footer>
);

export default Footer;
