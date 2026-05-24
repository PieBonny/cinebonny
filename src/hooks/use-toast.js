/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * HOOK: useToast.js (Gestion des notifications)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 * OBJECTIF:
 *   Gestion des notifications toast à l'échelle de l'application.
 *   Ce fichier fournit un système minimal pour ajouter, mettre à jour,
 *   fermer et supprimer des toasts.
 *
 * POURQUOI UTILISER UN HOOK CUSTOM ?
 *   - Pas de dépendance externe comme react-toastify
 *   - Compréhension complète du flux d'état
 *   - Contrôle total sur le comportement et l'affichage
 *
 * ARCHITECTURE:
 *   - Reducer pattern: ADD_TOAST, UPDATE_TOAST, DISMISS_TOAST, REMOVE_TOAST
 *   - memoryState global pour conserver les toasts
 *   - dispatch() pour notifier les listeners
 *   - addToRemoveQueue() pour gérer l'expiration automatique
 *
 * UTILISATION:
 *   const { toast } = useToast();
 *   toast({ title: "Succès", description: "Avis publié" });
 *
 * LIMITATIONS:
 *   - Un seul toast affiché à la fois (TOAST_LIMIT = 1)
 *   - Suppression automatique après TOAST_REMOVE_DELAY ms
 *
 * POINTS D'APPRENTISSAGE:
 *   - Reducer simple sans Redux
 *   - Pattern observer/listener en JavaScript
 *   - Side effects contrôlés avec setTimeout / clearTimeout
 *   - Hooks custom et state global léger
 */
import * as React from "react";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });
  return {
    id: id,
    dismiss,
    update,
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
export { useToast, toast };
