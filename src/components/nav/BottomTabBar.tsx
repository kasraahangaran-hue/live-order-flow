import { NavLink } from "react-router-dom";
import { Home, Tag, ClipboardList, MessageCircle, MoreHorizontal, LucideIcon } from "lucide-react";

interface Tab {
  to?: string;
  label: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { label: "Home", icon: Home },
  { label: "Pricing", icon: Tag },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { label: "Help", icon: MessageCircle },
  { label: "More", icon: MoreHorizontal },
];

const baseClasses =
  "flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-transform duration-100 ease-out active:duration-75 active:scale-[0.96]";

export const BottomTabBar = () => {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 bg-card/95 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="flex h-16 items-stretch justify-around px-2">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={label} className="flex-1">
            {to ? (
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `${baseClasses} ${isActive ? "text-primary" : "text-muted-foreground"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={isActive ? 2.6 : 2}
                      fill={isActive ? "currentColor" : "none"}
                      fillOpacity={isActive ? 0.15 : 0}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ) : (
              <button
                type="button"
                className={`${baseClasses} text-muted-foreground`}
                aria-disabled="true"
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
                <span>{label}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
