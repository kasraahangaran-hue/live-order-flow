import { useEffect, useRef, useState, type ReactNode } from "react";
import { DoorOpen } from "lucide-react";
import { StatusTimeline, type Stage } from "./StatusTimeline";
import { CancelButton } from "./CancelButton";
import { OrderHeader } from "./OrderHeader";
import type { OrderType } from "@/lib/order-types";

export type HeroVariant = "received" | "processing" | "delivery" | "complete" | "hold";

interface Props {
  status: string;
  subtitle: string;
  stages?: Stage[];
  currentIndex?: number;
  hideTimeline?: boolean;
  cancellable?: boolean;
  completed?: boolean;
  onHold?: boolean;
  variant?: HeroVariant;
  doorPickup?: boolean;
  orderType?: OrderType;
  orderId: string;
  showSupport?: boolean;
  onBack?: () => void;
  showHeader?: boolean;
  /** Externally controlled tuck state. When provided, internal IO sentinel is disabled. */
  tucked?: boolean;
  onTuckedChange?: (tucked: boolean) => void;
  /** Optional Lucide icon node to replace the default HeroArt SVG. */
  heroIcon?: ReactNode;
}

const wrapperAnim: Record<HeroVariant, string> = {
  received: "animate-float",
  processing: "animate-sway",
  delivery: "animate-truck-roll",
  complete: "animate-float",
  hold: "animate-shake",
};

