import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WashingMachine } from "lucide-react";
import { cn } from "@/lib/utils";

export type WashFoldApproval =
  | "notify"
  | "transfer-clean-press"
  | "wash-anyway"
  | "do-not-wash";

export interface AutoApprovalsState {
  /** Kept for backwards compatibility with existing summary code; unused in UI. */
  stainDamageApprove?: boolean;
  washFold: WashFoldApproval;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AutoApprovalsState;
  onApply: (value: AutoApprovalsState) => void;
}

const WF_OPTIONS: { value: WashFoldApproval; label: string }[] = [
  { value: "notify", label: "Always notify me of the items in question so I can decide (default)" },
  { value: "transfer-clean-press", label: "Automatically transfer items to the clean & press service and notify me" },
  { value: "wash-anyway", label: "Always wash any items I send in the wash & fold bag, regardless of the risk involved and notify me" },
  { value: "do-not-wash", label: "Do not wash and return unprocessed" },
];

export function AutoApprovalsSheet({ open, onOpenChange, value, onApply }: Props) {
  const [draft, setDraft] = useState<AutoApprovalsState>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[90vh] flex-col gap-0 rounded-t-3xl border-t p-0"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <SheetHeader className="flex-shrink-0 border-b border-border p-4 text-center">
          <SheetTitle className="text-base font-bold text-primary">Auto-Approvals</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-washmen-light-aqua text-primary">
                <WashingMachine className="h-4 w-4" strokeWidth={2} />
              </div>
              <p className="text-sm font-medium text-primary">Wash and Fold Approval</p>
            </div>
            <p className="text-[13px] font-light leading-[18px] text-primary">
              In order to protect your delicate &amp; expensive items, our team will flag items that we believe might not be suitable to Wash &amp; Fold and will require your approval on how to proceed
            </p>
            <div className="flex flex-col gap-2">
              {WF_OPTIONS.map((opt) => {
                const selected = draft.washFold === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, washFold: opt.value }))}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                      selected ? "border-primary bg-washmen-light-aqua/40" : "border-border bg-card",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        selected ? "border-primary" : "border-muted-foreground/40",
                      )}
                      aria-hidden
                    >
                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-[13px] leading-[18px]",
                        selected ? "font-medium text-primary" : "text-muted-foreground",
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-border p-4">
          <Button
            onClick={() => {
              onApply(draft);
              onOpenChange(false);
            }}
            className="h-[42px] w-full rounded-lg text-sm font-semibold uppercase tracking-wide"
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
