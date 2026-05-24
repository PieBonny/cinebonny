/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * FICHIER: main.jsx (Point d'entrée)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Fichier d'INITIALISATION de l'application React.
 *   C'est le premier fichier qui s'exécute dans le navigateur.
 *
 * FONCTIONNEMENT:
 *   1. Importe React et crée une root DOM (createRoot)
 *   2. Trouve le #root div en HTML (index.html)
 *   3. Rend le composant <App />
 *   4. Importe le CSS global (index.css)
 *
 * LIGNE À LIGNE:
 *   import { createRoot } from "react-dom/client"
 *     → Fonction pour monter React dans le DOM réel
 *   import App from "./App.jsx"
 *     → Composant principal (contient tous les providers)
 *   import "./index.css"
 *     → CSS global (Tailwind, variables CSS, resets)
 *   createRoot(document.getElementById("root"))
 *     → Récupère <div id="root"> d'index.html
 *     → Le crée comme root React pour le rendu
 *   .render(<App />)
 *     → Rend App et tous les sous-composants dedans
 *
 * LIEN AVEC index.html:
 *   index.html: <div id="root"></div>  ← C'est ici qu'on rend React
 *   main.jsx: createRoot(document.getElementById("root")).render(<App />)
 *   Résultat: App remplace le <div id="root"> vide
 *
 * TIMING:
 *   1. Navigateur télécharge index.html
 *   2. index.html charge <script src="/src/main.jsx"></script>
 *   3. Vite transpile main.jsx en JavaScript moderne
 *   4. main.jsx exécute: createRoot + render
 *   5. React prend le contrôle: <App /> s'affiche
 *   6. C'est parti! SPA (Single Page App) active
 *
 * STRUCTURE MINIMALE VS COMPLEX:
 *   Minimale (celle-ci): une ligne createRoot + render
 *   Complexe: aurait du code pour Redux, ErrorBoundary, etc.
 *   La nôtre est simple et claire = bon démarrage pédagogique
 *
 * POINTS D'APPRENTISSAGE:
 *   - Point d'entrée React vs vanilla JavaScript
 *   - createRoot (React 18) vs ReactDOM.render (ancien)
 *   - document.getElementById: requête du DOM simple
 *   - import CSS dans JS: Bundler Vite gère la dépendance
 *   - Ordre d'exécution: HTML → JS → render → UI
 */
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
