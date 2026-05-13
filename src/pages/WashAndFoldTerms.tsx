import { Check, X, HelpCircle, ChevronDown, ChevronUp, Plus, Pencil } from "lucide-react";
import approveIconUrl from "@/assets/icons/instruction-approve.svg";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { wfPlusTermsStore } from "@/lib/wf-plus-terms-store";
import {
  AutoApprovalsSheet,
  type AutoApprovalsState,
  type WashFoldApproval,
} from "@/components/order/AutoApprovalsSheet";
import { cn } from "@/lib/utils";

const WF_SHORT_LABELS: Record<WashFoldApproval, string> = {
  notify: "Notify me",
  "transfer-clean-press": "Transfer to clean & press",
  "wash-anyway": "Wash anyway",
  "do-not-wash": "Do not wash",
};

const DEFAULT_AUTO_APPROVALS: AutoApprovalsState = {
  stainDamageApprove: false,
  washFold: "notify",
};

interface LocationState {
  mode?: "gate" | "view";
  /** Where to navigate after I UNDERSTAND in gate mode */
  returnTo?: string;
}

const SUITABLE_BULLETS = [
  "Any clothing or home items applicable for machine wash at 35°C",
  "Items that can tolerate tumble drying",
  "Materials: cotton, polyester, nylon, linen, modal, tencel, spandex and heat resistant materials",
];

const NOT_SUITABLE_BULLETS = [
  "Delicate or expensive items you love",
  "Items that require expert stain removal",
  "Items for dry cleaning or hand wash",
  "Items that require air dry (no tumble dry)",
  "Suits, dresses, formal and traditional wear",
  "Materials: silk, cashmere, wool, leather, velvet, exotic furs & leathers, embroidery and other delicate items",
];

export default function WashAndFoldTerms() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? {};
  const mode = state.mode ?? "view";
  const returnTo = state.returnTo;

  const [faqOpen, setFaqOpen] = useState(false);
  const [suitableOpen, setSuitableOpen] = useState(true);
  const [notSuitableOpen, setNotSuitableOpen] = useState(true);
  const [autoApprovalsSheetOpen, setAutoApprovalsSheetOpen] = useState(false);
  const [autoApprovals, setAutoApprovals] = useState<AutoApprovalsState>(DEFAULT_AUTO_APPROVALS);
  const wfConfigured = autoApprovals.washFold !== "notify";

  const handleAcknowledge = () => {
    if (mode === "gate") {
      wfPlusTermsStore.set(true);
    }
    if (typeof returnTo === "string") {
      navigate(returnTo, { replace: mode === "gate" });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 bg-background px-6 pt-[max(env(safe-area-inset-top),24px)] pb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold leading-[28px] text-primary">
            Wash &amp; Fold+ Terms
          </h1>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto overscroll-contain px-6 pt-3 pb-32">
        <div className="flex flex-col gap-3">
          {/* Card 1 — Suitable */}
          <Collapsible open={suitableOpen} onOpenChange={setSuitableOpen}>
            <div className="rounded-[6px] border border-border bg-card p-4">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-washmen-primary-green text-primary">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    ONLY Suitable for:
                  </p>
                </div>
                {suitableOpen ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-washmen-slate" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-washmen-slate" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-xs text-washmen-slate">
                  {SUITABLE_BULLETS.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Card 2 — Not Suitable */}
          <Collapsible open={notSuitableOpen} onOpenChange={setNotSuitableOpen}>
            <div className="rounded-[6px] border border-border bg-card p-4">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-washmen-red text-white">
                    <X className="h-4 w-4" strokeWidth={3} />
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    NOT Suitable for:
                  </p>
                </div>
                {notSuitableOpen ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-washmen-slate" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-washmen-slate" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-xs text-washmen-slate">
                  {NOT_SUITABLE_BULLETS.map((b) => (
                    <li key={b}>
                      {b},
                      <ul className="mt-1 list-disc pl-5 marker:text-foreground">
                        <li className="text-xs font-bold text-foreground">
                          use Clean &amp; Press instead{" "}
                          <button
                            type="button"
                            className="font-medium text-primary underline"
                          >
                            Learn more
                          </button>
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 pl-5 text-xs font-semibold text-foreground underline">
                  Damage compensation will be limited to AED 200 an item
                </p>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* FAQ */}
          <Collapsible open={faqOpen} onOpenChange={setFaqOpen}>
            <div className="rounded-[6px] bg-washmen-light-red px-4 py-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left leading-none">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <HelpCircle className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    What if I send an unsuitable item?
                  </p>
                </div>
                {faqOpen ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-primary" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3 flex flex-col gap-3 pb-2">
                  <p className="text-xs text-washmen-slate">
                    Our team will identify it during sorting and contact you. Unsuitable items can be returned unwashed or transferred to Clean &amp; Press at standard pricing.
                  </p>
                  <p className="text-xs text-washmen-slate">
                    You can also set automatic approvals on what we should do:
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAutoApprovalsSheetOpen(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-[6px] bg-card px-4 py-3 text-left transition-opacity active:opacity-80"
                  >
                    <img
                      src={approveIconUrl}
                      alt=""
                      className="h-5 w-5 shrink-0 select-none"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-foreground">
                          Auto-Approvals
                        </span>
                        {wfConfigured ? (
                          <Pencil className="h-4 w-4 shrink-0 text-washmen-slate" />
                        ) : (
                          <Plus className="h-5 w-5 shrink-0 text-washmen-slate" />
                        )}
                      </div>
                      {wfConfigured && (
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-washmen-slate">
                            Wash &amp; Fold:{" "}
                            <span className="font-medium text-foreground">
                              {WF_SHORT_LABELS[autoApprovals.washFold]}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-6 py-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur">
        <Button
          onClick={handleAcknowledge}
          className={cn("h-[42px] w-full rounded-[8px] text-sm font-semibold uppercase tracking-wide")}
        >
          I UNDERSTAND
        </Button>
      </footer>

      <AutoApprovalsSheet
        open={autoApprovalsSheetOpen}
        onOpenChange={setAutoApprovalsSheetOpen}
        value={autoApprovals}
        onApply={setAutoApprovals}
      />
    </div>
  );
}
