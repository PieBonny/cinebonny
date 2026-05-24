/**
 * PAGE: Admin (Gestion des utilisateurs)
 *
 * Objectif:
 *   Permet à l'administrateur de voir, ajouter, modifier et supprimer les comptes.
 *   Cette page est accessible uniquement aux utilisateurs ayant le rôle admin.
 */
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Plus, Trash2, PenLine } from "lucide-react";
import Layout from "@/components/Layout.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const Admin = () => {
  const {
    user,
    isAuthenticated,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useAuth();

  const [users, setUsers] = useState(getAllUsers());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "user",
  });
  const [editingEmail, setEditingEmail] = useState(null);
  const [editValues, setEditValues] = useState({ displayName: "", role: "user", password: "" });

  useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const refreshUsers = () => setUsers(getAllUsers());

  const showMessage = (text) => {
    setMessage(text);
    setError("");
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError("");
    try {
      createUser(newUser);
      refreshUsers();
      showMessage("Utilisateur créé avec succès.");
      setNewUser({ email: "", password: "", displayName: "", role: "user" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartEdit = (email) => {
    const target = users.find((item) => item.email === email);
    if (!target) return;
    setEditingEmail(email);
    setEditValues({
      displayName: target.displayName,
      role: target.role,
      password: "",
    });
  };

  const handleSaveEdit = async (email) => {
    setError("");
    try {
      await updateUser(email, {
        displayName: editValues.displayName,
        role: editValues.role,
        ...(editValues.password ? { password: editValues.password } : {}),
      });
      refreshUsers();
      setEditingEmail(null);
      showMessage("Utilisateur mis à jour.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (email) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce compte ?")) return;
    try {
      deleteUser(email);
      refreshUsers();
      showMessage("Utilisateur supprimé.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout className="container mx-auto px-4 lg:px-8 pt-32 pb-12">
      <div className="animate-fade-in space-y-10">
        <header>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-5xl tracking-wider text-gradient-gold">
                Espace Admin
              </h1>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                Gérez les comptes utilisateur, modifiez les rôles et consultez les favoris.
              </p>
            </div>
            <Link
              to="/profil"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/90 transition-smooth"
            >
              Retour au profil
            </Link>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
        </header>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h2 className="font-display text-2xl mb-5">Ajouter un utilisateur</h2>
          <form onSubmit={handleCreateUser} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground/80">Email</span>
              <input
                required
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground/80">Pseudo</span>
              <input
                type="text"
                value={newUser.displayName}
                onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground/80">Mot de passe</span>
              <input
                required
                type="password"
                minLength={4}
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground/80">Rôle</span>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition-smooth"
            >
              <Plus className="h-4 w-4" /> Créer
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl">Liste des comptes</h2>
              <p className="text-sm text-muted-foreground">
                Nombre de comptes enregistrés : {users.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-background">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-secondary text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Pseudo</th>
                  <th className="px-4 py-3">Rôle</th>
                  <th className="px-4 py-3">Favoris</th>
                  <th className="px-4 py-3">Inscrit le</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.email} className="border-t border-border">
                    <td className="px-4 py-4 break-all font-medium">{u.email}</td>
                    <td className="px-4 py-4">
                      {editingEmail === u.email ? (
                        <input
                          type="text"
                          value={editValues.displayName}
                          onChange={(e) => setEditValues({ ...editValues, displayName: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        u.displayName
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingEmail === u.email ? (
                        <select
                          value={editValues.role}
                          onChange={(e) => setEditValues({ ...editValues, role: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">{u.favorites?.length ?? 0}</td>
                    <td className="px-4 py-4">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-4 space-x-2">
                      {editingEmail === u.email ? (
                        <>
                          <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={editValues.password}
                            onChange={(e) => setEditValues({ ...editValues, password: e.target.value })}
                            className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            onClick={() => handleSaveEdit(u.email)}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow transition-smooth"
                          >
                            <PenLine className="h-3.5 w-3.5" /> Enregistrer
                          </button>
                          <button
                            onClick={() => setEditingEmail(null)}
                            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary transition-smooth"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(u.email)}
                            className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs font-semibold hover:bg-secondary/90 transition-smooth"
                          >
                            <PenLine className="h-3.5 w-3.5" /> Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(u.email)}
                            className="inline-flex items-center gap-2 rounded-full border border-destructive px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-smooth"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Admin;
