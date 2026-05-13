import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronRight,
  Camera,
  Plus,
  Pencil,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import washFoldIconUrl from "@/assets/icons/service-wash-fold.svg";
import cleanPressIconUrl from "@/assets/icons/service-clean-press.svg";
import bedBathIconUrl from "@/assets/icons/service-bed-bath.svg";
import pressOnlyIconUrl from "@/assets/icons/service-press-only.svg";
import {
  DoorbellInstructionsSheet,
  doorbellSummary,
  type DoorbellPickup,
  type DoorbellDropoff,
} from "./DoorbellInstructionsSheet";
import { StarchSheet, starchLabel, type StarchLevel } from "./StarchSheet";
import { AutoApprovalsSheet, type AutoApprovalsState, type WashFoldApproval } from "./AutoApprovalsSheet";
import { CreasesSheet, creasesSummary, EMPTY_CREASES, type CreasesState } from "./CreasesSheet";
import { DelicateItemsSheet, delicateItemsSummary } from "./DelicateItemsSheet";
import type { OrderData, OrderServices } from "@/lib/order-types";
import { DEFAULT_ORDER_SERVICES, PRESSING_CATEGORIES } from "@/lib/order-types";
import { useOrderData } from "@/lib/useOrderData";
import { servicesStore, useServices } from "@/lib/services-store";

