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
import addPressingActiveUrl from "@/assets/icons/add-pressing-active.svg";
import addPressingInactiveUrl from "@/assets/icons/add-pressing-inactive.svg";
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

const PressingIcon = ({ active }: { active: boolean }) => (
  <span className="relative block h-8 w-8 shrink-0" aria-hidden>
    <img
      src={addPressingActiveUrl}
      alt=""
      width={32}
      height={32}
      className={cn("absolute inset-0 h-8 w-8 select-none", active ? "opacity-100" : "opacity-0")}
    />
    <img
      src={addPressingInactiveUrl}
      alt=""
      width={32}
      height={32}
      className={cn("absolute inset-0 h-8 w-8 select-none", active ? "opacity-0" : "opacity-100")}
    />
  </span>
);

export const ServicesSelection = ({ locked = false }: { locked?: boolean }) => {
  const navigate = useNavigate();
  const order = useOrderData();
  const services = useServices(order.services ?? DEFAULT_ORDER_SERVICES);

  const toggle = (key: keyof OrderServices) => {
    if (locked) return;
    servicesStore.set({ [key]: !services[key] } as Partial<OrderServices>);
  };

  const openWashAndFoldInfo = () => {
    if (locked) return;
    navigate("/wash-and-fold-info");
  };

  const pressActive = services.washAndFold && services.addPressing;
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
        {(services.washAndFold || !locked) && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <ServiceRow
              iconUrl={washFoldIconUrl}
              iconBgClass="bg-washmen-light-aqua"
              title="Wash & Fold"
              priceLabel={services.washAndFold ? "AED 75 per bag" : undefined}
              link={locked ? undefined : { label: "Learn More", onPress: () => {} }}
              selected={services.washAndFold}
              showSelectionIndicator
              locked={locked}
              onPress={() => toggle("washAndFold")}
            />

            {services.washAndFold && services.addPressing ? (
              <div className="flex flex-col px-4 pb-3">
                <div className="flex items-center gap-3 pt-1 pb-2">
                  <div
                    className={cn(
                      "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                      pressActive ? "bg-washmen-light-aqua" : "bg-muted",
                    )}
                  >
                    {/* Render both icons so the browser caches them on first paint;
                        toggle visibility instead of swapping src to avoid a fetch/flash on state change. */}
                    <img
                      src={addPressingActiveUrl}
                      alt=""
                      aria-hidden
                      width={32}
                      height={32}
                      className={cn(
                        "h-8 w-8 select-none",
                        pressActive ? "block" : "hidden",
                      )}
                    />
                    <img
                      src={addPressingInactiveUrl}
                      alt=""
                      aria-hidden
                      width={32}
                      height={32}
                      className={cn(
                        "h-8 w-8 select-none",
                        pressActive ? "hidden" : "block",
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold leading-tight text-primary">
                        Press &amp; Hang
                      </p>
                      <span className="rounded-md bg-washmen-yellow-pill px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        NEW
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs leading-tight text-muted-foreground">
                      Press tops after washing
                    </p>
                  </div>
                  {!locked && (
                    <button
                      type="button"
                      aria-label="Edit pressing selections"
                      onClick={openWashAndFoldInfo}
                      className="flex h-6 w-6 shrink-0 items-center justify-center text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="pl-[60px] flex flex-col gap-1">
                  {displayPressingCats.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-3">
                      <span className="flex-1 text-xs font-light leading-[18px] text-muted-foreground">
                        {cat.label}
                      </span>
                      <span className="shrink-0 rounded-md bg-washmen-light-aqua px-1.5 py-0.5 text-[11px] font-medium leading-[16px] text-primary">
                        + AED {cat.ratePlus} /item
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : !locked ? (
              <>
                <div className="flex items-center px-4 py-1">
                  <div className="flex h-4 w-12 shrink-0 items-center justify-center">
                    <Plus className="h-4 w-4 text-primary" strokeWidth={3} />
                  </div>
                </div>
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
                  locked={locked}
                  onPress={() => services.washAndFold && toggle("addPressing")}
                />
              </>
            ) : null}
          </div>
        )}

        {/* Other services — selected always shown; unselected hidden when locked */}
        {SERVICE_TILES.map((tile) => {
          const selected = services[tile.key];
          if (locked && !selected) return null;
          return (
            <ServiceRow
              key={tile.key}
              iconUrl={tile.iconUrl}
              iconBgClass={tile.iconBgClass}
              title={tile.title}
              link={locked ? undefined : { label: "View Pricing", onPress: () => {} }}
              selected={selected}
              showSelectionIndicator
              locked={locked}
              onPress={() => toggle(tile.key)}
              standalone
            />
          );
        })}
      </div>
    </section>
  );
};

interface ServiceRowProps {
  iconUrl: string;
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
  /** Wraps the row in its own card when true. */
  standalone?: boolean;
  onPress?: () => void;
}

const ServiceRow = ({
  iconUrl,
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
        <img src={iconUrl} alt="" aria-hidden width={32} height={32} className="h-8 w-8 select-none" />
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
