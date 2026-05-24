/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * FICHIER: App.jsx (Composant racine)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Le composant PRINCIPAL qui enveloppe toute l'application.
 *   Initialise les providers et le routeur.
 *
 * ARCHITECTURE (de l'intérieur vers l'extérieur):
 *   1. RouterProvider: Fournit le routeur React Router
 *      - router vient de router.jsx (createBrowserRouter(...))
 *      - Gère la navigation et les loaders/actions
 *   2. AuthProvider: Fournit l'authentification globale
 *      - user, isAuthenticated, login, logout, etc.
 *      - Accessible via useAuth() partout dans l'app
 *   3. TooltipProvider: Shadcn UI provider
 *      - Nécessaire pour les tooltips shadcn
 *   4. Toaster components: Deux types de notifications
 *      - Sonner: Notifications modernes et belles
 *      - Toaster: Fallback pour certains cas
 *
 * PROVIDERS (ordre important!):
 *   - Plus le provider est INTÉRIEUR, plus sa portée est LIMITÉE
 *   - Ici: RouterProvider engloberait tout (c'est la structure)
 *   - AuthProvider doit envelopper RouterProvider pour que useAuth marche partout
 *   - TooltipProvider pour shadcn UI
 *   - Toasters pour les notifications
 *
 * POURQUOI CETTE STRUCTURE?
 *   - RouterProvider: Gère les routes, lazy loading, code splitting
 *   - AuthProvider: État global d'authentification (persiste en localStorage)
 *   - Toasters: Notifications (belles, persistantes)
 *   - Tooltips: Composants shadcn qui ont besoin du contexte
 *
 * ALTERNATIVE:
 *   En production avec Redux, ça ressemblerait à:
 *   <ReduxProvider>
 *     <AuthProvider>
 *       <RouterProvider />
 *     </AuthProvider>
 *   </ReduxProvider>
 *
 * POINTS D'APPRENTISSAGE:
 *   - Context Providers: ordre d'imbrication = portée
 *   - AuthProvider custom vs Firebase Auth
 *   - React Router v6 Data API (RouterProvider)
 *   - Multiple providers: composable et modulaire
 *   - Props children: comment les providers fonctionnent
 */
import { RouterProvider } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { router } from "./router.jsx";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </AuthProvider>
);

export default App;
