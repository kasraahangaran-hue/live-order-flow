import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll management on route changes.
 * - Saves scroll position per pathname in sessionStorage on unload.
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

  // Save position before leaving the current path
  useEffect(() => {
    return () => {
      writePosition(pathname, window.scrollY);
    };
  }, [pathname]);

  // Restore or reset on route change
  useEffect(() => {
    if (navType === "POP") {
      const positions = readPositions();
      const y = positions[pathname] ?? 0;
      // Defer to allow content to render before scrolling
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
        document.querySelectorAll<HTMLElement>("[data-scroll-root]").forEach((el) => {
          el.scrollTop = y;
        });
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.querySelectorAll<HTMLElement>("[data-scroll-root]").forEach((el) => {
        el.scrollTop = 0;
      });
    }
  }, [pathname, navType]);

  return null;
};
