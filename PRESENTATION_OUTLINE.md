# 🎬 Guide de Présentation : CineBonny

Ce document contient la structure détaillée pour ta présentation PowerPoint de 10-15 minutes, ainsi que les points techniques clés à mettre en avant pour l'examen du LLLC.

---

## 📽️ Structure des Slides

### Slide 1 : Titre & Introduction
- **Visuel :** Logo CineBonny + screenshot de la page d'accueil.
- **Titre :** CineBonny — Catalogue de Films & Séries
- **Sous-titre :** Présentation technique - Projet Final React (LLLC CSL)
- **Points à dire :**
    - Bonjour à tous, je m'appelle [Ton Nom].
    - Je vais vous présenter mon projet "CineBonny", une application web moderne pour explorer des films et séries.

### Slide 2 : Concept & Fonctionnalités
- **Points clés :**
    - **Exploration :** Accueil dynamique (Tendances, Tops).
    - **Catalogue :** Filtrage avancé par Genre, Année, Note.
    - **Interaction :** Consultation de fiches détaillées (Casting, Synopsis, Trailer).
    - **Communauté :** Système d'avis complet (CRUD).
    - **Espace Perso :** Authentification et gestion des favoris.

### Slide 3 : Architecture Technique
- **Stack :** React 18, Vite, Tailwind CSS.
- **Architecture Propre :**
    - Découpage par dossier : `pages/`, `components/`, `services/`, `context/`.
    - 100% Composants fonctionnels.
- **Le Layout (Exigence du cours) :** 
    - Un seul fichier `Layout.jsx` qui encapsule la `Navbar`, le `main` et le `Footer`.
    - Garantit une cohérence visuelle parfaite sur toutes les pages.

### Slide 4 : Composants Réutilisables & Props
- **Exemple Phare :** `MovieCard.jsx`.
    - Utilisé dans l'accueil, le catalogue, la recherche et les favoris.
    - Reçoit des données via les **props** (ex: `media`, `featured`, `rank`).
- **Composition :** Utilisation de `MediaRow` et `MediaGrid` pour organiser les affiches.

### Slide 5 : Gestion des États (Hooks)
- **useState :** Utilisé pour les états locaux (ex: ouverture du lecteur vidéo, barre de recherche, menus mobiles).
- **useEffect :**
    - Restauration de la session utilisateur au démarrage (`AuthContext.jsx`).
    - Gestion de l'effet glassmorphisme de la Navbar au scroll.
- **Context API :** `AuthContext` pour l'état global (User, Favoris) persistant dans le `localStorage`.

### Slide 6 : Routage Moderne (Data API)
- **React Router v6 :** Utilisation de `createBrowserRouter`.
- **Nouveauté : Loaders & Actions.**
    - Plus de `useEffect` pour charger les données ! Les données sont prêtes **avant** que la page ne s'affiche.
    - Routes dynamiques : `/film/:id` et `/avis/:id`.
- **Gestion d'erreur :** Utilisation de `errorElement` (Page 404 automatique).

### Slide 7 : Intégration API & CRUD
- **Sources :** TMDB (externe) et `json-server` (local).
- **CRUD Complet sur les Avis :**
    - **C (Create) :** Formulaire de publication via `<Form method="post">`.
    - **R (Read) :** Liste et détails via Loaders.
    - **U (Update) :** Modification des avis existants.
    - **D (Delete) :** Suppression avec confirmation.
- **Gestion Asynchrone :** `async/await` utilisé partout dans les services.

### Slide 8 : UX/UI & Responsive
- **Design System :** Tailwind CSS pour un design moderne et responsive (Mobile-First).
- **Feedback Utilisateur :**
    - Messages de succès/erreur (Sonner / Toast).
    - **Loading States :** Le bouton "Publier" se désactive pendant l'envoi (`navigation.state === "submitting"`).

### Slide 9 : Documentation & Usage de l'IA
- **Documentation :** Chaque fichier est commenté avec JSDoc pour expliquer le rôle de chaque fonction.
- **Utilisation de l'IA :**
    - Utilisée pour le scaffolding initial et la génération de composants de base.
    - **Supervision humaine :** Logique de routing (loaders/actions) et architecture globale vérifiées et adaptées manuellement.

### Slide 10 : Conclusion & Questions
- **Résumé :** Une application performante, modulaire et prête pour la production.
- **Ouverture :** Place aux questions !

---

## 💡 Conseils pour le Jour J
1. **Démonstration en direct :** Montre comment tu publies un avis et comment il apparaît instantanément.
2. **Code source :** Si on te demande de montrer du code, ouvre `router.jsx` pour montrer les **loaders** ou `MovieCard.jsx` pour montrer les **props**.
3. **Réactivité :** Montre que le site change d'apparence sur mobile (mode responsive de l'inspecteur).
4. **README :** Mentionne que le `README.md` contient toutes les instructions pour lancer le projet en une commande (`npm run dev:full`).
