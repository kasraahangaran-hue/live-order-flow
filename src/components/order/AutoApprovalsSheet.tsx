import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import bagWashFoldUrl from "@/assets/icons/bag-wash-fold.svg";

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

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex w-full items-center gap-[14px] min-h-[40px] pl-2 pr-2 transition-opacity active:opacity-70"
    >
      <span
        className={cn(
          "flex-1 text-left text-[12px] leading-[18px] tracking-[0.1px]",
          selected ? "font-normal text-primary" : "font-extralight text-muted-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
          selected ? "border-primary" : "border-washmen-cloudy",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "h-[10px] w-[10px] rounded-full bg-primary transition-all duration-200 ease-out",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
    </button>
  );
}

export function AutoApprovalsSheet({ open, onOpenChange, value, onApply }: Props) {
  const [draft, setDraft] = useState<AutoApprovalsState>(value);

  useEffect(() => {
    if (open) setDraft(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="flex max-h-[92dvh] flex-col rounded-t-[24px] border-0 bg-white"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
      >
        <div className="shrink-0 px-6 pt-4">
          <h2 className="text-[20px] font-bold leading-[24px] tracking-[0.4px] text-primary">
            Auto-Approvals
          </h2>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-2 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                <img src={bagWashFoldUrl} alt="" className="h-6 w-6 select-none" />
              </div>
              <p className="text-[14px] font-medium leading-[20px] text-primary">
                Wash and Fold Approval
              </p>
            </div>
            <p className="text-[12px] font-extralight leading-[18px] tracking-[0.2px] text-primary">
              In order to protect your delicate &amp; expensive items, our team will flag items
              that we believe might not be suitable to Wash &amp; Fold and will require your
              approval on how to proceed
            </p>
            <div className="flex flex-col gap-2">
              {WF_OPTIONS.map((opt) => (
                <RadioRow
                  key={opt.value}
                  label={opt.label}
                  selected={draft.washFold === opt.value}
                  onSelect={() => setDraft((d) => ({ ...d, washFold: opt.value }))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 pt-3 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-[42px] w-12 items-center justify-center rounded-[8px] border border-primary bg-white transition-opacity active:opacity-70"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
              className="flex h-[42px] w-full items-center justify-center rounded-[8px] bg-primary text-[14px] font-medium text-white transition-colors hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