export const StatusHero = ({
  status,
  subtitle,
  stages = [],
  currentIndex = 0,
  hideTimeline = false,
  cancellable = false,
  completed = false,
  onHold = false,
  variant = "received",
  doorPickup = false,
  orderType,
  orderId,
  showSupport = false,
  onBack,
  showHeader = true,
  tucked: tuckedProp,
  onTuckedChange,
  heroIcon,
}: Props) => {
  const v: HeroVariant = onHold ? "hold" : completed ? "complete" : variant;
  const gradientClass = orderType === "finery" ? "bg-gradient-hero-finery" : "bg-gradient-hero";
  const isControlled = tuckedProp !== undefined;

  const [internalTucked, setInternalTucked] = useState(false);
  const tucked = isControlled ? (tuckedProp as boolean) : internalTucked;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const ioSettledRef = useRef(false);

  // IntersectionObserver — only used in uncontrolled mode (legacy sticky behavior)
  useEffect(() => {
    if (isControlled) return;
    const el = sentinelRef.current;
    if (!el) return;
    let commitLockUntil = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!ioSettledRef.current) return;
        if (performance.now() < commitLockUntil) return;
        const next = !entry.isIntersecting;
        setInternalTucked((prev) => {
          if (prev === next) return prev;
          commitLockUntil = performance.now() + 350;
          onTuckedChange?.(next);
          return next;
        });
      },
      { threshold: 0, rootMargin: "0px" }
    );
    io.observe(el);

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ioSettledRef.current = true;
      });
    });

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf1);
    };
  }, [isControlled, onTuckedChange]);

  // Controlled mode: render plain block (no sticky/sentinel/own background/shadow/rounding).
  // The parent owns the gradient, shadow, and rounded bottom on the pinned card wrapper.
  if (isControlled) {
    return (
      <section aria-label="Order status" className="animate-fade-in">
        {showHeader && (
          <OrderHeader
            orderId={orderId}
            orderType={orderType ?? "laundry"}
            showSupport={showSupport}
            onBack={onBack}
            variant="inline"
          />
        )}

        <div
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
          style={{
            gridTemplateRows: tucked ? "0fr" : "1fr",
            opacity: tucked ? 0 : 1,
            pointerEvents: tucked ? "none" : "auto",
          }}
          aria-hidden={tucked}
        >
          <div className="overflow-hidden">
            <div className="relative px-6 pt-2 pb-6">
              <div className="flex items-center gap-4">
                <h1 className="min-w-0 flex-1 text-2xl font-extrabold leading-tight text-primary [text-wrap:balance]">
                  {status}
                </h1>

                <div className={`pointer-events-none shrink-0 opacity-95 h-16 w-16 ${wrapperAnim[v]}`}>
                  {heroIcon ? (
                    <div className="flex h-full w-full items-center justify-center text-primary [&_svg]:h-12 [&_svg]:w-12">
                      {heroIcon}
                    </div>
                  ) : (
                    <HeroArt variant={v} />
                  )}
                </div>
              </div>

              <p className="mt-1.5 text-sm text-muted-foreground tabular">
                {subtitle}
              </p>

              {doorPickup && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-warning-foreground animate-fade-in">
                  <DoorOpen className="h-3.5 w-3.5" />
                  <span>Leave laundry bags at door</span>
                </div>
              )}

              {!hideTimeline && (
                <div className="relative mt-6">
                  <StatusTimeline
                    stages={stages}
                    currentIndex={currentIndex}
                    onHold={onHold}
                    rightSlot={cancellable ? <CancelButton /> : undefined}
                  />
                </div>
              )}

              {/* Breathing room — inside the collapsible region so it disappears when tucked */}
              <div aria-hidden className="h-3" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Uncontrolled (legacy) mode: keep the original sticky + sentinel behavior intact
  // for any other route still consuming StatusHero standalone.
  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <section
        className={`sticky top-0 z-50 ${gradientClass} shadow-hero animate-fade-in transition-[border-radius] duration-300 ${tucked ? "rounded-b-none" : "rounded-b-[28px]"}`}
        aria-label="Order status"
      >
        {showHeader && (
          <div className="relative z-10">
            <OrderHeader
              orderId={orderId}
              orderType={orderType ?? "laundry"}
              showSupport={showSupport}
              onBack={onBack}
              variant="inline"
            />
          </div>
        )}

        <div
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
          style={{
            gridTemplateRows: tucked ? "0fr" : "1fr",
            opacity: tucked ? 0 : 1,
            pointerEvents: tucked ? "none" : "auto",
          }}
          aria-hidden={tucked}
        >
          <div className="overflow-hidden">
            <div className="relative px-6 pt-2 pb-6">
              <div className="flex items-center gap-4">
                <h1 className="min-w-0 flex-1 text-2xl font-extrabold leading-tight text-primary [text-wrap:balance]">
                  {status}
                </h1>

                <div className={`pointer-events-none shrink-0 opacity-95 h-16 w-16 ${wrapperAnim[v]}`}>
                  {heroIcon ? (
                    <div className="flex h-full w-full items-center justify-center text-primary [&_svg]:h-12 [&_svg]:w-12">
                      {heroIcon}
                    </div>
                  ) : (
                    <HeroArt variant={v} />
                  )}
                </div>
              </div>

              <p className="mt-1.5 text-sm text-muted-foreground tabular">
                {subtitle}
              </p>

              {doorPickup && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-warning-foreground animate-fade-in">
                  <DoorOpen className="h-3.5 w-3.5" />
                  <span>Leave laundry bags at door</span>
                </div>
              )}

              {!hideTimeline && (
                <div className="relative mt-6">
                  <StatusTimeline
                    stages={stages}
                    currentIndex={currentIndex}
                    onHold={onHold}
                    rightSlot={cancellable ? <CancelButton /> : undefined}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div aria-hidden className="h-3" />
      </section>
    </>
  );
};

const HeroArt = ({ variant }: { variant: HeroVariant }) => {
  if (variant === "processing") return <WashingMachineDetailed />;
  if (variant === "delivery") return <DeliveryTruck />;
  if (variant === "complete") return <ShirtHanger />;
  if (variant === "hold") return <CardAlert />;
  if (variant === "received") return <PhoneConfirm />;
  return <LaundryBag />;
};

const WashingMachineDetailed = () => (
  <svg viewBox="0 0 128 128" fill="none" className="h-full w-full">
    {bagDefs}
    {/* body */}
    <rect x="30" y="30" width="68" height="78" rx="12" fill="url(#bag)" opacity="0.95" />
    {/* control panel */}
    <rect x="36" y="36" width="56" height="9" rx="4" fill="hsl(var(--card))" opacity="0.4" />
    <circle cx="46" cy="40" r="1.8" fill="hsl(var(--card))" />
    <circle cx="54" cy="40" r="1.8" fill="hsl(var(--card))" />
    {/* drum */}
    <circle cx="64" cy="74" r="22" fill="hsl(var(--card))" opacity="0.95" />
    <g className="animate-spin-slow" style={{ transformOrigin: "64px 74px" }}>
      <circle cx="64" cy="74" r="17" fill="hsl(var(--surface-mint))" />
      <circle cx="56" cy="66" r="3" fill="hsl(var(--accent))" opacity="0.85" />
      <circle cx="72" cy="70" r="2.2" fill="hsl(var(--primary))" opacity="0.6" />
      <circle cx="60" cy="82" r="2.6" fill="hsl(var(--accent))" opacity="0.7" />
      <circle cx="73" cy="80" r="1.8" fill="hsl(var(--primary))" opacity="0.5" />
    </g>
  </svg>
);

