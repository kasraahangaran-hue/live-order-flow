import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll management on route changes.
 * - Saves scroll position per pathname whenever the user scrolls.
 * - On POP navigation (back/forward), restores the saved position.
 * - On PUSH/REPLACE navigation, scrolls to top.
 */
const STORAGE_KEY = "scroll-positions";

const readPositions = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const writePosition = (path: string, y: number) => {
  const positions = readPositions();
  positions[path] = y;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
};

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const pathnameRef = useRef(pathname);

  // Disable the browser's own restoration so we control it
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Continuously track scroll position for the current pathname
  useEffect(() => {
    pathnameRef.current = pathname;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        writePosition(pathnameRef.current, window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Restore (POP) or reset (PUSH/REPLACE) on route change
  useLayoutEffect(() => {
    if (navType === "POP") {
      const target = readPositions()[pathname] ?? 0;
      // Try across several frames in case content height grows after mount
      let attempts = 0;
      const tryScroll = () => {
        window.scrollTo(0, target);
        attempts += 1;
        if (attempts < 5 && Math.abs(window.scrollY - target) > 2) {
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
    } else {
      window.scrollTo(0, 0);
      document.querySelectorAll<HTMLElement>("[data-scroll-root]").forEach((el) => {
        el.scrollTop = 0;
      });
    }
  }, [pathname, navType]);

  return null;
};
