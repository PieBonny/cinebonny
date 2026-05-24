import { Link } from "react-router-dom";
import { Play, Info, Star, Sparkles } from "lucide-react";
import heroBackdrop from "@/assets/hero-cinema.jpg";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPOSANT: Hero
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * RÔLE:
 *   Affiche un GRAND BANDEAU IMAGE plein écran en haut de l'accueil (section Hero).
 *   C'est l'élément qui accroche l'utilisateur immédiatement.
 *   Style cinéma immersif avec image grande, gradient, texte et boutons CTA.
 *
 * PROPS:
 *   - featured (object): Film/série à mettre en avant, OU undefined/null
 *       Si featured: affiche son image de fond, titre, synopsis, boutons "Regarder"/"Plus d'infos"
 *       Si pas featured: affiche une image par défaut + texte générique
 *
 * CONTENU DYNAMIQUE:
 *   Le composant s'adapte selon si featured est fourni ou pas:
 *   - Affiche son backdrop (image de fond) ou l'image défaut
 *   - Titre du film ou "CINEBONNY"
 *   - Synopsis spécifique ou texte généralisé
 *   - Badges: "À la une", type (Film/Série), note, année
 *   - CTA spécifiques au film vs génériques
 *
 * ÉLÉMENTS VISUELS:
 *   1. Image de fond plein écran (aspect large: h-[92vh])
 *   2. Dégradés multiples pour lisibilité du texte par-dessus l'image
 *   3. Animations au chargement: fade-in, fade-up
 *   4. Indicateur "Découvrir" avec flèche animée en bas
 *   5. Boutons CTA: "Regarder" (foreground) + "Plus d'infos" (secondary)
 *
 * RESPONSIVE:
 *   - Hauteur: h-[92vh] (92% de la viewport height)
 *   - Titre: scale 6xl mobile → 9xl sur desktop
 *   - Boutons: flex-wrap sur mobile, horizontaux sur desktop
 *   - Texte aligné en bas sur mobile, centré vertiquement sur desktop
 *
 * PERFORMANCE:
 *   - img sans lazy loading (LCP - Largest Contentful Paint)
 *   - Image pré-chargée pour être rapide à afficher
 *
 * POINTS D'APPRENTISSAGE:
 *   - Responsive Hero avec aspect ratio: h-[92vh] min-h-[640px]
 *   - Dégradés multiples pour lisibilité: bg-gradient-hero + bg-gradient-hero-side
 *   - Optionalité: ?? pour fournir des valeurs par défaut
 *   - Conditional rendering: featured ? (...) : (...)
 *   - Animations CSS: animate-fade-in, animate-fade-up
 */
const Hero = ({ featured }) => {
  const backdrop = featured?.backdrop ?? heroBackdrop;
  const title = featured?.title ?? "CINEBONNY";
  const overview =
    featured?.overview ??
    "Plongez dans une collection cinématographique soignée. Des chefs-d'œuvre intemporels aux blockbusters d'aujourd'hui — tous vos films et séries, dans une seule lumière.";

  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
      {/* Image de fond — pas de lazy loading car c'est l'élément LCP */}
      <img
        src={backdrop}
        alt={featured ? `Image de fond de ${featured.title}` : "Cinéma"}
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover scale-105 animate-fade-in"
      />
      {/* Dégradés multiples pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-hero-side" />

      {/* Particules / vignette */}
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_100%)] bg-black/30" />

      {/* Contenu */}
      <div className="relative z-10 h-full container mx-auto px-4 lg:px-8 flex items-end md:items-center pb-32 md:pb-0">
        <div className="max-w-2xl animate-fade-up">
          {featured ? (
            <div className="flex items-center gap-3 mb-5 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-xs shadow-glow">
                <Sparkles className="h-3 w-3" />À la une
              </span>
              <span className="px-2.5 py-1 rounded-md bg-secondary/80 backdrop-blur text-xs font-semibold uppercase tracking-wider">
                {featured.type === "movie" ? "Film" : "Série"}
              </span>
              <span className="flex items-center gap-1 text-gold font-semibold">
                <Star className="h-4 w-4 fill-current" />
                {featured.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">{featured.year}</span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-xs shadow-glow">
              <Sparkles className="h-3 w-3" />
              Bienvenue
            </span>
          )}

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-wider mb-5 leading-[0.9]">
            <span className="block text-foreground drop-shadow-2xl">
              {title}
            </span>
          </h1>

          {featured && featured.genres.length > 0 && (
            <p className="text-sm uppercase tracking-[0.3em] text-gold/90 mb-4 font-semibold">
              {featured.genres.slice(0, 3).join(" · ")}
            </p>
          )}

          <p className="text-base md:text-lg text-foreground/90 mb-8 max-w-xl line-clamp-3 leading-relaxed">
            {overview}
          </p>

          <div className="flex flex-wrap gap-3">
            {featured ? (
              <>
                <Link
                  to={`/${featured.type === "movie" ? "film" : "serie"}/${featured.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-foreground px-7 py-3.5 font-bold text-background transition-smooth hover:bg-foreground/90 hover:scale-105"
                >
                  <Play className="h-5 w-5 fill-current" /> Regarder
                </Link>
                <Link
                  to={`/${featured.type === "movie" ? "film" : "serie"}/${featured.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary/70 backdrop-blur-md border border-border/50 px-7 py-3.5 font-bold text-foreground transition-smooth hover:bg-secondary"
                >
                  <Info className="h-5 w-5" /> Plus d'infos
                </Link>
              </>
            ) : (
              <Link
                to="/films"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-bold text-primary-foreground transition-smooth hover:bg-primary-glow animate-pulse-glow"
              >
                <Play className="h-5 w-5 fill-current" /> Explorer le catalogue
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest animate-fade-in">
        <span>Découvrir</span>
        <span className="h-8 w-px bg-gradient-to-b from-foreground/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