// Preload all service icons immediately on module load so they're cached
// before any render — eliminates the circle-before-icon flash.
const ICON_URLS = [
  washFoldIconUrl,
  cleanPressIconUrl,
  bedBathIconUrl,
  pressOnlyIconUrl,
];
if (typeof window !== "undefined") {
  ICON_URLS.forEach((url) => {
    const img = new Image();
    img.decoding = "sync";
    img.src = url;
    // also inject a <link rel="preload"> so the browser prioritizes it
    if (!document.head.querySelector(`link[data-preload-icon="${url}"]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      link.setAttribute("data-preload-icon", url);
      document.head.appendChild(link);
    }
  });
}

const WF_SHORT_LABELS: Record<WashFoldApproval, string> = {
  notify: "Notify me",
  "transfer-clean-press": "Transfer to clean & press",
  "wash-anyway": "Wash anyway",
  "do-not-wash": "Do not wash",
};

const autoApprovalsSummary = (state: AutoApprovalsState): string => {
  if (!state.stainDamageApprove && state.washFold === "notify") return "Off";
  const stain = state.stainDamageApprove ? "Auto-approve" : "Off";
  const wf = WF_SHORT_LABELS[state.washFold];
  return `Stains: ${stain} · Wash & Fold: ${wf}`;
};

type Confirmation = {
  key: string;
  label: string;
  subtitle: string;
  status: "done" | "pending";
};

type OrderStage = "received" | "collected" | "items-in" | "delivery" | "delivered";

const buildConfirmations = (stage: OrderStage): Confirmation[] => {
  const pickupDone = stage !== "received";
  const itemsDone = stage === "items-in" || stage === "delivery" || stage === "delivered";
  const dropDone = stage === "delivered";
  return [
    {
      key: "pickup",
      label: "Proof of pick up",
      subtitle: pickupDone ? "View photos" : "Available after pickup",
      status: pickupDone ? "done" : "pending",
    },
    {
      key: "items",
      label: "Items received at Washmen",
      subtitle: itemsDone ? "View photos" : "Available after items received",
      status: itemsDone ? "done" : "pending",
    },
    {
      key: "drop",
      label: "Proof of drop off",
      subtitle: dropDone ? "View photos" : "Available after delivery",
      status: dropDone ? "done" : "pending",
    },
  ];
};

export const OrderConfirmations = ({ stage = "delivery", orderId = "", order }: { stage?: OrderStage; orderId?: string; order?: OrderData }) => {
  const confirmations = buildConfirmations(stage);
  const navigate = useNavigate();
  const handleTap = (key: string) => {
    const navState = order ? { state: { order } } : undefined;
    if (key === "pickup") navigate(`/portal/${orderId}/pickup`, navState);
    if (key === "items") navigate(`/portal/${orderId}/facility`, navState);
    if (key === "drop") navigate(`/portal/${orderId}/delivery`, navState);
  };
  return (
    <section
      key="confirmations"
      className="mx-5 mt-4 rounded-lg border border-border bg-card animate-fade-in p-4"
      style={{ animationDelay: "260ms" }}
    >
      <div>
        <h3 className="font-sans text-sm font-bold text-primary leading-tight">Order Confirmations</h3>
        <p className="mt-1 text-xs font-medium text-muted-foreground leading-relaxed">
          We capture photos at every step — from your doorstep to our facility and back.
        </p>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {confirmations.map((c) => {
          const done = c.status === "done";
          return (
            <li key={c.key}>
              <button
                type="button"
                disabled={!done}
                onClick={done ? () => handleTap(c.key) : undefined}
                className={cn(
                  "flex w-full items-center gap-3 py-3 text-left transition-colors",
                  done ? "hover:bg-secondary/40 -mx-2 px-2 rounded-xl" : "opacity-50 cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                    done
                      ? "bg-secondary text-primary"
                      : "border border-dashed border-muted-foreground/40 text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Camera className="h-4 w-4" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-bold", done ? "text-primary" : "text-muted-foreground")}>
                    {c.label}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">{c.subtitle}</p>
                </div>
                {done && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2.5} />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

type ServiceTile = {
  key: "cleanAndPress" | "bedAndBath" | "pressOnly";
  title: string;
  iconUrl: string;
  iconBgClass: string;
};

const SERVICE_TILES: ServiceTile[] = [
  { key: "cleanAndPress", title: "Clean & Press", iconUrl: cleanPressIconUrl, iconBgClass: "bg-washmen-light-green" },
  { key: "bedAndBath", title: "Bed & Bath", iconUrl: bedBathIconUrl, iconBgClass: "bg-washmen-light-pink" },
  { key: "pressOnly", title: "Press Only", iconUrl: pressOnlyIconUrl, iconBgClass: "bg-washmen-light-grey" },
];

const PressingIcon = ({ active }: { active: boolean }) => {
  const lineClass = active ? "stroke-primary" : "stroke-muted-foreground";
  const solidClass = active ? "fill-primary stroke-primary" : "fill-muted-foreground stroke-muted-foreground";
  const boardFillClass = active ? "fill-[hsl(var(--surface-lavender-soft))]" : "fill-card";

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="h-8 w-8 shrink-0 select-none">
      <path d="M16.602 5.49317C16.602 5.49317 18.8319 5.49317 20.0398 4.32658C20.2153 4.1614 20.4424 4.07881 20.6695 4.15107C21.7639 4.50208 24.9436 5.55511 25.625 6.08163C26.4199 6.71138 26.6057 6.5049 28.9286 10.9441C29.0525 11.1816 29.0112 11.4707 28.8357 11.6668L25.945 14.7433C25.7076 15.0014 25.3049 15.0117 25.0572 14.7639L24.0558 13.7935V27.328C24.0558 27.6171 23.8596 27.8649 23.5809 27.9371C22.4143 28.2262 19.5236 28.9592 16.7052 28.8972C13.5564 28.8663 10.8413 28.2262 9.66437 27.9371C9.38563 27.8649 9.18948 27.6171 9.18948 27.328V13.7935L8.18807 14.7639C7.9403 15.0014 7.53767 14.9911 7.30022 14.7433L4.40956 11.6668C4.22373 11.4707 4.19276 11.1816 4.31664 10.9441C6.6395 6.5049 6.82533 6.70105 7.62026 6.08163C8.29131 5.55511 11.4814 4.50208 12.5757 4.15107C12.8028 4.07881 13.0299 4.15107 13.2054 4.32658C14.4133 5.49317 16.6329 5.49317 16.6329 5.49317H16.602Z" className={cn("fill-card", lineClass)} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.4734 4.12036C19.9469 6.40192 16.602 9.56101 16.602 9.56101C16.602 9.56101 13.257 6.40192 12.7305 4.12036" className={lineClass} strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M4.83158 23.3668L21.3883 23.3668C21.7948 23.3668 22.1243 23.6963 22.1243 24.1028L22.1243 24.3198C22.1243 24.7263 21.7948 25.0558 21.3883 25.0558L4.83158 25.0558C4.42508 25.0558 4.09557 24.7263 4.09557 24.3198L4.09557 24.1028C4.09557 23.6963 4.42509 23.3668 4.83158 23.3668Z" className={solidClass} strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M21.1408 23.1628C20.645 20.1915 18.3362 17.5721 15.8802 16.0083C13.2614 14.3429 10.1469 13.561 7.09433 13.2951C5.99416 13.2013 4.94048 13.4046 4.18896 14.2647C3.29798 15.2812 2.46125 16.3446 1.609 17.3923C1.02793 18.1038 0.594063 19.1672 1.609 19.7693C1.61675 19.7693 1.63223 19.7849 1.63998 19.7928C4.97146 21.7319 4.7313 23.3347 4.7313 23.3347" className={cn(boardFillClass, lineClass)} strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M7.1402 18.7804L15.6239 18.7804C15.7169 18.7804 15.7711 18.6719 15.7091 18.6022C15.0815 17.9049 12.5326 15.4179 8.1629 15.5031C8.1629 15.5031 6.59786 15.4489 5.68364 16.4948C5.38148 16.8434 5.2188 17.3006 5.31177 17.7499C5.41249 18.2303 5.8231 18.7804 7.1402 18.7804Z" className={cn("fill-card", lineClass)} strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M11.6883 18.5789L11.6883 17.595C11.6883 17.3315 11.4791 17.1223 11.2157 17.1223L8.70545 17.1223C8.44203 17.1223 8.23285 17.3315 8.23285 17.595L8.23285 18.5789" className={cn(boardFillClass, lineClass)} strokeMiterlimit="10" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Service editing lock states on tracking screens:
 * - "none"        — fully editable (Order Received / Pickup Assigned).
 * - "post_pickup" — after pickup completed, within 1h grace window for W&F.
 *                   CP / BB / PO are disabled-but-visible. W&F + Add Pressing
 *                   remain editable so the customer can still add P&H.
 * - "post_hour"   — >1h after pickup OR any later stage. Everything visible
 *                   but disabled (greyed out, no pencil, no T&C link action).
 */
export type ServicesLockMode = "none" | "post_pickup" | "post_hour";

export const ServicesSelection = ({
  locked = false,
  lockMode,
}: {
  /** @deprecated use lockMode. true → "post_hour" for backward compat. */
  locked?: boolean;
  lockMode?: ServicesLockMode;
}) => {
  const navigate = useNavigate();
  const order = useOrderData();
  const services = useServices(order.services ?? DEFAULT_ORDER_SERVICES);

  const mode: ServicesLockMode = lockMode ?? (locked ? "post_hour" : "none");
  const wfLocked = mode === "post_hour";
  const othersLocked = mode === "post_pickup" || mode === "post_hour";

  const toggle = (key: keyof OrderServices, isLocked: boolean) => {
    if (isLocked) return;
    servicesStore.set({ [key]: !services[key] } as Partial<OrderServices>);
  };

  const openWashAndFoldInfo = () => {
    if (wfLocked) return;
    navigate("/wash-and-fold-info");
  };

  const pressActive = services.washAndFold && services.addPressing && !wfLocked;
  const selectedPressingIds = services.pressingItems ?? [];
  const displayPressingCats =
    selectedPressingIds.length > 0
      ? PRESSING_CATEGORIES.filter((c) => selectedPressingIds.includes(c.id))
      : PRESSING_CATEGORIES.slice(0, 3);

  return (
    <section
      className="mx-5 mt-4 animate-fade-in"
      style={{ animationDelay: "250ms" }}
    >
      <h3 className="px-1 font-sans text-sm font-bold text-primary leading-tight">
        Services Selection
      </h3>

      <div className="mt-3 flex flex-col gap-2">
        {/* Wash & Fold + Add Pressing combo card */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <ServiceRow
            iconUrl={washFoldIconUrl}
            iconBgClass="bg-washmen-light-aqua"
            title="Wash & Fold"
            priceLabel={services.washAndFold ? "AED 75 per bag" : undefined}
            link={wfLocked ? undefined : { label: "Learn More", onPress: () => {} }}
            selected={services.washAndFold}
            showSelectionIndicator
            locked={wfLocked}
            disabled={wfLocked}
            onPress={() => toggle("washAndFold", wfLocked)}
          />

          {(services.washAndFold || !wfLocked) && (
            <div className="flex items-center px-4 py-1">
              <div className="flex h-4 w-12 shrink-0 items-center justify-center">
                <Plus
                  className={cn("h-4 w-4", wfLocked ? "text-muted-foreground" : "text-primary")}
                  strokeWidth={3}
                />
              </div>
            </div>
          )}

          {services.addPressing ? (
            <div className="flex flex-col px-4 pb-3">
              <div className="flex items-center gap-3 pt-1 pb-2">
                <div
                  className={cn(
                    "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors",
                    pressActive ? "bg-washmen-light-aqua" : "bg-muted",
                  )}
                >
                  <PressingIcon active={pressActive} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "truncate text-sm font-semibold leading-tight transition-colors",
                        pressActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      Press &amp; Hang
                    </p>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        wfLocked
                          ? "bg-muted text-muted-foreground"
                          : "bg-washmen-yellow-pill text-primary",
                      )}
                    >
                      NEW
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs leading-tight text-muted-foreground">
                    Press tops after washing
                  </p>
                </div>
                {!wfLocked && (
                  <button
                    type="button"
                    aria-label="Edit pressing selections"
                    onClick={openWashAndFoldInfo}
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center transition-colors",
                      pressActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="pl-[60px] flex flex-col gap-1">
                {displayPressingCats.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex-1 text-xs font-light leading-[18px] transition-colors",
                        pressActive ? "text-muted-foreground" : "text-muted-foreground/60",
                      )}
                    >
                      {cat.label}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-[16px] transition-colors",
                        pressActive
                          ? "bg-washmen-light-aqua text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      + AED {cat.ratePlus} /item
                    </span>
                  </div>
                ))}
              </div>
              {selectedPressingIds.length > 0 && (
                <button
                  type="button"
                  disabled={wfLocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (wfLocked) return;
                    navigate("/wash-and-fold-info/terms", { state: { mode: "view" } });
                  }}
                  className={cn(
                    "mt-2 self-start pl-[60px] text-xs font-normal underline underline-offset-2 transition-colors",
                    wfLocked
                      ? "text-muted-foreground"
                      : pressActive
                        ? "text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  View Terms &amp; Conditions
                </button>
              )}
            </div>
          ) : !wfLocked ? (
            <ServiceRow
              iconSlot={<PressingIcon active={services.washAndFold} />}
              iconBgClass={services.washAndFold ? "bg-washmen-light-aqua" : "bg-muted"}
              title="Add Pressing"
              titleMutedWhenInactive
              active={services.washAndFold}
              subtitle="Press tops after washing"
              badge="NEW"
              rightSlot={
                <Plus
                  className={cn(
                    "h-4 w-4",
                    services.washAndFold ? "text-primary" : "text-muted-foreground",
                  )}
                  strokeWidth={2.5}
                />
              }
              locked={wfLocked}
              onPress={() => services.washAndFold && toggle("addPressing", wfLocked)}
            />
          ) : null}
        </div>

        {/* Other services — always visible. Disabled-but-visible when locked. */}
        {SERVICE_TILES.map((tile) => {
          const selected = services[tile.key];
          return (
            <ServiceRow
              key={tile.key}
              iconUrl={tile.iconUrl}
              iconBgClass={othersLocked ? "bg-muted" : tile.iconBgClass}
              title={tile.title}
              link={othersLocked ? undefined : { label: "View Pricing", onPress: () => {} }}
              selected={selected}
              showSelectionIndicator
              locked={othersLocked}
              disabled={othersLocked}
              onPress={() => toggle(tile.key, othersLocked)}
              standalone
            />
          );
        })}
      </div>
    </section>
  );
};

interface ServiceRowProps {
  iconUrl?: string;
  iconSlot?: React.ReactNode;
  iconBgClass: string;
  title: string;
  subtitle?: string;
  badge?: string;
  priceLabel?: string;
  link?: { label: string; onPress: () => void };
  selected?: boolean;
  /** When set, render the right-side circle indicator (check / plus). */
  showSelectionIndicator?: boolean;
  /** Custom right slot replaces the indicator/checkmark when provided. */
  rightSlot?: React.ReactNode;
  /** Used by Add Pressing to gray out title/subtitle when W&F is off. */
  active?: boolean;
  titleMutedWhenInactive?: boolean;
  locked?: boolean;
  /** Apply muted/greyed visual treatment (used for locked tracking screens). */
  disabled?: boolean;
  /** Wraps the row in its own card when true. */
  standalone?: boolean;
  onPress?: () => void;
}

const ServiceRow = ({
  iconUrl,
  iconSlot,
  iconBgClass,
  title,
  subtitle,
  badge,
  priceLabel,
  link,
  selected,
  showSelectionIndicator,
  rightSlot,
  active = true,
  titleMutedWhenInactive,
  locked,
  standalone,
  onPress,
}: ServiceRowProps) => {
  const interactive = !locked && !!onPress;
  const titleMuted = titleMutedWhenInactive && !active;

  const inner = (
    <div className="flex w-full items-center gap-3 px-4 py-2.5 text-left">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          iconBgClass,
        )}
      >
        {iconSlot ?? <img src={iconUrl} alt="" aria-hidden width={32} height={32} className="h-8 w-8 select-none" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p
            className={cn(
              "min-w-0 truncate text-sm font-semibold leading-tight",
              titleMuted ? "text-muted-foreground" : "text-primary",
            )}
          >
            {title}
          </p>
          {badge && (
            <span className="shrink-0 rounded-md bg-washmen-yellow-pill px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              {badge}
            </span>
          )}
          {priceLabel && (
            <span className="shrink-0 rounded-md bg-washmen-light-aqua px-2 py-0.5 text-[10px] font-medium text-primary">
              {priceLabel}
            </span>
          )}
        </div>
        {subtitle && (
          <p
            className={cn(
              "mt-0.5 truncate text-xs leading-tight",
              titleMuted ? "text-muted-foreground" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
        )}
        {link && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              link.onPress();
            }}
            className="mt-0.5 inline-flex items-center text-xs font-medium text-primary underline underline-offset-2"
          >
            {link.label}
          </button>
        )}
      </div>
      {rightSlot ? (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center">{rightSlot}</div>
      ) : showSelectionIndicator ? (
        <div
          aria-hidden
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
            selected
              ? "border-washmen-primary-green bg-washmen-primary-green text-primary"
              : "border-primary bg-transparent text-primary",
          )}
        >
          {selected ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          )}
        </div>
      ) : null}
    </div>
  );

  const wrapperClass = cn(
    "block w-full",
    standalone && "rounded-lg border border-border bg-card overflow-hidden",
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onPress}
        aria-pressed={!!selected}
        className={cn(
          wrapperClass,
          "transition-transform duration-100 ease-out active:scale-[0.99]",
        )}
      >
        {inner}
      </button>
    );
  }

  return <div className={wrapperClass}>{inner}</div>;
};


interface InstructionCardProps {
  title: string;
  summary?: React.ReactNode;
  subtitle?: string;
  onClick: () => void;
  locked?: boolean;
}

const InstructionCard = ({ title, summary, subtitle, onClick, locked }: InstructionCardProps) => (
  <button
    type="button"
    onClick={locked ? undefined : onClick}
    disabled={locked}
    className={cn(
      "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors",
      !locked && "hover:bg-muted/30 active:bg-muted/50",
      locked && "opacity-60 cursor-not-allowed",
    )}
  >
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-primary">{title}</p>
      {summary && <div className="mt-0.5 text-xs text-muted-foreground">{summary}</div>}
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
    <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
  </button>
);

export const OrderInstructions = ({ locked = false }: { locked?: boolean }) => {
  const [open, setOpen] = useState(true);
  const [openSheet, setOpenSheet] = useState<
    "doorbell" | "starch" | "autoApprovals" | "creases" | "delicate" | null
  >(null);

  const [doorbell, setDoorbell] = useState<{ pickup: DoorbellPickup; dropoff: DoorbellDropoff }>({
    pickup: "none",
    dropoff: "none",
  });
  const [starch, setStarch] = useState<StarchLevel>("none");
  const [autoApprovals, setAutoApprovals] = useState<AutoApprovalsState>({
    stainDamageApprove: false,
    washFold: "notify",
  });
  const [creases, setCreases] = useState<CreasesState>(EMPTY_CREASES);
  const [delicatePhotos, setDelicatePhotos] = useState<string[]>([]);

  const dbSummary = doorbellSummary(doorbell.pickup, doorbell.dropoff);

  return (
    <section
      className="mx-5 mt-4 animate-fade-in"
      style={{ animationDelay: "300ms" }}
    >
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-sans text-sm font-bold text-primary">Order Instructions</h3>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Collapse" : "Expand"}
            className="flex h-7 w-7 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary/60"
          >
            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>

        {open && (
          <div className="flex flex-col gap-3 px-4 pb-4">
            <InstructionCard
              title="Doorbell Instructions"
              summary={
                <>
                  <p>
                    <span className="font-semibold">Pick Up:</span> {dbSummary.pickup}
                  </p>
                  <p>
                    <span className="font-semibold">Drop Off:</span> {dbSummary.dropoff}
                  </p>
                </>
              }
              onClick={() => setOpenSheet("doorbell")}
              locked={locked}
            />

            <InstructionCard
              title="Creases"
              summary={<p>{creasesSummary(creases)}</p>}
              onClick={() => setOpenSheet("creases")}
              locked={locked}
            />

            <InstructionCard
              title="Starch"
              summary={<p>{starchLabel(starch)}</p>}
              onClick={() => setOpenSheet("starch")}
              locked={locked}
            />

            <InstructionCard
              title="Laundry Auto-Approvals"
              summary={<p>{autoApprovalsSummary(autoApprovals)}</p>}
              onClick={() => setOpenSheet("autoApprovals")}
              locked={locked}
            />

            <InstructionCard
              title="Delicate Items & Stains"
              summary={<p>{delicateItemsSummary(delicatePhotos)}</p>}
              onClick={() => setOpenSheet("delicate")}
              locked={locked}
            />
          </div>
        )}
      </div>

      <DoorbellInstructionsSheet
        open={openSheet === "doorbell"}
        onOpenChange={(o) => setOpenSheet(o ? "doorbell" : null)}
        pickup={doorbell.pickup}
        dropoff={doorbell.dropoff}
        onApply={(pickup, dropoff) => setDoorbell({ pickup, dropoff })}
      />
      <StarchSheet
        open={openSheet === "starch"}
        onOpenChange={(o) => setOpenSheet(o ? "starch" : null)}
        value={starch}
        onApply={setStarch}
      />
      <AutoApprovalsSheet
        open={openSheet === "autoApprovals"}
        onOpenChange={(o) => setOpenSheet(o ? "autoApprovals" : null)}
        value={autoApprovals}
        onApply={setAutoApprovals}
      />
      <CreasesSheet
        open={openSheet === "creases"}
        onOpenChange={(o) => setOpenSheet(o ? "creases" : null)}
        value={creases}
        onApply={setCreases}
      />
      <DelicateItemsSheet
        open={openSheet === "delicate"}
        onOpenChange={(o) => setOpenSheet(o ? "delicate" : null)}
        photos={delicatePhotos}
        onApply={setDelicatePhotos}
      />
    </section>
  );
};
