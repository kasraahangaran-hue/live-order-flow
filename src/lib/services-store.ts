import { useSyncExternalStore } from "react";
import { DEFAULT_ORDER_SERVICES, type OrderServices } from "./order-types";

/**
 * Tiny in-memory store for the order's selected services.
 *
 * Used so the Services Selection card on tracking pages and the
 * /wash-and-fold-info pressing-prefs editor can share state without
 * threading callbacks through React Router navigation.
 *
 * NOT persisted across full page reloads — that's intentional for the
 * preview demo. In production, this state is sourced from `OrderData`
 * via `useOrderData()` and patched back to the order API on save.
 */
let state: OrderServices = { ...DEFAULT_ORDER_SERVICES };
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const servicesStore = {
  get: () => state,
  set: (patch: Partial<OrderServices>) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  /** Replace state entirely (e.g. when seeding from a different order). */
  replace: (next: OrderServices) => {
    state = { ...next };
    listeners.forEach((l) => l());
  },
};

/**
 * Subscribe to the services store. Pass `seed` on first mount to
 * initialise the store from the current order if it hasn't been
 * touched in this session.
 */
let seeded = false;
export const useServices = (seed?: OrderServices): OrderServices => {
  if (!seeded && seed) {
    seeded = true;
    state = { ...seed };
  }
  return useSyncExternalStore(subscribe, servicesStore.get, servicesStore.get);
};
