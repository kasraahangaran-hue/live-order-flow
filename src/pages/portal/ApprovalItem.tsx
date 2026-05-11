import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MOCK_PORTAL_DATA } from "@/lib/portal-mock-data";
import { useOrderData } from "@/lib/useOrderData";
import { cn } from "@/lib/utils";

type Decision = "CP" | "WF" | "approved" | "return" | null;

const ITEM_IMAGES: Record<string, { original: string; detail: string }> = {
  a0: {
    original: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
    detail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80",
  },
  a1: {
    original: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
    detail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80",
  },
  b0: {
    original: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
    detail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80",
  },
};

export default function ApprovalItem() {
  const { itemIdx } = useParams();
  const navigate = useNavigate();
  const order = useOrderData();
  const idx = parseInt(itemIdx ?? "0", 10);
  const items = MOCK_PORTAL_DATA.approvalItems;
  const item = items[idx];
  const isLast = idx === items.length - 1;
  const [decision, setDecision] = useState<Decision>(null);
  const [returnOn, setReturnOn] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const hasDecision = decision !== null || returnOn;

  const goNext = () =>
    navigate(
      isLast
        ? `/portal/${order.orderId}/approval/confirm`
        : `/portal/${order.orderId}/approval/${idx + 1}`,
      { state: { order } }
    );
  const goBack = () =>
    idx > 0
      ? navigate(`/portal/${order.orderId}/approval/${idx - 1}`, { state: { order } })
      : navigate(`/portal/${order.orderId}/approval`, { state: { order } });

  if (!item) return null;
  const stain = item.issues?.[0];
  const images = ITEM_IMAGES[item.id] ?? ITEM_IMAGES.a0;

  const slides = [
    { label: "ORIGINAL", labelClass: "bg-primary/80 text-white", src: images.original },
    {
      label: (stain?.type as string) === "damage" ? "DAMAGE" : "STAIN",
      labelClass: "bg-destructive text-white",
      src: images.detail,
    },
  ];

  return (
    <div className="flex h-[100dvh] flex-col bg-background font-sans">
      {/* Header — title + segmented progress bar */}
      <div className="sticky top-0 z-20 bg-background px-5 pt-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center text-primary active:opacity-70"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-primary leading-tight">
            Review Your Items
          </h1>
        </div>
        <div className="mt-3 flex gap-1.5">
          {items.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= idx ? "bg-warning" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Scrollable middle */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Carousel */}
        <div
          className="mt-4 overflow-hidden pl-5"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const delta = touchStartX - e.changedTouches[0].clientX;
            if (delta > 50 && photoIdx < slides.length - 1) setPhotoIdx(photoIdx + 1);
            if (delta < -50 && photoIdx > 0) setPhotoIdx(photoIdx - 1);
            setTouchStartX(null);
          }}
        >
          <div
            className="flex gap-3 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(calc(${photoIdx} * (-85vw - 12px)))` }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="relative shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-secondary"
                style={{ width: "85vw", aspectRatio: "4/3" }}
                onClick={() => setLightboxSrc(slide.src)}
              >
                <img
                  src={slide.src}
                  alt={slide.label}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {i === 0 && stain?.photoCoords && (
                  <div
                    className="absolute h-3 w-3 rounded-full bg-destructive ring-2 ring-background"
                    style={{
                      left: `${stain.photoCoords.x}%`,
                      top: `${stain.photoCoords.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
                <div
                  className={cn(
                    "absolute bottom-2 left-2 rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wider",
                    slide.labelClass
                  )}
                >
                  {slide.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot pagination */}
        <div className="mt-3 flex justify-center gap-1.5 pr-5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={() => setPhotoIdx(i)}
              className={cn(
                "h-1.5 rounded-full bg-primary transition-all duration-200",
                i === photoIdx ? "w-5" : "w-1.5 opacity-30"
              )}
            />
          ))}
        </div>

        {/* Decision content */}
        <div className="px-5 pb-4 pt-4">
          {item.approvalType === "A" && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {(item as any).issue} · {(item as any).issueLocation}
              </p>

              <div className="mt-2 rounded-xl border border-border bg-card p-3">
                <p className="text-sm italic text-muted-foreground">"{item.facilityNote}"</p>
              </div>

              <h2 className="mt-6 text-base font-extrabold text-primary">
                What would you like to do?
              </h2>

              <div className="mt-3 flex flex-col gap-2">
                {(["CP", "WF"] as const).map((id) => {
                  const sel = decision === id && !returnOn;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setDecision(id);
                        setReturnOn(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150",
                        sel
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                          sel ? "border-white bg-white" : "border-border"
                        )}
                      >
                        {sel && <Check className="h-3 w-3 text-primary" strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm font-extrabold",
                            sel ? "text-primary-foreground" : "text-primary"
                          )}
                        >
                          {id === "CP" ? "Send to Clean & Press" : "Keep as Wash & Fold"}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            sel ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}
                        >
                          {id === "CP"
                            ? (item as any).price
                              ? `AED ${(item as any).price} added · best outcome`
                              : "Best outcome"
                            : "Risk acknowledged"}
                        </p>
                      </div>
                      {id === "CP" && (
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
                            sel ? "bg-white text-primary" : "bg-warning text-warning-foreground"
                          )}
                        >
                          Rec.
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Return uncleaned */}
              <div className="mt-2 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <p className="text-sm font-extrabold text-destructive">Return Uncleaned</p>
                <Switch
                  checked={returnOn}
                  onCheckedChange={(v) => {
                    setReturnOn(v);
                    if (v) setDecision(null);
                  }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </>
          )}

          {item.approvalType === "B" && (
            <>
              <p className="text-sm text-foreground">{item.facilityNote}</p>
              <h2 className="mt-5 text-base font-extrabold text-primary">
                What would you like to do?
              </h2>
              <div className="mt-3">
                {(() => {
                  const sel = decision === "approved" && !returnOn;
                  return (
                    <button
                      type="button"
                      onClick={() => { setDecision("approved"); setReturnOn(false); }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150",
                        sel ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                      )}
                    >
                      <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", sel ? "border-white bg-white" : "border-border")}>
                        {sel && <Check className="h-3 w-3 text-primary" strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-extrabold", sel ? "text-primary-foreground" : "text-primary")}>
                          Approve for Clean & Press
                        </p>
                        <p className={cn("text-xs", sel ? "text-primary-foreground/80" : "text-muted-foreground")}>
                          Consent to process despite damage risk
                        </p>
                      </div>
                    </button>
                  );
                })()}
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <p className="text-sm font-extrabold text-destructive">Return Uncleaned</p>
                <Switch
                  checked={returnOn}
                  onCheckedChange={(v) => { setReturnOn(v); if (v) setDecision(null); }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky bottom CTA — both Type A and B */}
      <div
        className="border-t border-border bg-background px-5 pt-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        <button
          type="button"
          disabled={!hasDecision}
          onClick={goNext}
          className={cn(
            "w-full rounded-xl py-3.5 font-sans text-base font-extrabold transition-transform duration-100 ease-out active:duration-75 active:scale-[0.97]",
            hasDecision
              ? "bg-primary text-primary-foreground"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          )}
        >
          {isLast ? "Review decisions" : "Next item"}
        </button>
      </div>

      {/* Full-screen lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="flex items-center justify-end px-5 pt-12 pb-4">
            <button
              onClick={() => setLightboxSrc(null)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center px-5" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxSrc}
              className="max-h-full w-full rounded-2xl object-contain"
              alt="Full size"
            />
          </div>
          <div style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }} />
        </div>
      )}
    </div>
  );
}

