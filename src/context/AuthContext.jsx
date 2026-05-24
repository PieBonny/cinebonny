/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * FICHIER: AuthContext.jsx (Authentification globale)
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Gestion GLOBALE de l'authentification utilisateur.
 *   Stocke le user courant en mémoire et dans localStorage.
 *   Disponible partout dans l'app via le hook useAuth().
 *
 * ⚠️ IMPORTANTE - IMPLÉMENTATION MOCK:
 *   Ce système est une SIMULATION pédagogique:
 *   ❌ Les mots de passe sont stockés en clair (TRIÈS DANGEREUX en prod)
 *   ❌ Aucun chiffrement
 *   ❌ Aucun backend sécurisé
 *   ✅ Idéal pour apprendre Comment ça marche
 *
 * STRUCTURE:
 *   1. AuthProvider: Wrapper au niveau root (voir App.jsx ou main.jsx)
 *   2. AuthContext: Contexte React qui stocke { user, isAuthenticated, methods }
 *   3. useAuth(): Hook pour accéder au contexte n'importe où
 *
 * STOCKAGE:
 *   - localStorage cinebonny.users: Map { [email]: { password, displayName, createdAt } }
 *   - localStorage cinebonny.session: Email de l'utilisateur logé
 *   Ces données PERSISTENTÉE quand on ferme/réouvre le navigateur.
 *
 * FLUX UTILISATEUR:
 *   INSCRIPTION:
 *     1. User ouvre /login
 *     2. Bascule à "S'inscrire"
 *     3. Entre email + password + displayName
 *     4. Clique "S'inscrire"
 *     5. register() appelée
 *     6. AuthContext crée l'utilisateur dans localStorage
 *     7. User automatiquement "logé" et redirigé /profil
 *
 *   CONNEXION:
 *     1. User ouvre /login
 *     2. Entre email + password
 *     3. Clique "Se connecter"
 *     4. login() appelée
 *     5. Vérifie que email existe ET password est correct
 *     6. Si OK: localStorage.setItem("cinebonny.session", email)
 *     7. Redirige /profil
 *     8. Au rechargement du navigateur: useEffect charge la session
 *
 *   DÉCONNEXION:
 *     1. User clique "Se déconnecter" sur /profil
 *     2. logout() appelée
 *     3. localStorage.removeItem("cinebonny.session")
 *     4. user reset à null
 *     5. Redirige /
 *
 * HOOKS ET CONTEXT:
 *   - createContext(null): Crée le contexte AuthContext
 *   - useContext(AuthContext): Récupère depuis n'importe quel composant
 *   - useState: user en mémoire (null si pas logé)
 *   - useEffect: Restaurer session au mount
 *   - useCallback: Optimisation des fonctions (pas re-crées à chaque render)
 *
 * EXPOSE (via useAuth()):
 *   { user, isAuthenticated, register, login, logout, updateProfile }
 *
 * POINTS D'APPRENTISSAGE:
 *   - Context API pour l'état global
 *   - localStorage pour la persistence
 *   - useCallback pour mémoriser les functions
 *   - Try/catch JSON.parse pour robustesse
 *   - Guérilla-testing: localStorage existe même en offline
 *
 * LIMITATIONS ACTUELLES:
 *   - Pas de email verification
 *   - Pas de password reset
 *   - Pas de 2FA
 *   - Session ne expire jamais
 *   - Pas de CORS/sécurité backend
 *   → OK pour un site pédagogique, JAMAIS pour production!
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const STORAGE_USERS = "cinebonny.users"; // map { [email]: { password, displayName, createdAt, role, favorites } }
const STORAGE_SESSION = "cinebonny.session"; // email de l'utilisateur connecté
const DEFAULT_ADMIN_EMAIL = "admin@cinebonny.local";
const DEFAULT_ADMIN_PASSWORD = "admin123";

const AuthContext = createContext(null);

/** Charge la map des utilisateurs depuis localStorage. */
function loadUsers() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_USERS)) ?? {};
    return Object.fromEntries(
      Object.entries(raw).map(([email, user]) => [
        email,
        {
          password: user.password,
          displayName: user.displayName || email.split("@")[0],
          createdAt: user.createdAt || new Date().toISOString(),
          role: user.role || "user",
          favorites: user.favorites || [],
        },
      ]),
    );
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function ensureDefaultAdmin(users) {
  if (!users[DEFAULT_ADMIN_EMAIL]) {
    users[DEFAULT_ADMIN_EMAIL] = {
      password: DEFAULT_ADMIN_PASSWORD,
      displayName: "Administrateur",
      role: "admin",
      favorites: [],
      createdAt: new Date().toISOString(),
    };
    saveUsers(users);
  }
  return users;
}

