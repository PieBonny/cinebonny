import React from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: Logo
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Affiche le logo du site CineBonny avec une icône cinéma stylisée et du texte.
 *   Composant RÉUTILISABLE utilisé notamment dans la barre de navigation.
 *
 * PROPS:
 *   - className (string): Classes CSS additionnelles pour personnaliser le conteneur
 *   - size (string): Taille du logo - 'small', 'default' ou 'large'
 *       Ex: size="small" pour la navbar mobile, size="large" pour la page d'accueil
 *
 * ARCHITECTURE:
 *   1. Conteneur flex avec icône SVG et texte côte à côte
 *   2. L'icône SVG représente une pellicule de film + bouton play (thème cinéma)
 *   3. Le texte "CineBonny" s'adapte à la taille choisie
 *
 * EXEMPLE D'UTILISATION:
 *   <Logo size="default" className="hover:opacity-80" />
 *   <Logo size="large" />
 *
 * POINTS D'APPRENTISSAGE:
 *   - Props avec valeurs par défaut (className = "", size = "default")
 *   - Utilisation d'un objet sizeClasses pour gérer les variantes
 *   - SVG intégré directement pour les icônes custom
 */
const Logo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "h-6 w-6 text-lg",
    default: "h-8 w-8 text-xl",
    large: "h-12 w-12 text-3xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icône cinéma (pellicule) */}
      <div className="relative">
        <svg
          className={`${sizeClasses[size]} text-primary`}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pellicule de film */}
          <rect
            x="2"
            y="4"
            width="28"
            height="24"
            rx="2"
            fill="currentColor"
            opacity="0.2"
          />
          {/* Perforations */}
          <circle cx="6" cy="6" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="26" cy="6" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="6" cy="26" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="26" cy="26" r="1" fill="currentColor" opacity="0.6" />
          {/* Cadres de film */}
          <rect
            x="4"
            y="10"
            width="24"
            height="2"
            fill="currentColor"
            opacity="0.4"
          />
          <rect
            x="4"
            y="14"
            width="24"
            height="2"
            fill="currentColor"
            opacity="0.4"
          />
          <rect
            x="4"
            y="18"
            width="24"
            height="2"
            fill="currentColor"
            opacity="0.4"
          />
          {/* Bouton play */}
          <polygon points="16,12 20,16 16,20" fill="currentColor" />
        </svg>
      </div>

      {/* Texte du logo */}
      <span
        className={`font-display font-bold text-foreground ${size === "small" ? "text-lg" : size === "large" ? "text-2xl" : "text-xl"}`}
      >
        CineBonny
      </span>
    </div>
  );
};

export default Logo;
