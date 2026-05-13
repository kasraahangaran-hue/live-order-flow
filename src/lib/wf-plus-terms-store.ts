import { useSyncExternalStore } from "react";

/**
 * Tracks whether the user has acknowledged the Wash & Fold+ T&Cs.
 * In production this would live on the user profile; for the demo it's
 * a tiny in-memory store so the gate behavior can be exercised once
 * per session.
 */
let accepted = false;
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const wfPlusTermsStore = {
  get: () => accepted,
  set: (v: boolean) => {
    accepted = v;
    listeners.forEach((l) => l());
  },
};

export const useWfPlusTermsAccepted = () =>
  useSyncExternalStore(subscribe, wfPlusTermsStore.get, wfPlusTermsStore.get);
