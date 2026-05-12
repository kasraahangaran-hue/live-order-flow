import React from "react";
import { Clock, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButton {
  label: string;
  onClick?: () => void;
  variant: "primary" | "secondary";
}

interface ActionCardProps {
  variant: "urgent" | "attention";
  icon: React.ReactElement;
  title: string;
  message: string;
  amountDue?: string;
  primaryAction: ActionButton;
  secondaryAction?: ActionButton;
  countdown?: string;
}

export const ActionCard = ({
  variant,
  icon,
  title,
  message,
  amountDue,
  primaryAction,
  secondaryAction,
  countdown,
}: ActionCardProps) => {
  const isUrgent = variant === "urgent";
  const surfaceClass = isUrgent ? "bg-surface-attention-urgent" : "bg-surface-attention-soft";
  const accentText = isUrgent ? "text-destructive" : "text-warning-dark";
  const accentBg = isUrgent ? "bg-destructive" : "bg-warning-amber";
  const accentBorder = isUrgent ? "border-destructive" : "border-warning-dark";

  const renderButton = (btn: ActionButton, key: string) => {
    if (btn.variant === "primary") {
      return (
        <button
          key={key}
          type="button"
          onClick={btn.onClick}
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-press transition-transform duration-100 ease-out hover:brightness-110 active:duration-75 active:scale-[0.97]",
            accentBg,
          )}
        >
          {btn.label}
        </button>
      );
    }
    return (
      <button
        key={key}
        type="button"
        onClick={btn.onClick}
        className={cn(
          "inline-flex items-center justify-center rounded-xl border bg-transparent px-4 py-2.5 text-xs font-semibold transition-transform duration-100 ease-out hover:bg-card/40 active:duration-75 active:scale-[0.96]",
          accentBorder,
          accentText,
        )}
      >
        {btn.label}
      </button>
    );
  };

  // Render icon directly (no filled tile) at h-6 w-6, inheriting accent color.
  const sizedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: cn("h-4 w-4", (icon.props as { className?: string }).className),
      })
    : icon;

  return (
    <section
      className={cn("mx-5 mt-4 rounded-xl p-4 animate-fade-in", surfaceClass)}
      style={{ animationDelay: "60ms" }}
    >
      <div className="flex items-start gap-3">
        <span className={cn("shrink-0 pt-0.5", accentText)}>{sizedIcon}</span>
        <div className="min-w-0 flex-1">
          <h3 className={cn("font-sans text-sm font-bold leading-tight", accentText)}>{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{message}</p>

          {amountDue && (
            <div className={cn("mt-2 inline-flex items-center gap-1.5 text-xs font-bold tabular", accentText)}>
              <CreditCard className="h-3.5 w-3.5" />
              <span>{amountDue}</span>
            </div>
          )}

          {countdown && (
            <div className={cn("mt-1 inline-flex items-center gap-1.5 text-xs font-semibold", accentText)}>
              <Clock className="h-3.5 w-3.5" />
              <span>{countdown}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {renderButton(primaryAction, "primary")}
        {secondaryAction && renderButton(secondaryAction, "secondary")}
      </div>
    </section>
  );
};