export function AuthProvider({ children }) {
  // null = personne de connecté
  const [user, setUser] = useState(null);

  // À l'initialisation : on tente de restaurer la session précédente
  useEffect(() => {
    const email = localStorage.getItem(STORAGE_SESSION);
    const users = ensureDefaultAdmin(loadUsers());
    if (!email) return;
    if (users[email]) {
      setUser({
        email,
        displayName: users[email].displayName,
        createdAt: users[email].createdAt,
        role: users[email].role,
        favorites: users[email].favorites,
      });
    }
  }, []);

  /** Inscription : crée un nouveau compte. */
  const register = useCallback(({ email, password, displayName }) => {
    const users = ensureDefaultAdmin(loadUsers());
    if (users[email]) {
      throw new Error("Un compte existe déjà avec cet email.");
    }
    const createdAt = new Date().toISOString();
    users[email] = {
      password,
      displayName: displayName || email.split("@")[0],
      role: "user",
      favorites: [],
      createdAt,
    };
    saveUsers(users);
    localStorage.setItem(STORAGE_SESSION, email);
    setUser({
      email,
      displayName: users[email].displayName,
      createdAt,
      role: "user",
      favorites: [],
    });
  }, []);

  /** Création d'un compte sans se connecter (admin uniquement). */
  const createUser = useCallback(({ email, password, displayName, role }) => {
    const users = ensureDefaultAdmin(loadUsers());
    if (users[email]) {
      throw new Error("Un compte existe déjà avec cet email.");
    }
    const createdAt = new Date().toISOString();
    users[email] = {
      password,
      displayName: displayName || email.split("@")[0],
      role: role === "admin" ? "admin" : "user",
      favorites: [],
      createdAt,
    };
    saveUsers(users);
    return {
      email,
      displayName: users[email].displayName,
      createdAt,
      role: users[email].role,
      favorites: [],
    };
  }, []);

  /** Connexion : vérifie email + mot de passe. */
  const login = useCallback(({ email, password }) => {
    const users = ensureDefaultAdmin(loadUsers());
    const u = users[email];
    if (!u || u.password !== password) {
      throw new Error("Email ou mot de passe incorrect.");
    }
    localStorage.setItem(STORAGE_SESSION, email);
    setUser({
      email,
      displayName: u.displayName,
      createdAt: u.createdAt,
      role: u.role,
      favorites: u.favorites,
    });
  }, []);

  /** Déconnexion : efface la session courante (les comptes restent). */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_SESSION);
    setUser(null);
  }, []);

  /** Met à jour le pseudo affiché du compte courant. */
  const updateProfile = useCallback(
    ({ displayName }) => {
      if (!user) return;
      const users = loadUsers();
      if (!users[user.email]) return;
      users[user.email].displayName = displayName;
      saveUsers(users);
      setUser({ ...user, displayName });
    },
    [user],
  );

  const getAllUsers = useCallback(() => {
    const users = ensureDefaultAdmin(loadUsers());
    return Object.entries(users).map(([email, u]) => ({
      email,
      displayName: u.displayName,
      role: u.role,
      favorites: u.favorites || [],
      createdAt: u.createdAt,
    }));
  }, []);

  const updateUser = useCallback(
    (email, updates) => {
      const users = ensureDefaultAdmin(loadUsers());
      if (!users[email]) {
        throw new Error("Utilisateur introuvable.");
      }
      users[email] = {
        ...users[email],
        displayName: updates.displayName ?? users[email].displayName,
        role: updates.role ?? users[email].role,
        favorites: users[email].favorites || [],
        password: updates.password ?? users[email].password,
        createdAt: users[email].createdAt,
      };
      saveUsers(users);
      if (user?.email === email) {
        setUser({
          ...user,
          displayName: users[email].displayName,
          role: users[email].role,
          favorites: users[email].favorites,
        });
      }
    },
    [user],
  );

  const deleteUser = useCallback(
    (email) => {
      const users = ensureDefaultAdmin(loadUsers());
      if (!users[email]) {
        throw new Error("Utilisateur introuvable.");
      }
      delete users[email];
      saveUsers(users);
      if (user?.email === email) {
        localStorage.removeItem(STORAGE_SESSION);
        setUser(null);
      }
    },
    [user],
  );

  const addFavorite = useCallback(
    (media) => {
      if (!user) return;
      const users = ensureDefaultAdmin(loadUsers());
      const current = users[user.email];
      if (!current) return;
      const favorites = current.favorites || [];
      if (!favorites.some((item) => item.id === media.id)) {
        current.favorites = [{
          id: media.id,
          type: media.type,
          title: media.title,
          poster: media.poster,
          addedAt: new Date().toISOString(),
        }, ...favorites];
        saveUsers(users);
        setUser({ ...user, favorites: current.favorites });
      }
    },
    [user],
  );

  const removeFavorite = useCallback(
    (mediaId) => {
      if (!user) return;
      const users = ensureDefaultAdmin(loadUsers());
      const current = users[user.email];
      if (!current) return;
      current.favorites = (current.favorites || []).filter(
        (item) => item.id !== mediaId,
      );
      saveUsers(users);
      setUser({ ...user, favorites: current.favorites });
    },
    [user],
  );

  const isFavorite = useCallback(
    (mediaId) => {
      if (!user) return false;
      return (user.favorites || []).some((item) => item.id === mediaId);
    },
    [user],
  );

  const toggleFavorite = useCallback(
    (media) => {
      if (!user) return;
      if (isFavorite(media.id)) {
        removeFavorite(media.id);
      } else {
        addFavorite(media);
      }
    },
    [user, isFavorite, removeFavorite, addFavorite],
  );

  const value = {
    user,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook pratique pour consommer le contexte. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  return ctx;
}
