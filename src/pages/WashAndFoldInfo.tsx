import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PRESSING_CATEGORIES } from "@/lib/order-types";
import { servicesStore, useServices } from "@/lib/services-store";

const KIDS_UNIFORM_NOTE = "Must contain school crest";

/** Strikethrough rates mirror the Washmen Order Flow source of truth. */
const STRIKETHROUGH: Record<string, number> = {
  tshirts_polos: 11,
  tank_crop: 11,
  gym_tops: 11,
  shirts_blouses: 12,
  kids_uniform: 11,
};

const WashAndFoldInfo = () => {
  const navigate = useNavigate();
  const services = useServices();
  const [items, setItems] = useState<string[]>(services.pressingItems ?? []);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    const hasItems = items.length > 0;
    servicesStore.set({
      pressingItems: hasItems ? items : undefined,
      addPressing: hasItems,
      // Adding pressing prefs auto-activates Wash & Fold (mirrors reference).
      washAndFold: hasItems ? true : services.washAndFold,
    });
    navigate(-1);
  };

  const ctaLabel = items.length > 0 ? "Save" : "Skip";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-5 pt-[max(env(safe-area-inset-top),16px)] pb-3 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-primary">Add Pressing</h1>
      </header>

      <main className="px-5 pt-3 pb-32 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Choose which items you'd like pressed and hung after washing. Pricing
          is per item.
        </p>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {PRESSING_CATEGORIES.map((opt, idx) => {
            const checked = items.includes(opt.id);
            const isLast = idx === PRESSING_CATEGORIES.length - 1;
            return (
              <div
                key={opt.id}
                className={
                  "flex items-center justify-between gap-3 px-4 py-4 " +
                  (isLast ? "" : "border-b border-border")
                }
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-primary">
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs">
                    <span className="font-medium text-primary">
                      + AED {opt.ratePlus} /item
                    </span>
                    <span className="ml-2 text-muted-foreground line-through">
                      AED {STRIKETHROUGH[opt.id] ?? opt.ratePlus + 2}
                    </span>
                  </p>
                  {opt.id === "kids_uniform" && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {KIDS_UNIFORM_NOTE}
                    </p>
                  )}
                </div>
                <Switch
                  checked={checked}
                  onCheckedChange={() => toggle(opt.id)}
                  aria-label={`Toggle ${opt.label}`}
                />
              </div>
            );
          })}
        </div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t border-border px-5 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <Button
          onClick={handleSave}
          className="w-full h-[42px] rounded-lg text-sm font-semibold"
        >
          {ctaLabel}
        </Button>
      </footer>
    </div>
  );
};

export default WashAndFoldInfo;
