/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * HOOK: useIsMobile()
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Détecte si l'appareil affichant le site est MOBILE ou DESKTOP.
 *   Utile pour afficher/cacher des éléments selon la taille de l'écran.
 *   Alternative à Tailwind breakpoints (mais plus granulaire).
 *
 * POURQUOI PAS JUSTE TAILWIND BREAKPOINTS?
 *   Tailwind (md:, lg:, etc.) fonctionne avec CSS @media queries.
 *   C'est le meilleur choix pour 99% des cas.
 *   Mais parfois on a besoin de la valeur booléenne EN JAVASCRIPT.
 *   Exemple: charger plus de contenu sur desktop, limiter sur mobile (JS logic).
 *
 * FONCTIONNEMENT:
 *   MOBILE_BREAKPOINT = 768px (standard Tailwind pour md:)
 *   1. Crée un MediaQueryList avec window.matchMedia()
 *   2. Écoute les changements de taille d'écran (resize)
 *   3. Retourne true si largeur < 768px, false sinon
 *   4. Cleanup: retire l'event listener au unmount
 *
 * EXEMPLE D'USAGE:
 *   const isMobile = useIsMobile();
 *   if (isMobile) return <MobileMenu />;
 *   return <DesktopMenu />;
 *
 * DÉTAILS TECHNIQUES:
 *   window.matchMedia(): API navigateur native pour les media queries
 *   "(max-width: 767px)": Teste si viewport < 768px
 *   addEventListener("change"): Appelé à chaque redimensionnement
 *   cleanup dans useEffect: return () => ... retire le listener
 *   !!isMobile: Force conversion boolean (si isMobile = undefined, devient false)
 *
 * STATE INITIAL:
 *   const [isMobile, setIsMobile] = useState(undefined)
 *   Commençe à undefined car on ne sait pas avant le first render (SSR problem)
 *   Le premier useEffect le remplit
 *   Cela évite le "hydration mismatch" côté SSR
 *
 * RESPONSIVE USAGE:
 *   const isMobile = useIsMobile();
 *   return (
 *     <div className={isMobile ? "w-full" : "w-96"}>
 *       Contenu adapté
 *     </div>
 *   );
 *
 * POINTS D'APPRENTISSAGE:
 *   - window.matchMedia() pour média queries en JS
 *   - Custom hooks pour encapsuler la logique
 *   - useEffect avec cleanup (removeEventListener)
 *   - useState avec undefined pour éviter hydration mismatch
 *   - BREAKPOINT_CONSTANT pour eviter duplication
 */
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(undefined);
    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);
    return !!isMobile;
}
