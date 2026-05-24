/**
 * Service de gestion des avis utilisateurs dans Cinebonny.
 *
 * Fournit les opérations CRUD pour les avis et utilise un
 * fallback localStorage si l’API locale json-server n’est pas disponible.
 */

const API_URL = "http://localhost:8000/reviews";
const STORAGE_KEY = "cinebonny.reviews";

// ─── Stockage local (fallback) ─────────────────────────────────────────────

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeLocal(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// ─── Détection : json-server est-il joignable ? ────────────────────────────

let useHttp = null; // null = inconnu, true/false = mémorisé

async function isHttpAvailable() {
  if (useHttp !== null) return useHttp;
  try {
    const res = await fetch(API_URL, { method: "HEAD" });
    useHttp = res.ok;
  } catch {
    useHttp = false;
  }
  return useHttp;
}

// ─── API publique : CRUD ───────────────────────────────────────────────────

/**
 * READ ONE — récupère un avis par id (utilisé par /avis/:id).
 */
export async function fetchReview(id) {
  if (await isHttpAvailable()) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
  const all = readLocal();
  return all.find((r) => String(r.id) === String(id)) ?? null;
}

/** READ — récupère tous les avis (optionnellement filtrés par mediaId). */
export async function fetchReviews(mediaId) {
  if (await isHttpAvailable()) {
    const url = mediaId ? `${API_URL}?mediaId=${mediaId}` : API_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Impossible de charger les avis.");
    return res.json();
  }
  // Fallback localStorage
  const all = readLocal();
  return mediaId ? all.filter((r) => r.mediaId === mediaId) : all;
}

/** CREATE — ajoute un nouvel avis. */
export async function createReview(review) {
  const newReview = {
    ...review,
    createdAt: new Date().toISOString(),
  };
  if (await isHttpAvailable()) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });
    if (!res.ok) throw new Error("Échec de la création.");
    return res.json();
  }
  // Fallback : id auto-incrémenté
  const all = readLocal();
  const withId = { ...newReview, id: Date.now() };
  writeLocal([withId, ...all]);
  return withId;
}

/** UPDATE — modifie un avis existant. */
export async function updateReview(id, patch) {
  if (await isHttpAvailable()) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Échec de la modification.");
    return res.json();
  }
  const all = readLocal();
  const normalizedId = String(id);
  const next = all.map((r) =>
    String(r.id) === normalizedId ? { ...r, ...patch } : r,
  );
  writeLocal(next);
  return next.find((r) => String(r.id) === normalizedId);
}

/** DELETE — supprime un avis par id. */
export async function deleteReview(id) {
  if (await isHttpAvailable()) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Échec de la suppression.");
    return true;
  }
  const all = readLocal();
  const normalizedId = String(id);
  writeLocal(all.filter((r) => String(r.id) !== normalizedId));
  return true;
}
