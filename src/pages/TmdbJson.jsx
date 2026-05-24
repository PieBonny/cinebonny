import { useEffect, useMemo, useState } from "react";
import { fetchRawTmdb } from "@/services/tmdb.js";

const ENDPOINTS = [
  { label: "Tendances (semaine)", path: "/trending/all/week" },
  { label: "Films populaires", path: "/movie/popular" },
  { label: "Séries populaires", path: "/tv/popular" },
  { label: "Films les mieux notés", path: "/movie/top_rated" },
  { label: "Séries les mieux notées", path: "/tv/top_rated" },
];

const TmdbJson = () => {
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0].path);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadJson = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchRawTmdb(endpoint);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJson();
  }, [endpoint]);

  const content = useMemo(
    () => (data ? JSON.stringify(data, null, 2) : ""),
    [data],
  );

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="mb-6 space-y-3">
        <h1 className="text-3xl font-bold">JSON TMDB</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Cette page affiche la réponse brute de l’API TMDB pour un endpoint
          sélectionné. Vous pouvez copier le JSON ou changer d’endpoint.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end mb-6">
        <label className="block text-sm font-medium text-foreground/80">
          Endpoint TMDB
          <select
            value={endpoint}
            onChange={(event) => setEndpoint(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ENDPOINTS.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={loadJson}
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Rafraîchir
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-background/95 p-4 shadow-sm">
        <div className="mb-3 rounded-2xl bg-secondary/80 px-4 py-3 text-sm text-foreground/80">
          URL API :{" "}
          <span className="font-mono text-xs">
            https://api.themoviedb.org/3{endpoint}
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-foreground/80">
            Chargement des données TMDB…
          </p>
        ) : error ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            <strong>Erreur :</strong> {error}
          </div>
        ) : (
          <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-foreground/90">
            {content}
          </pre>
        )}
      </div>
    </main>
  );
};

export default TmdbJson;
