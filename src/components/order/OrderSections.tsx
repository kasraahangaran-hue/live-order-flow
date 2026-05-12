import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronRight,
  Camera,
  Plus,
  Pencil,
  WashingMachine,
  Shirt,
  BedDouble,
  Footprints,
  Crown,
  Wind,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import type { OrderData } from "@/lib/order-types";

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

export const ServicesSelection = ({ locked = false }: { locked?: boolean }) => {
  return (
    <section
      className="mx-5 mt-4 rounded-lg border border-border bg-card animate-fade-in p-4"
      style={{ animationDelay: "250ms" }}
    >
      <h3 className="font-sans text-sm font-bold text-primary leading-tight">Services Selection</h3>
      <ul className="mt-3 divide-y divide-border/60">
        {/* Selected: Wash & Fold (with nested Press & Hang add-on) */}
        <li className="py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
              <WashingMachine className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary tabular">Wash & Fold</p>
            </div>
            <span
              aria-label="Wash & Fold selected"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          </div>

          {/* nested add-on under Wash & Fold */}
          <div className="mt-2 ml-[22px] flex items-center gap-3 border-l-2 border-border/70 pl-3 py-1.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary/70 text-muted-foreground">
              <Shirt className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Add-on</p>
                <span className="rounded-md bg-warning px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-warning-foreground">
                  New
                </span>
              </div>
              <p className="truncate text-xs font-semibold text-primary tabular">Press & Hang · +AED 9/item</p>
            </div>
            {!locked && (
              <button
                aria-label="Add Press & Hang"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-transform duration-100 ease-out active:duration-75 active:scale-90"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </li>

        {/* Other services — only shown while still editable */}
        {!locked &&
          [
            { label: "Clean & Press", Icon: Crown },
            { label: "Bed & Bath", Icon: BedDouble },
            { label: "Press Only", Icon: Wind },
            { label: "Try ShoeCare", Icon: Footprints },
            { label: "The Finery", Icon: Crown },
          ].map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-primary tabular">{label}</p>
              </div>
              <button
                aria-label={`Add ${label}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-transform duration-100 ease-out active:duration-75 active:scale-90"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </li>
          ))}
      </ul>
    </section>
  );
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
