# 🎬 CineBonny

> Catalogue cinématographique React 
> **`createBrowserRouter` + loaders + actions + `<Form>`** (react-router-dom v6 Data API),

---

## 📋 Sommaire

1. [Présentation](#-présentation)
2. [Stack technique](#-stack-technique)
3. [Prérequis](#-prérequis)
4. [Installation et lancement (Visual Studio Code)](#-installation-et-lancement-visual-studio-code)
5. [Scripts disponibles](#-scripts-disponibles)
6. [Architecture](#-architecture)
7. [Comment fonctionnent les loaders et actions](#-comment-fonctionnent-les-loaders-et-actions)
8. [Couverture des critères du LLLC](#-couverture-des-critères-du-lllc)
9. [Documentation & utilisation de l'IA](#-documentation--utilisation-de-lia)

---

## 🎯 Présentation

**CineBonny** permet de :

- 🏠 Parcourir un **accueil** dynamique (rangées tendances, populaires, mieux notés)
- 🔍 **Rechercher** un film ou une série par titre (URL `?q=…`)
- 🎞️ **Filtrer** un catalogue par genre, époque, note (URL `?genre=&year=&minRating=&page=`)
- 📺 **Consulter le détail** d'une œuvre (synopsis, casting, bande-annonce YouTube)
- ✍️ **Publier des avis** (CRUD complet via `<Form>` + `json-server`)
  - Liste : `/avis`
  - Détail + édition + suppression : `/avis/:id`
- 👤 **S'inscrire / se connecter** (mock localStorage) et éditer son **profil**

Données catalogue : API publique [TMDB](https://www.themoviedb.org/).
Données avis : API REST locale **`json-server`** (`db.json`) avec fallback `localStorage`.

---

## 🛠️ Stack technique

| Catégorie     | Technologie                                                                            |
| ------------- | -------------------------------------------------------------------------------------- |
| Framework UI  | **React 18** (composants fonctionnels + hooks)                                         |
| Bundler       | **Vite 5**                                                                             |
| Routing       | **React Router DOM v6 — Data API** (`createBrowserRouter`, loaders, actions, `<Form>`) |
| Icônes        | `react-icons` (Fa6) + `lucide-react`                                                   |
| Styles        | **Tailwind CSS v3** + tokens HSL personnalisés                                         |
| Composants UI | shadcn/ui (Radix wrappers, **convertis en JSX**)                                       |
| Backend mock  | **json-server** (REST CRUD local sur `db.json`)                                        |
| API externe   | TMDB API v3                                                                            |
| Langage       | **JavaScript (.jsx) — 100% pur, aucun TypeScript**                                     |

---

## ✅ Prérequis

- **Node.js** ≥ 20 (`node -v`)
- **npm** ≥ 10
- **Visual Studio Code** (recommandé) + extensions :
  - _Tailwind CSS IntelliSense_
  - _ESLint_
  - _ES7+ React/Redux/React-Native snippets_
- Un navigateur moderne

---

## 📦 Installation et lancement (Visual Studio Code)

### 1. Décompresser l'archive

Décompressez `cinebonny-source.zip` n'importe où sur votre disque.

### 2. Ouvrir le projet dans VS Code

```bash
code cinebonny
```

Ou : **File → Open Folder…** → sélectionnez le dossier `cinebonny`.

### 3. Ouvrir le terminal intégré

`Terminal → New Terminal` (ou `Ctrl+ù` / `Ctrl+ù`).

### 4. Installer les dépendances

```bash
npm install
```

(Première installation : ≈ 1 à 2 minutes.)

### 5. Lancer le projet

**Option A — tout en une commande (recommandé)** :

```bash
npm run dev:full
```

Démarre **simultanément** :

- 🌐 Le front Vite : <http://localhost:8080>
- 🔌 L'API json-server : <http://localhost:8000/reviews>

**Option B — deux terminaux séparés** :

```bash
# Terminal 1
npm run dev      # → http://localhost:8080

# Terminal 2
npm run api      # → http://localhost:8000
```

**Option C — front seul (avis en localStorage)** :

```bash
npm run dev
```

Sans `json-server`, la page `/avis` bascule **automatiquement** sur
`localStorage`. Le reste de l'app fonctionne via TMDB en ligne.

### 6. Ouvrir le navigateur

Allez sur <http://localhost:8080>. ✨

---

## 📜 Scripts disponibles

| Script             | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Démarre Vite (front) sur le port 8080        |
| `npm run api`      | Démarre json-server sur le port 8000         |
| `npm run dev:full` | **Lance front + API en parallèle**           |
| `npm run build`    | Compile pour la production (dossier `dist/`) |
| `npm run preview`  | Sert le build local pour vérification        |
| `npm run lint`     | Analyse statique avec ESLint                 |

---

## 📂 Architecture

```
cinebonny/
├── db.json                       # Base json-server (avis)
├── package.json
├── vite.config.js                # Config Vite (alias @ → src)
├── tailwind.config.js            # Tokens design system
├── public/
│   └── placeholder.svg
├── src/
│   ├── main.jsx                  # Point d'entrée
│   ├── App.jsx                   # <RouterProvider /> + providers globaux
│   ├── router.jsx                # ⭐ TOUT le routing : routes + loaders + actions
│   ├── index.css                 # Tokens HSL + animations
│   │
│   ├── components/               # Composants réutilisables
│   │   ├── Layout.jsx            # ← Layout exigé (Navbar + main + Footer)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── MediaRow.jsx          # Rangée scrollable façon Netflix
│   │   ├── MediaGrid.jsx
│   │   ├── MovieCard.jsx
│   │   └── ui/                   # shadcn/ui (tout en JSX)
│   │
│   ├── pages/                    # Une page = une route
│   │   ├── Home.jsx              # /          (loader homeLoader)
│   │   ├── Catalog.jsx           # /films, /series, /classiques
│   │   ├── MediaDetails.jsx      # /film/:id, /serie/:id
│   │   ├── Search.jsx            # /recherche?q=…
│   │   ├── Reviews.jsx           # /avis      (loader + action POST)
│   │   ├── ReviewDetail.jsx      # /avis/:id  (avec <Form> edit/delete)
│   │   ├── Login.jsx             # /login
│   │   ├── Profile.jsx           # /profil  (route protégée)
│   │   └── NotFound.jsx          # *
│   │
│   ├── services/
│   │   ├── tmdb.js               # Client TMDB (films/séries)
│   │   └── reviews.js            # Client CRUD avis (json-server + fallback)
│   │
│   ├── hooks/
│   │   ├── use-mobile.jsx        # Détection mobile (utilisé par Sidebar)
│   │   └── use-toast.js          # Toasts shadcn
│   │
│   └── context/
│       └── AuthContext.jsx       # Auth mock localStorage
└── README.md
```

---

## 🎓 Comment fonctionnent les loaders et actions

### Loader (lecture)

Un **loader** est une fonction `async` exécutée par le router **avant** le
rendu de la page. Le résultat est exposé via `useLoaderData()`.

```jsx
// router.jsx
async function reviewsLoader() {
  const reviews = await fetchReviews();
  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return { reviews };
}

createBrowserRouter([
  { path: "/avis", element: <Reviews />, loader: reviewsLoader },
]);

// pages/Reviews.jsx
const { reviews } = useLoaderData(); // 🎉 plus besoin de useEffect !
```

### Action (écriture)

Une **action** est une fonction `async` exécutée quand un `<Form>` est
soumis vers la route. Elle fait la mutation puis le router **relance
automatiquement** le loader pour rafraîchir l'UI.

```jsx
// router.jsx
async function createReviewAction({ request }) {
  const formData = await request.formData();
  await createReview({
    mediaTitle: formData.get("mediaTitle"),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment"),
    author: formData.get("author"),
  });
  return { ok: true, message: "Avis publié ✨" };
}

// pages/Reviews.jsx
<Form method="post">
  <input name="mediaTitle" />
  <input name="rating" type="number" />
  <textarea name="comment" />
  <button type="submit">Publier</button>
</Form>;
```

### Suppression (calque exact de l'exemple `JobDetailPage`)

```jsx
// pages/ReviewDetail.jsx
<Form
  method="post"
  action={`/avis/${review.id}/delete`}
  onSubmit={(e) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      e.preventDefault();
    }
  }}
>
  <button type="submit">Supprimer l'avis</button>
</Form>
```

→ Le router exécute `deleteReviewAction` (qui appelle `deleteReview`) puis
`redirect("/avis")`. Aucun `fetch` manuel, aucun `useState`.

---

## 🎓 Couverture des critères du LLLC

| Critère exigé                                       | Où le retrouver dans le code                                         |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| Composants fonctionnels                             | Tous les fichiers `.jsx`                                             |
| **≥ 1 composant réutilisable**                      | `MovieCard`, `MediaRow`, `MediaGrid`, `Catalog`, `Layout`            |
| Architecture propre                                 | Séparation `pages/` `components/` `services/` `context/`             |
| Transmission via props parent → enfant              | Ex: `MediaRow items={…}`, `Catalog title="…"` paramétré              |
| Nommage explicite + commentaires                    | JSDoc en tête de chaque fichier                                      |
| **`useState`** (état local)                         | `Login`, `Profile`, `Navbar`, `ReviewDetail` (mode édition)…         |
| **`useEffect`** (≥ 1 utilisation)                   | `AuthContext`, `Navbar` (scroll), `Profile` (sync displayName)       |
| **État de chargement**                              | `useNavigation()` dans `Catalog` et `Reviews` (`navigation.state`)   |
| **React Router avec ≥ 3 routes**                    | `router.jsx` : 12 routes                                             |
| **Pattern createBrowserRouter + loaders + actions** | `router.jsx` (centralisé)                                            |
| **`<Form method="post">` + `useLoaderData`**        | `Reviews.jsx`, `ReviewDetail.jsx`                                    |
| Connexion à une API                                 | TMDB (catalogue) + json-server (avis)                                |
| Gestion asynchrone                                  | `async/await` partout (`services/`, `router.jsx`)                    |
| **CRUD complet**                                    | `Reviews` (Create/Read) + `ReviewDetail` (Read/Update/Delete)        |
| Formulaires                                         | `Login.jsx`, `Reviews.jsx`, `ReviewDetail.jsx`, `Profile.jsx`        |
| Interface responsive                                | Tailwind grid responsive partout                                     |
| **≥ 1 fichier Layout**                              | `src/components/Layout.jsx` utilisé dans toutes les pages            |
| Feedback utilisateur                                | `useActionData()` (`Reviews`), erreurs (`Login`), `errorElement` 404 |

---

## 🤖 Documentation & utilisation de l'IA

### Outils utilisés

Ce projet a été développé avec l'assistance d'une IA de génération de code
pour :

- Intégration shadcn/ui
- La **génération de composants UI** (Hero, MovieCard, MediaRow…)
- L'**intégration de l'API TMDB** (mappers, gestion des erreurs)
- Le **refactoring** vers le pattern react-router data API (loaders + actions + Form)
- La rédaction de la **documentation** (commentaires JSDoc, README)

### Parties pensées / supervisées manuellement

- Choix de l'architecture et du pattern data router
- Définition du **contrat de données interne** (`Media`, ids `m123`/`s456`)
- Découpage des **loaders/actions** entre catalogue (TMDB) et avis (json-server)
- Conception du **CRUD avis** avec fallback `localStorage`
- Calque exact du pattern `JobDetailPage` du cours pour `ReviewDetail`


Données films/séries fournies par [TMDB](https://www.themoviedb.org/).
#   c i n e b o n n y  
 