const bagDefs = (
  <defs>
    <linearGradient id="bag" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="hsl(var(--primary))" />
      <stop offset="100%" stopColor="hsl(var(--accent))" />
    </linearGradient>
    <linearGradient id="bagAlert" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="hsl(var(--destructive))" />
      <stop offset="100%" stopColor="hsl(var(--accent))" />
    </linearGradient>
    <linearGradient id="bagSuccess" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="hsl(var(--success))" />
      <stop offset="100%" stopColor="hsl(var(--accent))" />
    </linearGradient>
  </defs>
);

const LaundryBag = () => (
  <svg viewBox="0 0 128 128" fill="none" className="h-full w-full">
    {bagDefs}
    <path
      d="M40 44 L88 44 C92 44 95 47 95 51 L100 102 C100 108 96 112 90 112 L38 112 C32 112 28 108 28 102 L33 51 C33 47 36 44 40 44 Z"
      fill="url(#bag)"
      opacity="0.95"
    />
    <path d="M52 44 C52 30 56 24 64 24 C72 24 76 30 76 44" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="56" cy="74" r="4" fill="hsl(var(--card))" opacity="0.9" />
    <circle cx="72" cy="84" r="3" fill="hsl(var(--card))" opacity="0.7" />
    <circle cx="62" cy="92" r="2.5" fill="hsl(var(--card))" opacity="0.6" />
  </svg>
);

const DeliveryTruck = () => (
  <svg viewBox="0 0 128 128" fill="none" className="h-full w-full">
    {bagDefs}
    {/* truck body */}
    <rect x="14" y="32" width="60" height="42" rx="8" fill="url(#bag)" opacity="0.95" />
    {/* cab */}
    <path d="M74 42 L96 42 L110 60 L110 74 L74 74 Z" fill="hsl(var(--primary))" opacity="0.9" />
    {/* window */}
    <rect x="80" y="48" width="22" height="14" rx="3" fill="hsl(var(--card))" opacity="0.7" />
    {/* wheels */}
    <circle cx="36" cy="82" r="9" fill="hsl(var(--indigo-deep))" />
    <circle cx="36" cy="82" r="3.5" fill="hsl(var(--card))" />
    <circle cx="92" cy="82" r="9" fill="hsl(var(--indigo-deep))" />
    <circle cx="92" cy="82" r="3.5" fill="hsl(var(--card))" />
    {/* speed lines */}
    <path d="M2 60 L18 60" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    <path d="M0 70 L14 70" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const ShirtHanger = () => (
  <svg viewBox="0 0 128 128" fill="none" className="h-full w-full">
    {bagDefs}
    {/* soft glow */}
    <circle cx="64" cy="64" r="52" fill="hsl(var(--success))" opacity="0.12" />
    {/* check circle */}
    <circle cx="64" cy="64" r="42" fill="hsl(var(--success))" />
    <path
      d="M46 65 L58 77 L84 50"
      stroke="hsl(var(--card))"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* sparkles */}
    <circle cx="18" cy="32" r="2" fill="hsl(var(--accent))" className="animate-sparkle" />
    <circle cx="114" cy="40" r="1.8" fill="hsl(var(--accent))" className="animate-sparkle" style={{ animationDelay: "400ms" }} />
    <circle cx="110" cy="100" r="1.6" fill="hsl(var(--accent))" className="animate-sparkle" style={{ animationDelay: "750ms" }} />
  </svg>
);

