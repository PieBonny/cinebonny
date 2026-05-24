# Vue d’ensemble du site CineBonny

## 1. Présentation générale

CineBonny est un catalogue de films et séries construit avec React et Vite. Il combine une API publique TMDB pour les contenus multimédias et un backend local `json-server` pour gérer les avis utilisateurs.

L’application met en œuvre :

- un routing centralisé avec **React Router v6 Data API**
- des **loaders** pour charger les données avant l’affichage
- des **actions** pour envoyer les formulaires et gérer le CRUD des avis
- une interface responsive avec **Tailwind CSS** et des composants **shadcn/ui**

## 2. Objectifs du site

- proposer une interface moderne pour découvrir des films et des séries
- permettre la recherche, le filtrage et la consultation de détails
- gérer une section d’avis utilisateurs avec création, édition et suppression
- fournir un mini système d’authentification via `localStorage`

## 3. Stack technique

- React 18 + composants fonctionnels
- Vite 5
- React Router DOM v6 (Data API)
- Tailwind CSS + tokens HSL
- json-server pour l’API locale
- TMDB API pour les données catalogue
- shadcn/ui pour les composants UI
- JavaScript (.jsx), pas de TypeScript

## 4. Étapes de création

1. **Initialisation du projet**
   - Générer une app React avec Vite
   - Installer React Router, Tailwind, json-server, shadcn/ui, et autres dépendances

2. **Définir l’architecture des dossiers**
   - `src/main.jsx` : point d’entrée
   - `src/App.jsx` : providers et router
   - `src/router.jsx` : routes, loaders, actions
   - `src/pages/` : pages pour chaque route
   - `src/components/` : composants réutilisables
   - `src/services/` : accès aux APIs
   - `src/context/` : auth global

3. **Construire le router centralisé**
   - créer les routes principales dans `router.jsx`
   - associer chaque page à un `loader` et/ou `action`
   - définir une route `*` pour `NotFound`

4. **Développer les services de données**
   - `src/services/tmdb.js` pour les appels TMDB
   - `src/services/reviews.js` pour le CRUD locale et le fallback `localStorage`

5. **Créer les pages principales**
   - `Home.jsx` : accueil avec sections tendance/populaire/meilleur score
   - `Catalog.jsx` : liste filtrable de films/séries
   - `Search.jsx` : recherche par query string
   - `MediaDetails.jsx` : fiche détaillée d’une œuvre
   - `Reviews.jsx` / `ReviewDetail.jsx` : gestion des avis
   - `Login.jsx` / `Profile.jsx` : auth mock

6. **Mettre en place l’UI**
   - composants génériques : `Navbar`, `Footer`, `MediaGrid`, `MediaRow`, `MovieCard`
   - utiliser `shadcn/ui` pour éléments de formulaire et dialogues
   - styliser avec Tailwind et animations

7. **Tester et Itérer**
   - lancer `npm run dev:full`
   - vérifier les routes, les formulaires et la communication avec `json-server`
   - ajuster la responsivité et l’expérience mobile

## 5. Architecture du projet

```
cinebonny/
├── db.json
├── package.json
├── vite.config.js
├── tailwind.config.js
├── public/
│   └── placeholder.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── router.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── MediaRow.jsx
│   │   ├── MediaGrid.jsx
│   │   ├── MovieCard.jsx
│   │   └── ui/...
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Catalog.jsx
│   │   ├── MediaDetails.jsx
│   │   ├── Search.jsx
│   │   ├── Reviews.jsx
│   │   ├── ReviewDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── tmdb.js
│   │   └── reviews.js
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   └── use-toast.js
│   └── context/
│       └── AuthContext.jsx
```

- `src/router.jsx` est le cœur du flux de navigation. C’est ici que les pages sont associées à leurs loaders/actions.
- `src/services/` encapsule la logique d’accès aux données : TMDB pour le catalogue, `json-server` pour les avis.
- `src/components/` contient les briques réutilisables et le layout global.

## 6. Logique métier principale

### React Router Data API

- `loaders` : chargent les données nécessaires à la route avant le rendu
- `actions` : traitent les formulaires React Router (`<Form>`) et gèrent POST/PUT/DELETE
- `useLoaderData()` permet aux pages de récupérer directement les données reçues par le loader

### Catalogue & Recherche

- `Catalog.jsx` utilise les query params (`genre`, `year`, `minRating`, `page`) pour afficher un catalogue filtré
- `Search.jsx` lit `?q=` et interroge TMDB pour afficher les résultats

### Fiche média

- `MediaDetails.jsx` récupère les détails d’un film ou d’une série par `id`
- affiche synopsis, bande-annonce, casting et suggestions

### Section avis

- `Reviews.jsx` liste les avis stockés dans `db.json`
- `ReviewDetail.jsx` permet d’éditer et supprimer un avis via `<Form>`
- `reviews.js` contient le fallback vers `localStorage` si `json-server` n’est pas disponible

### Authentification

- `AuthContext.jsx` gère l’état de connexion via `localStorage`
- `Login.jsx` simule l’authentification
- `Profile.jsx` est une route protégée qui affiche les informations utilisateur

### UI & expérience

- Navigation responsive avec barre et layout global
- Affichage des rangées type Netflix via `MediaRow.jsx`
- Grilles responsives dans `MediaGrid.jsx`
- Composants UI stylés avec Tailwind et `shadcn/ui`
- Détection mobile dans `use-mobile.jsx`

## 7. Points clés à retenir

- Le routeur Data API centralise le flux de données et sépare bien lecture/écriture
- La logique de récupération est isolée dans `services/` pour faciliter les tests et évolutions
- La gestion des avis repose sur un backend local simple, réutilisable et facile à remplacer
- Les composants sont majoritairement stateless et reçoivent leurs props de la page
- `App.jsx` reste léger : il fournit les providers et le router
- Le design est implémenté via un système de classes Tailwind, ce qui facilite les ajustements de thème

## 8. Ce qui fonctionne bien

- navigation fluide entre les pages
- recherche et filtres dynamiques
- affichage responsive pour mobile/tablette
- CRUD des avis avec formulaire géré par React Router
- fallback local lorsque `json-server` est absent
- structure claire des dossiers et séparation des responsabilités

## 9. Améliorations possibles

- **TypeScript** pour plus de robustesse et meilleure maintenabilité
- **Tests unitaires / d’intégration** (Vitest, React Testing Library)
- **authentification réelle** avec backend sécurisé
- gestion plus fine des erreurs réseau et UX d’erreur
- **pagination optimisée** et chargement infini
- amélioration de l’**accessibilité** (ARIA, clavier, contrastes)
- mise en cache des données TMDB pour réduire les appels réseau
- extraction d’un vrai design system pour les composants UI
- internationalisation (i18n) si on veut supporter plusieurs langues
- optimiser les performances avec `React.memo`, lazy loading, `Suspense`

## 10. Commandes utiles

- `npm install`
- `npm run dev`
- `npm run api`
- `npm run dev:full`
- `npm run build`
- `npm run preview`
- `npm run lint`

## 11. Conseils de maintenance

- garder `router.jsx` comme point d’entrée unique du routing
- documenter chaque loader/action au fur et à mesure
- éviter de mélanger logique métier et rendu UI dans les mêmes composants
- centraliser les constantes TMDB et les clés d’API dans un fichier dédié
- maintenir les services `tmdb.js` et `reviews.js` indépendants du rendu
