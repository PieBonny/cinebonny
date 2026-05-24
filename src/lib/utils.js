/**
 * Utilitaire de classes Tailwind.
 * - `clsx` : concatène intelligemment des classes (ignore false/null).
 * - `tailwind-merge` : déduplique les classes Tailwind conflictuelles
 *   (ex : "px-2 px-4" → "px-4").
 *
 * Usage :  cn("p-4", isActive && "bg-primary", className)
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