const PhoneConfirm = () => (
  <svg viewBox="0 0 128 128" fill="none" className="h-full w-full">
    {bagDefs}
    {/* phone body — iPhone-like proportions */}
    <rect x="30" y="14" width="68" height="100" rx="14" fill="hsl(var(--primary))" />
    {/* inner bezel */}
    <rect x="33" y="17" width="62" height="94" rx="12" fill="hsl(var(--indigo-deep))" opacity="0.7" />
    {/* screen background — tinted, not white */}
    <rect x="36" y="20" width="56" height="88" rx="9" fill="hsl(var(--indigo-deep))" />
    <rect x="36" y="20" width="56" height="88" rx="9" fill="url(#bag)" opacity="0.85" />
    {/* dynamic island / notch */}
    <rect x="55" y="24" width="18" height="5" rx="2.5" fill="hsl(var(--indigo-deep))" />

    {/* notification card */}
    <rect x="40" y="36" width="48" height="34" rx="5" fill="hsl(var(--card))" opacity="0.95" />
    {/* app icon (tiny check tile) */}
    <rect x="43" y="39" width="9" height="9" rx="2" fill="hsl(var(--success))" />
    <path d="M45 43.5 L47 45.5 L50 42" stroke="hsl(var(--card))" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* notification text lines */}
    <rect x="55" y="40" width="22" height="2" rx="1" fill="hsl(var(--primary))" opacity="0.85" />
    <rect x="55" y="44" width="14" height="1.6" rx="0.8" fill="hsl(var(--primary))" opacity="0.5" />
    <rect x="43" y="52" width="42" height="1.6" rx="0.8" fill="hsl(var(--primary))" opacity="0.4" />
    <rect x="43" y="56" width="36" height="1.6" rx="0.8" fill="hsl(var(--primary))" opacity="0.4" />
    <rect x="43" y="60" width="28" height="1.6" rx="0.8" fill="hsl(var(--primary))" opacity="0.4" />

    {/* home indicator */}
    <rect x="54" y="103" width="20" height="2" rx="1" fill="hsl(var(--card))" opacity="0.6" />

    {/* side buttons */}
    <rect x="28" y="36" width="2" height="10" rx="1" fill="hsl(var(--indigo-deep))" opacity="0.7" />
    <rect x="28" y="52" width="2" height="14" rx="1" fill="hsl(var(--indigo-deep))" opacity="0.7" />
    <rect x="98" y="44" width="2" height="18" rx="1" fill="hsl(var(--indigo-deep))" opacity="0.7" />
    {/* sparkles */}
    <circle cx="18" cy="34" r="2.2" fill="hsl(var(--accent))" className="animate-sparkle" />
    <circle cx="112" cy="38" r="2" fill="hsl(var(--accent))" className="animate-sparkle" style={{ animationDelay: "350ms" }} />
  </svg>
);

const CardAlert = () => (
  <svg viewBox="0 0 128 128" fill="none" className="h-full w-full">
    {bagDefs}
    {/* card body */}
    <rect x="14" y="38" width="92" height="60" rx="8" fill="url(#bagAlert)" opacity="0.95" />
    {/* magnetic stripe */}
    <rect x="14" y="50" width="92" height="10" fill="hsl(var(--indigo-deep))" opacity="0.55" />
    {/* chip */}
    <rect x="24" y="68" width="14" height="11" rx="2" fill="hsl(var(--card))" opacity="0.85" />
    <path d="M24 73 L38 73 M31 68 L31 79" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.7" />
    {/* number dots */}
    <g fill="hsl(var(--card))" opacity="0.75">
      <circle cx="48" cy="86" r="1.4" />
      <circle cx="52" cy="86" r="1.4" />
      <circle cx="56" cy="86" r="1.4" />
      <circle cx="60" cy="86" r="1.4" />
      <circle cx="68" cy="86" r="1.4" />
      <circle cx="72" cy="86" r="1.4" />
      <circle cx="76" cy="86" r="1.4" />
      <circle cx="80" cy="86" r="1.4" />
    </g>
    {/* alert badge */}
    <circle cx="98" cy="34" r="16" fill="hsl(var(--destructive))" />
    <circle cx="98" cy="34" r="16" stroke="hsl(var(--card))" strokeWidth="2.5" fill="none" />
    <rect x="96" y="24" width="4" height="12" rx="2" fill="hsl(var(--card))" />
    <circle cx="98" cy="42" r="2.2" fill="hsl(var(--card))" />
  </svg>
);
