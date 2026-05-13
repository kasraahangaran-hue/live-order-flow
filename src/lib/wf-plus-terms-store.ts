import { useSyncExternalStore } from "react";

/**
 * Tracks whether the customer has acknowledged the Wash & Fold+ T&Cs.
 * Persisted in localStorage as a placeholder for the real per-customer
 * backend flag (Fawad will swap this for the native API call).
 */
const STORAGE_KEY = "wf_plus_terms_accepted";

const readInitial = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

let accepted = readInitial();
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const wfPlusTermsStore = {
  get: () => accepted,
  set: (v: boolean) => {
    accepted = v;
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "true" : "false");
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  },
};

export const useWfPlusTermsAccepted = () =>
  useSyncExternalStore(subscribe, wfPlusTermsStore.get, wfPlusTermsStore.get);
